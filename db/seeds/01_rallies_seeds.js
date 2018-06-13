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
        {
          id: 4,
          title: "Lunch Place near CC",
          description: "Go 3 restaurants",
        },
        {
          id: 5,
          title: "Dinner Place near CC",
          description: "Go 3 restaurants we went for beer",
        },
        {
          id: 6,
          title: "All around world",
          description: "Go 4 countries CC4 from",
        },
        {
          id: 7,
          title: "Roppongi",
          description: "Good place to visit in Roppongi",
        },
      ]);
    });
};
