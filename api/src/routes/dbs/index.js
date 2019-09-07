const express = require("express");
const Joi = require("@hapi/joi");
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

// Create DBs
const postDBsBodySchema = Joi.object().keys({
  dbNames: Joi.array().items(Joi.string().required())
});

router.post("/", async (req, res) => {
  const { error } = postDBsBodySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const { dbNames } = req.body;

  dbNames.forEach(async (dbName) => {
    await multiDBLoader.createDB(dbName);
  });

  return res.status(200).end();
});

// Set up dbName nested routes
const multiDBLoader = new MultiDBLoader();

dbNameRouter.use(async (req, res, next) => {
  req.db = await multiDBLoader.getDB(req.dbName);

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
