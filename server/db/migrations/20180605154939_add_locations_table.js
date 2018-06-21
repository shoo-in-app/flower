exports.up = (knex) =>
  knex.schema.createTable("locations", (table) => {
    table.increments("id");
    table.string("name", 255);
    table.float("lat");
    table.float("lng");
    table.text("description");
    table.integer("rally_id");
    table
      .foreign("rally_id")
      .references("id")
      .inTable("rallies");
  });

exports.down = (knex) => knex.schema.dropTable("locations");
