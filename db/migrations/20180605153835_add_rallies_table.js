exports.up = (knex) =>
  knex.schema.createTable("rallies", (table) => {
    table.increments("id");
    table.string("title", 255);
    table.text("description");
    table.integer("user_count");
    table.dateTime("start_datetime");
    table.dateTime("end_datetime");
  });

exports.down = (knex) => knex.schema.dropTable("rallies");
