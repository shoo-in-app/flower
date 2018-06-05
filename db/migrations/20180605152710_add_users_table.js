exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username", 255);
    table.string("social_id", 255);
  });

exports.down = (knex) => knex.schema.dropTable("users");
