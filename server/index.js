const app = require("./app");
const db = require("../db");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "../dist")));
(async () => {
  try {
    console.log("Running migrations...");
    await db.migrate.latest();

    console.log("Starting express...");
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  } catch (err) {
    console.error("Error starting app!", err);
    process.exit(-1);
  }
})();
