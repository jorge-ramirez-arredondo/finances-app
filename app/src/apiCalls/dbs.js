import http from "./http";

async function getDBs() {
  return (await http.get("/dbs")).data;
}

async function postDBs(dbNames) {
  return http.post("/dbs", {
    dbNames: Array.isArray(dbNames)
      ? dbNames
      : [dbNames]
  });
}

export {
  getDBs,
  postDBs
};
