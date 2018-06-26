const crypto = require("crypto");

module.exports = (db) => {
  const getUser = (hash) =>
    db("users")
      .where("hash", hash)
      .then((users) => (users.length > 0 ? users[0] : null));

  const getUserId = (hash) =>
    getUser(hash).then((user) => (user ? user.id : null));

  const deleteUser = async (hash) => {
    const userId = await getUserId(hash);
    await db("locations_to_users")
      .where("user_id", userId)
      .del();
    await db("rallies_to_users")
      .where("user_id", userId)
      .del();
    await db("users")
      .where("id", userId)
      .del();
  };

  const insertUser = (hash, email) =>
    db("users")
      .insert({ hash, email })
      .returning("*")
      .then((arr) => arr[0]);

  const incrementExp = (id, exp) =>
    db("users")
      .where("id", id)
      .increment("exp", exp)
      .returning("exp");

  const findOrCreateUser = async (email) => {
    const hash = crypto
      .createHmac("sha256", email)
      .update("super secret password")
      .digest("hex");
    let user = await getUser(hash);
    if (!user) user = await insertUser(hash, email);
    return user;
  };

  return {
    getUserId,
    deleteUser,
    findOrCreateUser,
    incrementExp,
  };
};
