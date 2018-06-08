exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1000000,
          id_token:
            "LBVgfZewKaFZaKqX8vUDXtLGFEE2XDb4w78nXNH4mKANgTCKk6ar9mQne6JwDYp6HCej5xEsW82XZyWbDytRsb9vBh6sw6Z3GaHA2uMVbrPLQud3hqKV6ppbhRZdSpGH",
          username: "Alex",
        },
        {
          id: 2000000,
          id_token:
            "3qYFuJsxZSUupuCLQmxwjUDV5TSbhzB7kwNr2mpB2YNuMW3CPSGe8CK3hPcZDErDVu5eM83EcT6DmugqmpRFD5tQCped6geXgXYUfZwfQKmUcZ8qtPnQ7ssppVvQaHKX",
          username: "Taka",
        },
        {
          id: 3000000,
          id_token:
            "R3uHB52jTCExdwNCa2vgDJxY2QWGLdjcze8b722dfuRNE9yYJtLbuEPWGeFWcDzeaVmWvJ55YVtsTJxFk4N9e6mYkSAKgMj5se23LdVrgmTwnjp8MGUR32T2BYYgQ2G3",
          username: "Yusuke",
        },
      ]);
    });
};
