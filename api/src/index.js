const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require("./routes");

const app = express();
const port = 3030;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

app.use("/", routes);

app.listen(port, () => console.log(`App listening on port ${port}!`));
