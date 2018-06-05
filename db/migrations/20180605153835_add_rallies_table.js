exports.up = (knex) =>
  knex.schema.createTable("rallies", (table) => {
    table.increments("id");
    table.string("title", 255);
    table.text("description");
  });

exports.down = (knex) => knex.schema.dropTable("rallies");
