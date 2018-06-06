const db = require("../db");

const getUser = (userId) => db("users").where("id", userId);

const addUser = (username) => db("users").insert({ username });

const getRallies = () => db("rallies");

const getRalliesOfUser = (userId) =>
  db("rallies")
    .innerJoin("rallies_to_users", "rallies.id", "rallies_to_users.rally_id")
    .where("user_id", userId);

const getLocations = (userId, rallyId) =>
  db("locations")
    .where("rally_id", rallyId)
    .innerJoin(
      "locations_to_users",
      "locations.id",
      "locations_to_users.location_id"
    )
    .where("user_id", userId);

const doneLocation = (userId, locationId, visited) =>
  db("locations_to_users")
    .where("user_id", userId)
    .where("location_id", locationId)
    .update("visited", visited);

module.exports = {
  getUser,
  addUser,
  getRallies,
  getRalliesOfUser,
  getLocations,
  doneLocation,
};
