import http from "./http";

async function getBudgetMonthlyTotals(dbName) {
  return (await http.get(`/dbs/${dbName}/stats/budgetMonthlyTotals`)).data;
}

async function getTransactionTotals(dbName) {
  return (await http.get(`/dbs/${dbName}/stats/transactionTotals`)).data;
}

export {
  getBudgetMonthlyTotals,
  getTransactionTotals
};
