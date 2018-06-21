const db = require("../db");
const users = require("./users");
const creators = require("./creators");
const rallies = require("./rallies");

module.exports = {
  Users: users(db),
  Creators: creators(db),
  Rallies: rallies(db),
};
