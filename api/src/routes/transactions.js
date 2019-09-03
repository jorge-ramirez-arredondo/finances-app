const _ = require("lodash");
const Joi = require("@hapi/joi");
const router = require("express").Router();

const { db } = require("../db");

// Get Transactions
const columns = ["id","budgetID","date","amount","description"];
const dirs = ["asc", "desc"];

const getTransactionsQuerySchema = Joi.object().keys({
  orderBy: Joi.string().valid(...columns).insensitive(),
  orderDir: Joi.string().valid(...dirs).insensitive(),
  limit: Joi.number().integer().positive(),
  offset: Joi.number().integer().min(0)
});

router.get("/", async (req, res) => {
  const { error } = getTransactionsQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).send(error);
  }

  const {
    orderBy = columns[0],
    orderDir = dirs[0],
    limit,
    offset
  } = req.query;

  const dbQuery = db("Transactions");

  const _orderBy = _.find(columns, (column) => column.toLowerCase() === orderBy);
  if (_orderBy) {
    const queryOrdering = [{ column: _orderBy, order: dirs.includes(orderDir) ? orderDir : undefined}];

    // Use id descending as a secondary ordering when possible
    if (_orderBy !== "id") {
      queryOrdering.push({ column: "id", order: "desc" });
    }

    dbQuery.orderBy(queryOrdering);
  }

  if (limit) {
    dbQuery.limit(limit);
  }

  if (offset) {
    dbQuery.offset(offset);
  }

  const transactions = await dbQuery;

  res.json(transactions);
});

// Create Transactions
const postTransactionsBodySchema = Joi.object().keys({
  transactions: Joi.array().items(Joi.object().keys({
    budgetID: Joi.number().integer().required(),
    date: Joi.date().iso().required(),
    amount: Joi.number().integer().required(),
    description: Joi.string().allow("")
  }))
});

router.post("/", async (req, res) => {
  const { error } = postTransactionsBodySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const { transactions } = req.body;

  await db("Transactions").insert(transactions);

  return res.status(200).end();
});

module.exports = router;
