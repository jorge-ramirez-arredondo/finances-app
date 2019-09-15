const router = require("express").Router();

// Get Budget Totals
router.get('/', async (req, res) => {
  const { db } = req;
  const budgets = await db("BudgetTotals");

  res.json(budgets);
});

module.exports = router;
