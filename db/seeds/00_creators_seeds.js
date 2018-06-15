exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("creators")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("creators").insert([
        {
          id: 10001,
          name: "CodeChrisalis",
        },
        {
          id: 10002,
          name: "SomeCompany",
        },
      ]);
    });
};
