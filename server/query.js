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

const getRalliesOfUser = (userId) =>
  db("rallies")
    .innerJoin("rallies_to_users", "rallies.id", "rallies_to_users.rally_id")
    .where("rallies_to_users.user_id", userId);

const getLocationsWithRallyInfoUserChoose = (userId) =>
  db("rallies")
    .select(
      "locations.rally_id",
      "rallies.title",
      "rallies.description",
      "locations.id",
      "locations.name",
      "locations.description as ldescription",
      "locations.lat",
      "locations.lng",
      "rallies_to_users.complete",
      "locations_to_users.visited"
    )
    .innerJoin("locations", "rallies.id", "locations.rally_id")
    .innerJoin("rallies_to_users", "rallies.id", "rallies_to_users.rally_id")
    .innerJoin(
      "locations_to_users",
      "locations.id",
      "locations_to_users.location_id"
    )
    .where("rallies_to_users.user_id", userId)
    .where("locations_to_users.user_id", userId);

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
  getLocationsWithRallyInfoUserChoose,
};
