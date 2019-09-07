const express = require("express");
const router = express.Router();
const dbNameRouter = express.Router();

const accounts = require("./routes/accounts");
const budgets = require("./routes/budgets");
const accountTotals = require("./routes/accountTotals");
const transactions = require("./routes/transactions");
const MultiDBLoader = require("./MultiDBLoader");

// Get DB names
router.get("/", async (req, res) => {
  res.json(multiDBLoader.dbList);
});

// Set up dbName nested routes
const multiDBLoader = new MultiDBLoader();

dbNameRouter.use((req, res, next) => {
  req.db = multiDBLoader.getDB(req.dbName);

  next();
});

dbNameRouter.use("/accounts", accounts);
dbNameRouter.use("/budgets", budgets);
dbNameRouter.use("/accountTotals", accountTotals);
dbNameRouter.use("/transactions", transactions);

router.use("/:dbName", (req, res, next) => {
  req.dbName = req.params.dbName;
  next();
}, dbNameRouter);


module.exports = router;
