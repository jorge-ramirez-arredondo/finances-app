const knex = require("knex");
const path = require('path');

const config = require("./config");

const dbPath = path.resolve(__dirname, config.dbPath);
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath
  },
  useNullAsDefault: true
});

module.exports = { db };
