const _ = require("lodash");
const Joi = require("@hapi/joi");
const router = require("express").Router();

const { db } = require("../db");

const columns = ["ID","AccountID","Date","Amount","Description","CategoryID"];
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
		dbQuery.orderBy(_orderBy, dirs.includes(orderDir) ? orderDir : undefined);
	}

	if (limit) {
		dbQuery.limit(limit);
	}

	if (offset) {
		dbQuery.offset(offset);
	}

	const accounts = await dbQuery;

	res.json(accounts);
});

const postTransactionsBodySchema = Joi.object().keys({
	transactions: Joi.array().items(Joi.object().keys({
		AccountID: Joi.string().required(),
		Date: Joi.date().iso().required(),
		Amount: Joi.number().integer().required(),
		Description: Joi.string(),
		CategoryID: Joi.string().required()
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
