const crypto = require("crypto");

module.exports = (db) => {
  const getUser = (hash) =>
    db("users")
      .where("hash", hash)
      .then((users) => (users.length > 0 ? users[0] : null));

  const deleteUser = (hash) =>
    db("users")
      .where("hash", hash)
      .del();

  const insertUser = (hash, email) =>
    db("users")
      .insert({ hash, email })
      .returning("*")
      .then((arr) => arr[0]);

  const incrementExp = (idToken, exp) =>
    db("users")
      .where("id_token", idToken)
      .increment("exp", exp);

  const findOrCreateUser = async (email) => {
    const hash = crypto
      .createHmac("sha256", email)
      .update("super secret password")
      .digest("hex");
    let user = await getUser(hash);
    if (!user) user = await insertUser(hash, email);
    return user;
  };

  const getUserId = (hash) =>
    getUser(hash).then((user) => (user ? user.id : null));

  return {
    getUserId,
    deleteUser,
    findOrCreateUser,
    incrementExp,
  };
};
