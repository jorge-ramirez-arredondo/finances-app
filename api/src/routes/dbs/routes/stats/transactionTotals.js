const router = require("express").Router();

// Get Transaction Totals
router.get('/', async (req, res) => {
  const { db } = req;
  const transactionTotals = await db("TransactionTotals");

  res.json(transactionTotals);
});

module.exports = router;
