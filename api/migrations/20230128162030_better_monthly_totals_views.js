
exports.up = async function(knex) {
  await knex.raw(`drop view BudgetMonthlyTotals`);
  await knex.raw(`
    create view BudgetMonthlyTotals as
    with YearMonthLimits as (
      select
        SUBSTR(MIN(date), 0, 8) minYearMonth,
        SUBSTR(MAX(date), 0, 8) maxYearMonth 
      from Transactions t
    ),
    Years as (
      select
        CAST(SUBSTR(minYearMonth, 0, 5) as integer) year
      from YearMonthLimits
      union
      select year + 1
      from Years
      where year < CAST((select SUBSTR(maxYearMonth, 0, 5) from YearMonthLimits) as integer)
    ),
    Months(month) as (
      values ('01'), ('02'), ('03'), ('04'), ('05'), ('06'), ('07'), ('08'), ('09'), ('10'), ('11'), ('12')
    ),
    YearMonths as (
      select CAST(y.year as text) || '-' || m.month as yearMonth
      from Years y
      cross join Months m
      where yearMonth between (select minYearMonth from YearMonthLimits) and (select maxYearMonth from YearMonthLimits)
    ),
    BudgetYearMonths as (
      select b.*, ym.yearMonth
      from YearMonths ym
      cross join Budgets b
    )
    select
      bym.id,
      bym.accountId,
      bym.name,
      bym.description,
      bym.yearMonth,
      sum(coalesce(t.amount, 0)) change,
      sum(sum(coalesce(t.amount, 0))) over (
        partition by bym.id
        order by bym.yearMonth ASC, t.date ASC
      ) total
    from BudgetYearMonths bym
    left join Transactions t
      on t.budgetID = bym.id
        and SUBSTR(t.date, 0, 8) = bym.yearMonth
    group by bym.yearMonth, bym.id
    order by bym.yearMonth asc, bym.accountID asc, bym.id asc
  `);

  await knex.raw(`drop view AccountMonthlyTotals`);
  await knex.raw(`
    create view AccountMonthlyTotals as
    with YearMonthLimits as (
      select
        SUBSTR(MIN(date), 0, 8) minYearMonth,
        SUBSTR(MAX(date), 0, 8) maxYearMonth 
      from Transactions t
    ),
    Years as (
      select
        CAST(SUBSTR(minYearMonth, 0, 5) as integer) year
      from YearMonthLimits
      union
      select year + 1
      from Years
      where year < CAST((select SUBSTR(maxYearMonth, 0, 5) from YearMonthLimits) as integer)
    ),
    Months(month) as (
      values ('01'), ('02'), ('03'), ('04'), ('05'), ('06'), ('07'), ('08'), ('09'), ('10'), ('11'), ('12')
    ),
    YearMonths as (
      select CAST(y.year as text) || '-' || m.month as yearMonth
      from Years y
      cross join Months m
      where yearMonth between (select minYearMonth from YearMonthLimits) and (select maxYearMonth from YearMonthLimits)
    ),
    AccountYearMonths as (
      select a.*, ym.yearMonth
      from YearMonths ym
      cross join Accounts a
    )
    select
      aym.id,
      aym.name,
      aym.description,
      aym.yearMonth,
      sum(coalesce(t.amount, 0)) change,
      sum(sum(coalesce(t.amount, 0))) over (
        partition by aym.id
        order by aym.yearMonth ASC, t.date ASC
      ) total
    from AccountYearMonths aym
    join Budgets b on b.accountID = aym.id
    left join Transactions t
      on t.budgetID = b.id
        and SUBSTR(t.date, 0, 8) = aym.yearMonth
    group by aym.yearMonth, aym.id
    order by aym.yearMonth asc, aym.id asc
  `);
};

exports.down = async function(knex) {
  await knex.raw(`drop view BudgetMonthlyTotals`);
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

  await knex.raw(`drop view AccountMonthlyTotals`);
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
