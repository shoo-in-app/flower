exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 10001,
          email: "alex@sample.com",
          username: "Alex",
        },
        {
          id: 10002,
          email: "taka@sample.com",
          username: "Taka",
        },
        {
          id: 10003,
          email: "yusuke@sample.com",
          username: "Yusuke",
        },
      ]);
    });
};
