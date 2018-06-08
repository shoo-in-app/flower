exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("id_token", 2047);
    table.string("username", 255);
    table.string("access_token", 255);
    table.string("refresh_token", 255);
    table.string("server_auth_code", 255);
    table.string("email", 255);
    table.string("google_id", 255);
    table.string("name", 255);
    table.string("photo_url", 255);
  });

exports.down = (knex) => knex.schema.dropTable("users");
