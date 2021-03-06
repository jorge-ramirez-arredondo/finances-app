const router = require("express").Router();

// Get Account Totals
router.get('/', async (req, res) => {
  const { db } = req;
	const accounts = await db("AccountTotals").orderBy("name", "asc");

	res.json(accounts);
});

module.exports = router;
