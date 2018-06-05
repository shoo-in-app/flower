exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("locations")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("locations").insert([
        {
          id: 1,
          name: "Motoazabu Sanchoume",
          lat: 35.6590276,
          lng: 139.7216911,
          description: "nearest famima to cc",
          rally_id: 1,
        },
        {
          id: 2,
          name: "Motoazabu",
          lat: 35.6549021,
          lng: 139.7256983,
          description: "second nearest famima to cc",
          rally_id: 1,
        },
        {
          id: 3,
          name: "Nishiazabu Sanchoume",
          lat: 35.6594023,
          lng: 139.7232843,
          description: "third nearest famima to cc",
          rally_id: 1,
        },
      ]);
    });
};
