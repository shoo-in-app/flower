exports.up = (knex) =>
  knex.schema.createTable("rallies", (table) => {
    table.increments("id");
    table.string("creator_id", 255);
    table
      .foreign("creator_id")
      .references("id")
      .inTable("creators");
    table.string("title", 255);
    table.text("description");
    table.integer("users_count").defaultTo(0);
    table.dateTime("start_datetime");
    table.dateTime("end_datetime");
  });

exports.down = (knex) => knex.schema.dropTable("rallies");
