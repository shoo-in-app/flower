module.exports = (db) => {
  const getLocationsWithRallyInfo = () =>
    db("rallies")
      .select(
        "locations.rally_id",
        "rallies.title",
        "rallies.description",
        "rallies.start_datetime",
        "rallies.end_datetime",
        "rallies.users_count",
        "locations.id",
        "locations.name",
        "locations.description as ldescription",
        "locations.lat",
        "locations.lng",
        "creators.username"
      )
      .innerJoin("locations", "rallies.id", "locations.rally_id")
      .innerJoin("creators", "rallies.creator_id", "creators.id");

  const getLocationsWithRallyInfoUserChoose = (userId) =>
    db("rallies")
      .select(
        "locations.rally_id",
        "rallies.title",
        "rallies.description",
        "rallies.start_datetime",
        "rallies.end_datetime",
        "rallies.users_count",
        "creators.username",
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
      .innerJoin("creators", "rallies.creator_id", "creators.id")
      .where("rallies_to_users.user_id", userId)
      .where("locations_to_users.user_id", userId);

  const getLocationsOfRally = (rallyId) =>
    db("locations").where("rally_id", rallyId);

  const getRalliesOfUser = (userId) =>
    db("rallies")
      .innerJoin("rallies_to_users", "rallies.id", "rallies_to_users.rally_id")
      .where("rallies_to_users.user_id", userId);

  const toggleLocation = (userId, locationId, visited) =>
    db("locations_to_users")
      .where("user_id", userId)
      .where("location_id", locationId)
      .update("visited", visited);

  const getRalliesToUsers = (userId, rallyId) =>
    db("rallies_to_users").where({
      user_id: userId,
      rally_id: rallyId,
    });

  const insertRalliesToUsers = (userId, rallyId) =>
    db("rallies_to_users")
      .insert({
        user_id: userId,
        rally_id: rallyId,
      })
      .then(() => {
        db("rallies")
          .where("id", rallyId)
          .increment("users_count", 1);
      });

  const insertLocationsToUsers = (data) =>
    db("locations_to_users").insert(data);

  const deleteRalliesToUsers = (userId, rallyId) =>
    db("rallies_to_users")
      .where("user_id", userId)
      .where("rally_id", rallyId)
      .del()
      .then(() => {
        db("rallies")
          .where("id", rallyId)
          .decrement("users_count", 1);
      });

  const deleteLocationsToUsers = (userId, locations) =>
    db("locations_to_users")
      .where("user_id", userId)
      .whereIn("location_id", locations)
      .del();

  const insertRally = (data) =>
    db("rallies")
      .insert(data)
      .returning("id")
      .then((ids) => ids[0]);

  const insertLocations = (locations) => db("locations").insert(locations);

  const getLocationsWithRallyInfoCreatorCreated = (creatorId) =>
    db("rallies")
      .select(
        "locations.rally_id",
        "rallies.title",
        "rallies.description",
        "rallies.start_datetime",
        "rallies.end_datetime",
        "rallies.users_count",
        "creators.username",
        "locations.id",
        "locations.name",
        "locations.description as ldescription",
        "locations.lat",
        "locations.lng"
      )
      .innerJoin("locations", "rallies.id", "locations.rally_id")
      .innerJoin("creators", "rallies.creator_id", "creators.id")
      .where("creators.google_id", creatorId);

  const getAllRallies = async () => {
    const locations = await getLocationsWithRallyInfo();
    const rallies = {};
    locations.forEach((location) => {
      if (!rallies.hasOwnProperty(location.rally_id)) {
        rallies[location.rally_id] = {
          id: location.rally_id,
          title: location.title,
          description: location.description,
          locations: [],
        };
      }
      rallies[location.rally_id].locations.push({
        id: location.id,
        name: location.name,
        description: location.ldescription,
        lat: location.lat,
        lng: location.lng,
      });
    });
  };

  const getChoosenRallies = async (userId) => {
    const chosenRallies = {};
    const chosenLocations = await getLocationsWithRallyInfoUserChoose(userId);
    chosenLocations.forEach((location) => {
      if (!chosenRallies.hasOwnProperty(location.rally_id)) {
        chosenRallies[location.rally_id] = {
          id: location.rally_id,
          creator_name: location.username,
          title: location.title,
          description: location.description,
          complete: chosenLocations.every((location) => location.visited),
          start_datetime: location.start_datetime,
          end_datetime: location.end_datetime,
          user_count: location.user_count,
          locations: [],
        };
      }
      chosenRallies[location.rally_id].locations.push({
        id: location.id,
        name: location.name,
        description: location.ldescription,
        lat: location.lat,
        lng: location.lng,
        visited: location.visited,
      });
    });
    return Object.values(chosenRallies);
  };

  const getNotChosenRallies = async (userId) => {
    const ralliesIdsUserchosen = (await getRalliesOfUser(userId)).map(
      (rally) => rally.rally_id
    );
    const locations = await getLocationsWithRallyInfo();
    const notChosenRallies = {};
    locations
      .filter((rally) => !ralliesIdsUserchosen.includes(rally.rally_id))
      .forEach((location) => {
        if (!notChosenRallies.hasOwnProperty(location.rally_id)) {
          notChosenRallies[location.rally_id] = {
            id: location.rally_id,
            creator_name: location.username,
            title: location.title,
            description: location.description,
            start_datetime: location.start_datetime,
            end_datetime: location.end_datetime,
            user_count: location.user_count,
            locations: [],
          };
        }
        notChosenRallies[location.rally_id].locations.push({
          id: location.id,
          name: location.name,
          description: location.ldescription,
          lat: location.lat,
          lng: location.lng,
        });
      });
    return Object.values(notChosenRallies);
  };

  const toggleRally = async (userId, rallyId, chosen) => {
    const locationIds = (await getLocationsOfRally(rallyId)).map(
      (location) => location.id
    );
    const result = await getRalliesToUsers(userId, rallyId);
    const wasChosen = result.length !== 0;
    if (!wasChosen && chosen === true) {
      await insertRalliesToUsers(userId, rallyId);
      const data = locationIds.map((id) => ({
        user_id: userId,
        location_id: id,
        visited: false,
      }));
      await insertLocationsToUsers(data);
    } else if (wasChosen && chosen === false) {
      await deleteRalliesToUsers(userId, rallyId);
      await deleteLocationsToUsers(userId, locationIds);
    }
  };

  const createRally = async (
    creatorId,
    title,
    description,
    start_datetime,
    end_datetime,
    locations
  ) => {
    const rallyId = await insertRally({
      creator_id: creatorId,
      title,
      description,
      start_datetime,
      end_datetime,
    });
    locations = locations.map((l) => ({
      rally_id: rallyId,
      ...l,
    }));
    await insertLocations(locations);
  };

  const getCreatedRallies = async (creatorId) => {
    const createdRallies = {};
    const createdLocations = await getLocationsWithRallyInfoCreatorCreated(
      creatorId
    );
    createdLocations.forEach((location) => {
      if (!createdRallies.hasOwnProperty(location.rally_id)) {
        createdRallies[location.rally_id] = {
          id: location.rally_id,
          creator_name: location.username,
          title: location.title,
          description: location.description,
          complete: createdLocations.every((location) => location.visited),
          start_datetime: location.start_datetime,
          end_datetime: location.end_datetime,
          user_count: location.user_count,
          locations: [],
        };
      }
      createdRallies[location.rally_id].locations.push({
        id: location.id,
        name: location.name,
        description: location.ldescription,
        lat: location.lat,
        lng: location.lng,
      });
    });
    return Object.values(createdRallies);
  };

  return {
    getAllRallies,
    getChoosenRallies,
    getNotChosenRallies,
    toggleRally,
    toggleLocation,
    createRally,
    getCreatedRallies,
  };
};
