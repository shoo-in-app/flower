exports.up = (knex) =>
  knex.schema.createTable("creators", (table) => {
    table.increments("id");
    table.string("email", 255);
    table.string("name", 255);
  });

exports.down = (knex) => knex.schema.dropTable("creators");
