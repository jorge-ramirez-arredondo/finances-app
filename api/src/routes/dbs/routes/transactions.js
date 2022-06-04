const _ = require("lodash");
const Joi = require("@hapi/joi");
const router = require("express").Router();

// Get Transactions
const columns = ["id","budgetID","date","amount","description"];
const dirs = ["asc", "desc"];

const getTransactionsQuerySchema = Joi.object().keys({
  budgetID: Joi.number().integer().positive(),
  descriptionSearch: Joi.string().allow(""),
  dateFrom: Joi.date().iso(),
  dateTo: Joi.date().iso(),
  amountFrom: Joi.number().integer(),
  amountTo: Joi.number().integer(),
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

  const { db } = req;
  const {
    budgetID,
    descriptionSearch,
    dateFrom,
    dateTo,
    amountFrom,
    amountTo,
    orderBy = columns[0],
    orderDir = dirs[0],
    limit,
    offset
  } = req.query;

  const dbQuery = db("Transactions");

  if (budgetID) {
    dbQuery.where("budgetID", budgetID);
  }

  if (descriptionSearch) {
    dbQuery.where("description", "like", `%${descriptionSearch}%`);
  }

  if (dateFrom) {
    dbQuery.where("date", ">=", dateFrom);
  }

  if (dateTo) {
    dbQuery.where("date", "<=", dateTo);
  }

  if (!isNaN(amountFrom)) {
    dbQuery.where("amount", ">=", amountFrom);
  }

  if (!isNaN(amountTo)) {
    dbQuery.where("amount", "<=", amountTo);
  }

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

  const { db } = req;
  const { transactions } = req.body;

  await db("Transactions").insert(transactions);

  return res.status(200).end();
});

module.exports = router;
