const router = require("express").Router();

// Get Budget Monthly Totals
router.get('/', async (req, res) => {
  const { db } = req;
  const budgetMonthlyTotals = await db("BudgetMonthlyTotals").orderBy([
    { column: "accountID" },
    { column: "id" }
  ]);

  res.json(budgetMonthlyTotals);
});

module.exports = router;
