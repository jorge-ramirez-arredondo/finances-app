const router = require("express").Router();

// Get Budget Totals
router.get('/', async (req, res) => {
  const { db } = req;
  const budgets = await db("BudgetTotals")
    .join("Budgets", "BudgetTotals.id", "=", "Budgets.id")
    .select(
      "Budgets.id",
      "Budgets.accountID",
      "Budgets.name",
      "Budgets.description",
      "Budgets.active",
      "BudgetTotals.total"
    )
    .orderBy([
      { column: "Budgets.accountID" },
      { column: "Budgets.name" }
    ]);

  res.json(budgets);
});

module.exports = router;
