import http from "./http";

async function getBudgets() {
  return (await http.get("/budgets")).data;
}

export {
  getBudgets
};
