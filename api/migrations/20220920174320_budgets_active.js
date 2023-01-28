
exports.up = function(knex) {
  return knex.schema.alterTable("Budgets", (t) => {
    t.integer("active").notNull().defaultTo(1);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable("Budgets", (t) => {
    t.dropColumn("active");
  });
};
