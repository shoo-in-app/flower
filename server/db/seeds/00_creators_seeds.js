exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("creators")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("creators").insert([
        {
          id: 10001,
          username: "CodeChrysalis",
        },
        {
          id: 10002,
          username: "SomeCompany",
        },
      ]);
    });
};
