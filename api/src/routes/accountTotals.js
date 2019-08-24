const router = require("express").Router();

const { db } = require("../db");

// Get Account Totals
router.get('/', async (req, res) => {
	const accounts = await db("AccountTotals");

	res.json(accounts);
});

module.exports = router;
