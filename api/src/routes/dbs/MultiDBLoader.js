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
  }

  doesDBExist(name) {
    return this.dbList.includes(name);
  }

  async _openDB(name) {
    this._dbsMap[name] = knex({
      client: "sqlite3",
      connection: {
        filename: path.resolve(dbsFolder, `${name}.db`)
      },
      useNullAsDefault: true
    });

    await this._dbsMap[name].migrate.latest();
  }

  async _openExistingDB(name) {
    if (this.doesDBExist(name)) {
      await this._openDB(name);
    } else {
      throw new Error(`Cannot load DB "${name}". DB file could not be found.`);
    }
  }

  async _openNewDB(name) {
    if (!this.doesDBExist(name)) {
      await this._openDB(name);
    } else {
      throw new Error(`DB "${name}" already exists.`);
    }
  }

  async getDB(name) {
    if (!this._dbsMap[name]) {
      await this._openExistingDB(name);
    }

    return this._dbsMap[name];
  }

  async createDB(name) {
    await this._openNewDB(name);
  }
}

module.exports = MultiDBLoader;
