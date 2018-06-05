const path = require("path");
module.exports = {
  client: "pg",
  connection:
    process.env.DATABASE_URL ||
    `postgres://${process.env.USER}@127.0.0.1:5432/flower`,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: path.join(__dirname, "migrations"),
    tableName: "knex_migrations"
  },
  seeds: {
    directory: path.join(__dirname, "seeds")
  },
  searchPath: "public"
};
