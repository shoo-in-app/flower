// server/app.js
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const {
  getUser,
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
} = require("./query.js");

const app = express();

app.use("/", [bodyParser.json(), bodyParser.urlencoded({ extended: true })]);

// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

app.post("/user/", async (req, res) => {
  try {
    const idToken = req.body.idToken;
    const user = await getUser(idToken);
    if (user.length === 0) {
      await addUser(idToken, req.body.username);
    }
    res.send("Log in");
  } catch (err) {
    console.error("Error adding user!", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/rallies", async (req, res) => {
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

app.get("/rallies/:idToken", async (req, res) => {
  try {
    const userId = (await getUser(req.params.idToken))[0].id;
    const chosenRallies = {};
    const chosenLocations = await getLocationsWithRallyInfoUserChoose(userId);
    chosenLocations.forEach((location) => {
      if (!chosenRallies.hasOwnProperty(location.rally_id)) {
        chosenRallies[location.rally_id] = {
          id: location.rally_id,
          title: location.title,
          description: location.description,
          complete: chosenLocations.every((location) => location.visited),
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

    const ralliesIdsUserchosen = (await getRalliesOfUser(userId)).map(
      (rally) => rally.rally_id
    );
    const locations = await getLocationsWithRallyInfo();
    const notChosenRallies = {};
    locations
      .filter((rally) => !ralliesIdsUserchosen.includes(rally.rally_id))
      .forEach((location) => {
        if (!notChosenRallies.hasOwnProperty(location.rally_id)) {
          notChosenRallies[location.rally_id] = {
            id: location.rally_id,
            title: location.title,
            description: location.description,
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

app.patch("/rally/:idToken/:rallyId", async (req, res) => {
  try {
    const userId = (await getUser(req.params.idToken))[0].id;
    const rallyId = req.params.rallyId;
    const locationIds = (await getLocationsOfRally(rallyId)).map(
      (location) => location.id
    );
    if (req.body.chosen === true) {
      await insertRalliesToUsers(userId, rallyId);
      const data = locationIds.map((id) => ({
        user_id: userId,
        location_id: id,
        visited: false,
      }));
      await insertLocationsToUsers(data);
      res.send("The rally is now chosen.");
    } else if (req.body.chosen === false) {
      await deleteRalliesToUsers(userId, rallyId);
      await deleteLocationsToUsers(userId, locationIds);
      res.send("The rally is now cancelled.");
    }
    res.send("Failed. Boolean key 'chosen' should be in body.");
  } catch (err) {
    console.error("Error updating user history!", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/locations/:idToken/:rallyId", async (req, res) => {
  try {
    const locations = await getLocationsOfRallyOfUser(
      req.params.idToken,
      req.params.rallyId
    );
    res.send(locations);
  } catch (err) {
    console.error("Error loading user history!", err);
    res.status(500).send("Internal server error");
  }
});

app.patch("/location/:idToken/:locationId", async (req, res) => {
  try {
    const visited = req.body.visited;
    const userId = (await getUser(req.params.idToken))[0].id;
    await doneLocation(userId, req.params.locationId, visited);
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

module.exports = app;
