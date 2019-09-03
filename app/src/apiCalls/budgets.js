import http from "./http";

async function getBudgets() {
  return (await http.get("/budgets")).data;
}

async function putBudget(budget) {
  return http.put("/budgets", { budget });
}

export {
  getBudgets,
  putBudget
};
