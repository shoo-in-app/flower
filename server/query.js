const db = require("../db");

const getUser = (username) =>
  db("users")
    .select("id", "username", "id_token")
    .where("username", username);

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

const getRalliesOfUser = (username) =>
  db("rallies")
    .innerJoin("rallies_to_users", "rallies.id", "rallies_to_users.rally_id")
    .where("username", username);

const getLocations = (username, rallyId) =>
  db("locations")
    .where("rally_id", rallyId)
    .innerJoin(
      "locations_to_users",
      "locations.id",
      "locations_to_users.location_id"
    )
    .where("username", username);

const doneLocation = (username, locationId, visited) =>
  db("locations_to_users")
    .where("username", username)
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
