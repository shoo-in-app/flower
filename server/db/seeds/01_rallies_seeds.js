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
          title: "Roppongi FamilyMarts",
          description: "Visit 3 Famima!",
          start_datetime: new Date("2018-06-01").toISOString(),
          end_datetime: new Date("2019-06-01").toISOString(),
          reward_points: 50,
        },
        {
          id: 10002,
          creator_id: 10001,
          title: "Around Wakayama",
          description: "Wakayama's most scenic spots.",
          start_datetime: new Date("2018-08-01").toISOString(),
          end_datetime: new Date("2018-09-01").toISOString(),
          reward_points: 50,
        },
        {
          id: 10003,
          creator_id: 10001,
          title: "JR Yamanote Line",
          description: "Visit some stations.",
          start_datetime: new Date("2018-04-01").toISOString(),
          end_datetime: new Date("2018-05-01").toISOString(),
          reward_points: 50,
        },
        {
          id: 10004,
          creator_id: 10001,
          title: "Lunch Places near CC",
          description: "Go try some restaurants!",
          start_datetime: new Date("2018-06-01T09:00:00.000Z").toISOString(),
          end_datetime: new Date("2019-06-01T09:00:00.000Z").toISOString(),
          reward_points: 50,
        },
        {
          id: 10005,
          creator_id: 10001,
          title: "Dinner Places near CC",
          description: "Go try some restaurants for beer!",
          start_datetime: new Date("2018-06-01").toISOString(),
          end_datetime: new Date("2019-06-01").toISOString(),
          reward_points: 50,
        },
        {
          id: 10006,
          creator_id: 10001,
          title: "All around the world",
          description: "Visit the 4 countries of CC4's students.",
          start_datetime: new Date("2018-06-01").toISOString(),
          end_datetime: new Date("2019-06-01").toISOString(),
          reward_points: 50,
        },
        {
          id: 10007,
          creator_id: 10002,
          title: "Roppongi",
          description: "Good places to visit in Roppongi.",
          start_datetime: new Date("2018-06-01").toISOString(),
          end_datetime: new Date("2019-06-01").toISOString(),
          reward_points: 50,
        },
      ]);
    });
};
