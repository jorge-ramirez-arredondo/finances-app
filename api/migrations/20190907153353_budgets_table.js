
exports.up = function(knex) {
  return knex.schema.createTable("Budgets", (t) => {
    t.increments("id").primary();
    t.integer("accountID").notNull().references("Accounts.id").onDelete("cascade").onUpdate("no action");
    t.text("name").notNull().unique();
    t.text("description");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("Budgets");
};
