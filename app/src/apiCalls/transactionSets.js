import http from "./http";

async function getTransactionSets(dbName, params) {
  return (await http.get(`/dbs/${dbName}/transactionSets`, {
    params
  })).data;
}

async function putTransactionSet(dbName, transactionSet) {
  return http.put(`/dbs/${dbName}/transactionSets`, {
    transactionSet
  });
}

export {
  getTransactionSets,
  putTransactionSet
};
