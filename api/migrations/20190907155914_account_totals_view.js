
exports.up = function(knex) {
  return knex.raw(`
    create view AccountTotals as
    select
      a.id,
      a.name,
      a.description,
      sum(coalesce(t.amount, 0)) total
    from Accounts a
    left outer join Budgets b on a.id = b.accountID
    left outer join Transactions t on b.id = t.budgetID
    group by a.id
  `);
};

exports.down = function(knex) {
  return knex.raw(`drop view AccountTotals`);
};
