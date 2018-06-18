module.exports = (db) => {
  const findOrCreateCreator = async (data) => {
    let user = await db("creators")
      .where("google_id", data.googleId)
      .then((users) => (users.length > 0 ? users[0] : null));
    if (!user) {
      user = await db("creators")
        .insert({ google_id: data.googleId })
        .returning("*")
        .then((arr) => arr[0]);
    }
    return user;
  };

  return {
    findOrCreateCreator,
  };
};
