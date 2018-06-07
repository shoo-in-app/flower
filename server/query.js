const db = require("../db");

const getUser = (idToken) => db("users").where("id_token", idToken);

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

const getRalliesOfUser = (id_token) =>
  db("rallies")
    .innerJoin("rallies_to_users", "rallies.id", "rallies_to_users.rally_id")
    .where("id_token", idToken);

const getLocations = (idToken, rallyId) =>
  db("locations")
    .where("rally_id", rallyId)
    .innerJoin(
      "locations_to_users",
      "locations.id",
      "locations_to_users.location_id"
    )
    .where("id_token", idToken);

const doneLocation = (idToken, locationId, visited) =>
  db("locations_to_users")
    .where("id_token", idToken)
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
