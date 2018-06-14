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

const getLocationsOfRallyOfUser = (userId, rallyId) =>
  db("locations")
    .where("rally_id", rallyId)
    .innerJoin(
      "locations_to_users",
      "locations.id",
      "locations_to_users.location_id"
    )
    .where("user_id", userId);

const getLocationsOfRally = (rallyId) =>
  db("locations").where("rally_id", rallyId);

const doneLocation = (userId, locationId, visited) =>
  db("locations_to_users")
    .where("user_id", userId)
    .where("location_id", locationId)
    .update("visited", visited);

const insertRalliesToUsers = (userId, rallyId) =>
  db("rallies_to_users").insert({
    user_id: userId,
    rally_id: rallyId,
  });

const insertLocationsToUsers = (data) => db("locations_to_users").insert(data);

const deleteRalliesToUsers = (userId, rallyId) =>
  db("rallies_to_users")
    .where("user_id", userId)
    .where("rally_id", rallyId)
    .del();

const deleteLocationsToUsers = (userId, locations) =>
  db("locations_to_users")
    .where("user_id", userId)
    .whereIn("location_id", locations)
    .del();

const addRally = (title, description) =>
  db("rallies").insert({ title, description });

const addLocations = (locations) => db("locations").insert(...locations);

module.exports = {
  getUser,
  addUser,
  getLocationsWithRallyInfo,
  getRalliesOfUser,
  getLocationsOfRallyOfUser,
  doneLocation,
  getLocationsWithRallyInfoUserChoose,
  getLocationsOfRally,
  deleteRalliesToUsers,
  deleteLocationsToUsers,
  insertRalliesToUsers,
  insertLocationsToUsers,
  addRally,
  addLocations,
};
