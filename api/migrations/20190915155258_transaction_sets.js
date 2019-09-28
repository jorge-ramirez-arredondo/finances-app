
exports.up = async function(knex) {
  await knex.schema.createTable("TransactionSets", (t) => {
    t.increments("id").primary();
    t.text("name").notNull().unique();
    t.text("description");
  });

  await knex.schema.createTable("TransactionSetItems", (t) => {
    t.increments("id").primary();
    t.integer("transactionSetID").notNull().references("TransactionSets.id").onDelete("cascade").onUpdate("no action");
    t.integer("budgetID").notNull().references("Budgets.id").onDelete("cascade").onUpdate("no action");
    t.integer("amount").notNull();
    t.text("description");
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("TransactionSetItems");
  await knex.schema.dropTable("TransactionSets");
};
