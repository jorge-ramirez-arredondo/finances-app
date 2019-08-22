const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const accounts = require("./routes/accounts");
const accountTotals = require("./routes/accountTotals");
const transactions = require("./routes/transactions");

const app = express();
const port = 3030;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

app.use("/accounts", accounts);
app.use("/accountTotals", accountTotals);
app.use("/transactions", transactions);

app.listen(port, () => console.log(`App listening on port ${port}!`));
