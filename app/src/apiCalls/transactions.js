import http from "./http";

async function getTransactions(dbName, params) {
	return (await http.get(`/dbs/${dbName}/transactions`, {
		params
	})).data;
}

async function postTransactions(dbName, transactions) {
	return http.post(`/dbs/${dbName}/transactions`, {
		transactions: Array.isArray(transactions)
			? transactions
			: [transactions]
	});
}

export {
	getTransactions,
	postTransactions
};
