import http from "./http";

async function getBudgetTotals(dbName) {
  return (await http.get(`/dbs/${dbName}/budgetTotals`)).data;
}

export {
  getBudgetTotals
};
