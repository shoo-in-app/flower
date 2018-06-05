exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("rallies_to_users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("rallies_to_users").insert([
        { rally_id: 1, user_id: 1, complete: false },
        { rally_id: 1, user_id: 2, complete: false },
        { rally_id: 2, user_id: 2, complete: true },
      ]);
    });
};
