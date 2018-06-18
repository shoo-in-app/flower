module.exports = (db) => {
  const getUser = (hash) =>
    db("users")
      .where("hash", hash)
      .then((users) => (users.length > 0 ? users[0] : null));

  const deleteUser = (hash) =>
    db("users")
      .where("hash", hash)
      .del();

  const addUser = (hash, username, email) =>
    db("users")
      .insert({ hash, username, email })
      .returning("*")
      .then((arr) => arr[0]);

  const incrementExp = (idToken, exp) =>
    db("users")
      .where("id_token", idToken)
      .increment("exp", exp);

  return {
    getUser,
    deleteUser,
    addUser,
    incrementExp,
  };
};
