exports.up = (knex) =>
  knex.schema.createTable("rallies_to_users", (table) => {
    table.increments("id");
    table.integer("rally_id");
    table
      .foreign("rally_id")
      .references("id")
      .inTable("rallies");
    table.integer("user_id");
    table
      .foreign("user_id")
      .references("id")
      .inTable("users");
    table.boolean("complete");
  });

exports.down = (knex) => knex.schema.dropTable("rallies_to_users");
