
exports.up = async function(knex) {
  await knex.raw(`
    create view BudgetMonthlyTotals as
    select
    	b.id,
    	b.accountID,
    	b.name,
    	b.description,
    	SUBSTR(t.date, 0, 8) yearMonth,
    	sum(t.amount) total
    from Transactions t
    join Budgets b on t.budgetID = b.id
    group by SUBSTR(t.date, 0, 8), b.id
    order by SUBSTR(t.date, 0, 8) desc
  `);

  await knex.raw(`
    create view AccountMonthlyTotals as
    select
    	a.id,
    	a.name,
    	a.description,
    	SUBSTR(t.date, 0, 8) yearMonth,
    	sum(t.amount) total
    from Transactions t
    join Budgets b on t.budgetID = b.id
    join Accounts a on b.accountID = a.id
    group by SUBSTR(t.date, 0, 8), a.id
    order by SUBSTR(t.date, 0, 8) desc
  `);
};

exports.down = async function(knex) {
  await knex.raw(`drop view AccountMonthlyTotals`);
  await knex.raw(`drop view BudgetMonthlyTotals`);
};
