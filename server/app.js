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
} = require("./query.js");

const app = express();

app.use("/", [bodyParser.json(), bodyParser.urlencoded({ extended: true })]);

// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

app.get("/user/:username", async (req, res) => {
  try {
    const user = await getUser(req.params.username);
    res.send(user[0]);
  } catch (err) {
    console.error("Error loading user!", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/user/", async (req, res) => {
  try {
    const username = req.body.username;
    const user = await getUser(username);
    if (user.length === 0) {
      await addUser(req.body.idToken, username);
      res.send({ login: true });
    } else if (req.body.idToken === user[0].id_token) {
      res.send({ login: true });
    } else {
      res.send({ login: false });
    }
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

app.get("/rallies/:username", async (req, res) => {
  try {
    const ralliesOfUser = await getRalliesOfUser(req.params.username);
    res.send(ralliesOfUser);
  } catch (err) {
    console.error("Error loading highways!", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/locations/:username/:rallyId", async (req, res) => {
  try {
    const locations = await getLocations(
      req.params.username,
      req.params.rallyId
    );
    res.send(locations);
  } catch (err) {
    console.error("Error loading user history!", err);
    res.status(500).send("Internal server error");
  }
});

app.patch("/location/:username/:locationId", async (req, res) => {
  try {
    const visited = req.body.visited;
    await doneLocation(req.params.username, req.params.locationId, visited);
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
