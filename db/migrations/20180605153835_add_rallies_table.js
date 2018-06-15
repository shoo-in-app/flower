exports.up = (knex) =>
  knex.schema.createTable("rallies", (table) => {
    table.increments("id");
    table.integer("creator_id");
    table
      .foreign("creator_id")
      .references("id")
      .inTable("creators");
    table.string("title", 255);
    table.text("description");
    table.integer("user_count").defaultTo(0);
    table.dateTime("start_datetime");
    table.dateTime("end_datetime");
  });

exports.down = (knex) => knex.schema.dropTable("rallies");
