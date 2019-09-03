import http from "./http";

async function getAccounts() {
	return (await http.get("/accounts")).data;
}

async function putAccount(account) {
  return http.put("/accounts", { account });
}

export {
	getAccounts,
  putAccount
};
