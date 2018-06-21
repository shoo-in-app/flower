exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("rallies")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("rallies").insert([
        {
          id: 10001,
          creator_id: 10001,
          title: "Tokyo FamilyMarts",
          description: "Go 3 famima!",
          start_datetime: new Date("2018-06-01").toISOString(),
          end_datetime: new Date("2019-06-01").toISOString(),
        },
        {
          id: 10002,
          creator_id: 10001,
          title: "Wakayama around",
          description: "Wakayama famous spots",
          start_datetime: new Date("2018-08-01").toISOString(),
          end_datetime: new Date("2018-09-01").toISOString(),
        },
        {
          id: 10003,
          creator_id: 10001,
          title: "Yamanote Line",
          description: "Go 3 stations",
          start_datetime: new Date("2018-04-01").toISOString(),
          end_datetime: new Date("2018-05-01").toISOString(),
        },
        {
          id: 10004,
          creator_id: 10001,
          title: "Lunch Place near CC",
          description: "Go 3 restaurants",
          start_datetime: new Date("2018-06-01T09:00:00.000Z").toISOString(),
          end_datetime: new Date("2019-06-01T09:00:00.000Z").toISOString(),
        },
        {
          id: 10005,
          creator_id: 10001,
          title: "Dinner Place near CC",
          description: "Go 3 restaurants we went for beer",
          start_datetime: new Date("2018-06-01").toISOString(),
          end_datetime: new Date("2019-06-01").toISOString(),
        },
        {
          id: 10006,
          creator_id: 10001,
          title: "All around world",
          description: "Go 4 countries CC4 from",
          start_datetime: new Date("2018-06-01").toISOString(),
          end_datetime: new Date("2019-06-01").toISOString(),
        },
        {
          id: 10007,
          creator_id: 10002,
          title: "Roppongi",
          description: "Good place to visit in Roppongi",
          start_datetime: new Date("2018-06-01").toISOString(),
          end_datetime: new Date("2019-06-01").toISOString(),
        },
      ]);
    });
};
