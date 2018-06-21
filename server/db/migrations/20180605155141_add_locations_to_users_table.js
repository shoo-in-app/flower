exports.up = (knex) =>
  knex.schema.createTable("locations_to_users", (table) => {
    table.increments("id");
    table.integer("user_id");
    table
      .foreign("user_id")
      .references("id")
      .inTable("users");
    table.integer("location_id");
    table
      .foreign("location_id")
      .references("id")
      .inTable("locations");
    table.boolean("visited");
  });

exports.down = (knex) => knex.schema.dropTable("locations_to_users");
