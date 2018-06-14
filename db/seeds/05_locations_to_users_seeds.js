exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("locations_to_users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("locations_to_users").insert([
        {
          user_id: 1000000,
          location_id: 1,
          visited: true,
        },
        {
          user_id: 1000000,
          location_id: 2,
          visited: true,
        },
        {
          user_id: 1000000,
          location_id: 3,
          visited: true,
        },
        {
          user_id: 2000000,
          location_id: 1,
          visited: false,
        },
        {
          user_id: 2000000,
          location_id: 2,
          visited: true,
        },
        {
          user_id: 2000000,
          location_id: 3,
          visited: false,
        },
        {
          user_id: 1000000,
          location_id: 9,
          visited: false,
        },
        {
          user_id: 1000000,
          location_id: 10,
          visited: true,
        },
        {
          user_id: 1000000,
          location_id: 11,
          visited: false,
        },
      ]);
    });
};
