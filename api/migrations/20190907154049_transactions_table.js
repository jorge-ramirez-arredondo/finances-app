
exports.up = function(knex) {
  return knex.schema.createTable("Transactions", (t) => {
    t.increments("id").primary();
    t.integer("budgetID").notNull().references("Budgets.id").onDelete("cascade").onUpdate("no action");
    t.text("date").notNull();
    t.integer("amount").notNull();
    t.text("description");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("Transactions");
};
