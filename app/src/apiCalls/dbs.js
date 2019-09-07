import http from "./http";

async function getDBs() {
  return (await http.get(`/dbs`)).data;
}

export {
  getDBs
};
