import http from "./http";

async function getBudgetMonthlyTotals(dbName) {
  return (await http.get(`/dbs/${dbName}/stats/budgetMonthlyTotals`)).data;
}

export {
  getBudgetMonthlyTotals
};
