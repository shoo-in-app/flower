// server/app.js
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const {
  getUser,
  addUser,
  getLocationsWithRallyInfo,
  getRalliesOfUser,
  getLocations,
  doneLocation,
  getLocationsWithRallyInfoUserChoose,
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

    const ralliesIdsToRemove = (await getRalliesOfUser(userId)).map(
      (rally) => rally.id
    );
    const locations = await getLocationsWithRallyInfo();
    console.log(ralliesIdsToRemove, locations);
    const notChosenRallies = {};
    locations
      .filter((rally) => !ralliesIdsToRemove.includes(rally.rally_id))
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

app.get("/locations/:idToken/:rallyId", async (req, res) => {
  try {
    const locations = await getLocations(
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
    await doneLocation(req.params.idToken, req.params.locationId, visited);
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
