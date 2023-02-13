
exports.up = function(knex) {
  return knex.raw(`
    create view TransactionTotals as
    select
      t.id,
      t.budgetID,
      b.accountID,
      t.date,
      t.amount,
      t.description,
      sum(t.amount) over (
        partition by b.accountID
        order by t.date asc, t.id
      ) accountTotal,
      sum(t.amount) over (
        partition by b.id
        order by t.date asc, t.id
      ) budgetTotal,
      sum(t.amount) over (order by t.date asc, t.id) total
    from Transactions t
    join Budgets b on b.id = t.budgetID
    order by t.date asc, t.id asc
  `);
};

exports.down = function(knex) {
  return knex.raw(`drop view TransactionTotals`);
};
