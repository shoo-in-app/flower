// server/app.js
const express = require("express");
const morgan = require("morgan");
const {
  getUser,
  addUser,
  getRallies,
  getRalliesOfUser,
  getLocations,
  doneLocation,
} = require("./query.js");

const app = express();

// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

app.get("/user/:userId", async (req, res) => {
  try {
    const user = await getUser(req.params.userId);
    res.send(user);
  } catch (err) {
    console.error("Error loading user!", err);
    res.send(500, "Internal server error");
  }
});

app.post("/user/", async (req, res) => {
  try {
    const users = await addUser(req.body.username);
    res.send(user[0]);
  } catch (err) {
    console.error("Error adding user!", err);
    res.send(500, "Internal server error");
  }
});

app.get("/rallies", async (req, res) => {
  try {
    const rallies = await getRallies();
    res.send(rallies);
  } catch (err) {
    console.error("Error loading rallies!", err);
    res.send(500, "Internal server error");
  }
});

app.get("/rallies/:userId", async (req, res) => {
  try {
    const ralliesOfUser = await getRalliesOfUser(req.params.userId);
    res.send(ralliesOfUser);
  } catch (err) {
    console.error("Error loading highways!", err);
    res.send(500, "Internal server error");
  }
});

app.get("/locations/:userId/:rallyId", async (req, res) => {
  try {
    const locations = await getLocations(req.params.userId, req.params.rallyId);
    res.send(locations);
  } catch (err) {
    console.error("Error loading user history!", err);
    res.send(500, "Internal server error");
  }
});

app.patch("/location/:userId/:locationId", async (req, res) => {
  try {
    await doneLocation(req.params.userId, req.params.locationId);
    res.send("The location is done correctly.");
  } catch (err) {
    console.error("Error updating user history!", err);
    res.send(500, "Internal server error");
  }
});

module.exports = app;
