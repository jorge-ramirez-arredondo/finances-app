const knex = require("knex");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");

const dbsFolder = path.resolve(__dirname, "../../../data/");
const dbFileRegex = /\.db$/i;

class MultiDBLoader {
  constructor() {
    this._dbsMap = {};
  }

  get dbList() {
    const fileNames = fs.readdirSync(dbsFolder);
    return _
      .chain(fileNames)
      .filter((fileName) => dbFileRegex.test(fileName))
      .map((fileName) => fileName.substring(0, fileName.length - 3))
      .value();
  };

  doesDBExist(name) {
    return this.dbList.includes(name);
  };

  _openDB(name) {
    if (this.doesDBExist(name)) {
      this._dbsMap[name] = knex({
        client: "sqlite3",
        connection: {
          filename: path.resolve(dbsFolder, `${name}.db`)
        },
        useNullAsDefault: true
      });
    } else {
      throw new Error(`Cannot load DB "${name}". DB file could not be found.`);
    }
  };

  getDB(name) {
    if (!this._dbsMap[name]) {
      this._openDB(name);
    }

    return this._dbsMap[name];
  };
}

module.exports = MultiDBLoader;
