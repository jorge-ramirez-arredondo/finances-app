
exports.up = function(knex) {
  return knex.schema.createTable("Accounts", (t) => {
    t.increments("id").primary();
    t.text("name").notNull().unique();
    t.text("description");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("Accounts");
};
