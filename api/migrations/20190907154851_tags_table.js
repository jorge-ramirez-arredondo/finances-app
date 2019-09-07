
exports.up = async function(knex) {
  await knex.schema.createTable("Tags", (t) => {
    t.increments("id").primary();
    t.text("name").notNull().unique();
    t.text("description");
  });

  await knex.schema.createTable("TransactionTags", (t) => {
    t.integer("transactionID").notNull().references("Transactions.id").onDelete("cascade").onUpdate("no action");
    t.integer("tagID").notNull().references("Tags.id").onDelete("cascade").onUpdate("no action");
    t.primary(["transactionID", "tagID"]);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("TransactionTags");
  await knex.schema.dropTable("Tags");
};
