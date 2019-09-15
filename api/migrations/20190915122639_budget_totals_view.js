
exports.up = function(knex) {
  return knex.raw(`
    create view BudgetTotals as
    select
      b.id,
      b.accountID,
      b.name,
      b.description,
      sum(coalesce(t.amount, 0)) total
    from Budgets b
    left outer join Transactions t on b.id = t.budgetID
    group by b.id
  `);
};

exports.down = function(knex) {
  return knex.raw(`drop view BudgetTotals`);
};
