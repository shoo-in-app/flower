// server/app.js
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();

// Setup logger
app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
  )
);

app.get("/user/:user_id", async (req, res) => {
  try {
    res.send(req.params.user_id);
  } catch (err) {
    console.error("Error loading user!", err);
    res.send(500, "Internal server error");
  }
});

app.post("/user/:user_id", async (req, res) => {
  try {
    res.send(req.params.user_id);
  } catch (err) {
    console.error("Error posting user!", err);
    res.send(500, "Internal server error");
  }
});

app.get("/rallies", async (req, res) => {
  try {
    res.send("");
  } catch (err) {
    console.error("Error loading rallies!", err);
    res.send(500, "Internal server error");
  }
});

app.get("/rallies/:user_id", async (req, res) => {
  try {
    res.send(req.params.user_id);
  } catch (err) {
    console.error("Error loading highways!", err);
    res.send(500, "Internal server error");
  }
});

app.get("/user_history/:user_id/:rally_id", async (req, res) => {
  try {
    res.send(req.params.user_id);
  } catch (err) {
    console.error("Error loading user history!", err);
    res.send(500, "Internal server error");
  }
});

app.patch("/user_history/:user_id/:rally_id", async (req, res) => {
  try {
    res.send(req.params.user_id);
  } catch (err) {
    console.error("Error updating user history!", err);
    res.send(500, "Internal server error");
  }
});

module.exports = app;
