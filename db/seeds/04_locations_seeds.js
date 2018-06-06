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
        {
          id: 4,
          name: "Wakayama Castle",
          lat: 34.2294761,
          lng: 135.1716661,
          description: "The place Abarenbou shogun grew up",
          rally_id: 2,
        },
        {
          id: 5,
          name: "Shimotsu cho",
          lat: 34.10883,
          lng: 135.1434213,
          description: "Yusuke's Home town",
          rally_id: 2,
        },
        {
          id: 6,
          name: "Adventure World",
          lat: 33.6678415,
          lng: 135.3738168,
          description: "A Great Zoo",
          rally_id: 2,
        },
        {
          id: 7,
          name: "Susami cho",
          lat: 33.5669612,
          lng: 135.4938991,
          description: "The place Felix visited",
          rally_id: 2,
        },
        {
          id: 8,
          name: "Shionomisaki",
          lat: 33.4369984,
          lng: 135.7470104,
          description: "South End of Honshu",
          rally_id: 2,
        },
        {
          id: 9,
          name: "Shinjuku Station",
          lat: 35.6895924,
          lng: 139.6982244,
          description: "Shin Toshin",
          rally_id: 3,
        },
        {
          id: 10,
          name: "Shibuya Station",
          lat: 35.6580339,
          lng: 139.6994471,
          description: "Town for young",
          rally_id: 3,
        },
        {
          id: 11,
          name: "Tokyo Station",
          lat: 35.6811673,
          lng: 139.7648629,
          description: "Toshin",
          rally_id: 3,
        },
      ]);
    });
};
