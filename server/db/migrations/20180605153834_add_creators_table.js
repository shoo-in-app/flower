exports.up = (knex) =>
  knex.schema.createTable("creators", (table) => {
    table.increments("id");
    table.string("email", 255);
    table.string("google_id", 255);
    table.string("username", 255);
  });

exports.down = (knex) => knex.schema.dropTable("creators");
