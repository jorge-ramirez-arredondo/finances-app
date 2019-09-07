import http from "./http";

async function getAccounts(dbName) {
	return (await http.get(`/dbs/${dbName}/accounts`)).data;
}

async function putAccount(dbName, account) {
  return http.put(`/dbs/${dbName}/accounts`, { account });
}

export {
	getAccounts,
  putAccount
};
