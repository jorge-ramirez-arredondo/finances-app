const router = require("express").Router();
const budgetMonthlyTotals = require("./budgetMonthlyTotals");
const transactionTotals = require("./transactionTotals");

router.use("/budgetMonthlyTotals", budgetMonthlyTotals);
router.use("/transactionTotals", transactionTotals);

module.exports = router;
