const router = require("express").Router();

const dbs = require("./dbs");

router.use("/dbs", dbs);

module.exports = router;
