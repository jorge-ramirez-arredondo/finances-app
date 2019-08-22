const router = require("express").Router();

const { db } = require("../db");

router.get('/', async (req, res) => {
	const accounts = await db("AccountTotals");

	res.json(accounts);
});

module.exports = router;
