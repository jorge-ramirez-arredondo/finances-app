
exports.up = function(knex) {
  return knex.schema.table("Budgets", (t) => {
    t.dropUnique("name");
    t.unique(["name", "accountID"]);
  });
};

exports.down = function(knex) {
  return knex.schema.table("Budgets", (t) => {
    t.dropUnique(["name", "accountID"]);
    t.unique("name");
  });
};
