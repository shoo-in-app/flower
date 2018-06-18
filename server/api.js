// server/app.js
const router = require("express").Router();
const {
  getUser,
  deleteUser,
  addUser,
  getLocationsWithRallyInfo,
  getRalliesOfUser,
  getLocationsOfRally,
  getLocationsOfRallyOfUser,
  doneLocation,
  getLocationsWithRallyInfoUserChoose,
  insertRalliesToUsers,
  insertLocationsToUsers,
  deleteRalliesToUsers,
  deleteLocationsToUsers,
  addRally,
  addLocations,
  incrementExp,
} = require("./query.js");
const crypto = require("crypto");

router.post("/user/", async (req, res) => {
  try {
    const email = req.body.email;
    const hash = crypto
      .createHmac("sha256", email)
      .update("super secret password")
      .digest("hex");
    let user = await getUser(hash);
    if (!user) user = await addUser(hash, req.body.username, email);
    res.send({
      userID: user.hash,
      username: user.username,
      email: user.email,
      exp: user.exp,
    });
  } catch (err) {
    console.error("Error adding user!", err);
    res.status(500).send("Internal server error");
  }
});

router.delete("/user/:userID", async (req, res) => {
  try {
    await deleteUser(userID);
    res.send(`USER:${userID} was correctly deleted`);
  } catch (err) {
    console.error("Error deleting user!", err);
    res.status(500).send("Internal server error");
  }
});

router.patch("/exp/:userID", async (req, res) => {
  try {
    const userID = (await getUser(req.params.userID)).id;
    await incrementExp(userID, exp);
    res.send(`${user.username} has ${exp} exp now.`);
  } catch (err) {
    console.error("Error adding user!", err);
    res.status(500).send("Internal server error");
  }
});

router.get("/rallies", async (req, res) => {
  try {
    const locations = await getLocationsWithRallyInfo();
    const rallies = {};
    locations.forEach((location) => {
      if (!rallies.hasOwnProperty(location.rally_id)) {
        rallies[location.rally_id] = {
          id: location.rally_id,
          title: location.title,
          description: location.description,
          locations: [],
        };
      }
      rallies[location.rally_id].locations.push({
        id: location.id,
        name: location.name,
        description: location.ldescription,
        lat: location.lat,
        lng: location.lng,
      });
    });
    res.send(Object.values(rallies));
  } catch (err) {
    console.error("Error loading rallies!", err);
    res.status(500).send("Internal server error");
  }
});

router.get("/rallies/:userID", async (req, res) => {
  try {
    const userID = (await getUser(req.params.userID)).id;
    const chosenRallies = {};
    const chosenLocations = await getLocationsWithRallyInfoUserChoose(userID);
    chosenLocations.forEach((location) => {
      if (!chosenRallies.hasOwnProperty(location.rally_id)) {
        chosenRallies[location.rally_id] = {
          id: location.rally_id,
          creator_name: location.username,
          title: location.title,
          description: location.description,
          complete: chosenLocations.every((location) => location.visited),
          start_datetime: location.start_datetime,
          end_datetime: location.end_datetime,
          user_count: location.user_count,
          locations: [],
        };
      }
      chosenRallies[location.rally_id].locations.push({
        id: location.id,
        name: location.name,
        description: location.ldescription,
        lat: location.lat,
        lng: location.lng,
        visited: location.visited,
      });
    });

    const ralliesIDsUserchosen = (await getRalliesOfUser(userID)).map(
      (rally) => rally.rally_id
    );
    const locations = await getLocationsWithRallyInfo();
    const notChosenRallies = {};
    locations
      .filter((rally) => !ralliesIDsUserchosen.includes(rally.rally_id))
      .forEach((location) => {
        if (!notChosenRallies.hasOwnProperty(location.rally_id)) {
          notChosenRallies[location.rally_id] = {
            id: location.rally_id,
            creator_name: location.username,
            title: location.title,
            description: location.description,
            start_datetime: location.start_datetime,
            end_datetime: location.end_datetime,
            user_count: location.user_count,
            locations: [],
          };
        }
        notChosenRallies[location.rally_id].locations.push({
          id: location.id,
          name: location.name,
          description: location.ldescription,
          lat: location.lat,
          lng: location.lng,
        });
      });

    res.send({
      chosen: Object.values(chosenRallies),
      notChosen: Object.values(notChosenRallies),
    });
  } catch (err) {
    console.error("Error loading locations!", err);
    res.status(500).send("Internal server error");
  }
});

router.patch("/rally/:userID/:rallyID", async (req, res) => {
  try {
    const userID = (await getUser(req.params.userID)).id;
    const rallyID = req.params.rallyID;
    const locationIDs = (await getLocationsOfRally(rallyID)).map(
      (location) => location.id
    );
    if (req.body.chosen === true) {
      await insertRalliesToUsers(userID, rallyID);
      const data = locationIDs.map((id) => ({
        user_id: userID,
        location_id: id,
        visited: false,
      }));
      await insertLocationsToUsers(data);
      res.send("The rally is now chosen.");
    } else if (req.body.chosen === false) {
      await deleteRalliesToUsers(userID, rallyID);
      await deleteLocationsToUsers(userID, locationIDs);
      res.send("The rally is now cancelled.");
    }
    res.send("Failed. Boolean key 'chosen' should be in body.");
  } catch (err) {
    console.error("Error updating user history!", err);
    res.status(500).send("Internal server error");
  }
});

router.get("/locations/:userID/:rallyID", async (req, res) => {
  try {
    const userID = (await getUser(req.params.userID)).id;
    const locations = await getLocationsOfRallyOfUser(
      userID,
      req.params.rallyID
    );
    res.send(locations);
  } catch (err) {
    console.error("Error loading user history!", err);
    res.status(500).send("Internal server error");
  }
});

router.patch("/location/:userID/:locationID", async (req, res) => {
  try {
    const visited = req.body.visited;
    const userID = (await getUser(req.params.userID)).id;
    await doneLocation(userID, req.params.locationID, visited);
    if (visited) {
      res.send("The location is now visited.");
    } else {
      res.send("The location is now unvisited.");
    }
  } catch (err) {
    console.error("Error updating user history!", err);
    res.status(500).send("Internal server error");
  }
});

router.post("/rally/", async (req, res) => {
  try {
    const rallyID = await addRally(req.body.title, req.body.description);
    const locations = req.body.locations.map((l) => ({
      rally_id: rallyID,
      ...l,
    }));
    await addLocations(locations);
    res.send("The rally is now added.");
  } catch (err) {
    console.error("Error adding new rally!", err);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
