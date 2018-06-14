exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("rallies")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("rallies").insert([
        { id: 10001, title: "Tokyo FamilyMarts", description: "Go 3 famima!" },
        {
          id: 10002,
          title: "Wakayama around",
          description: "Wakayama famous spots",
        },
        { id: 10003, title: "Yamanote Line", description: "Go 3 stations" },
        {
          id: 10004,
          title: "Lunch Place near CC",
          description: "Go 3 restaurants",
        },
        {
          id: 10005,
          title: "Dinner Place near CC",
          description: "Go 3 restaurants we went for beer",
        },
        {
          id: 10006,
          title: "All around world",
          description: "Go 4 countries CC4 from",
        },
        {
          id: 10007,
          title: "Roppongi",
          description: "Good place to visit in Roppongi",
        },
      ]);
    });
};
