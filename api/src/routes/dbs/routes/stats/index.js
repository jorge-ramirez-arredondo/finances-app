const router = require("express").Router();
const budgetMonthlyTotals = require("./budgetMonthlyTotals");

router.use("/budgetMonthlyTotals", budgetMonthlyTotals);

module.exports = router;
