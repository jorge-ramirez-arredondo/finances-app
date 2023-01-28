import http from "./http";

async function getBudgets(dbName, params) {
  return (await http.get(`/dbs/${dbName}/budgets`, { params })).data;
}

async function putBudget(dbName, budget) {
  return http.put(`/dbs/${dbName}/budgets`, { budget });
}

export {
  getBudgets,
  putBudget
};
