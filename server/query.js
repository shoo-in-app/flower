const db = require("../db");

const getUser = (userId) =>
  db("users")
    .select("id", "username")
    .where("id", userId);

const addUser = (idToken, username) =>
  db("users").insert({ id_token: idToken, username });

const getLocationsWithRallyInfo = () =>
  db("rallies")
    .select(
      "locations.rally_id",
      "rallies.title",
      "rallies.description",
      "locations.id",
      "locations.name",
      "locations.description as ldescription",
      "locations.lat",
      "locations.lng"
    )
    .innerJoin("locations", "rallies.id", "locations.rally_id");

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
  getLocationsWithRallyInfo,
  getRalliesOfUser,
  getLocations,
  doneLocation,
};
