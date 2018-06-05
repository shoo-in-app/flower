exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("rallies")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("rallies").insert([
        { id: 1, title: "Tokyo FamilyMarts", description: "Go 3 famima!" },
        {
          id: 2,
          title: "Wakayama around",
          description: "Wakayama famous spots",
        },
        { id: 3, title: "Yamanote Line", description: "Go 3 stations" },
      ]);
    });
};
