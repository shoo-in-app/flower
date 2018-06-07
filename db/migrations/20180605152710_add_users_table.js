exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("id_token", 255);
    table.string("username", 255);
  });

exports.down = (knex) => knex.schema.dropTable("users");
