import http from "./http";

async function getTransactions(params) {
	return (await http.get("/transactions", {
		params
	})).data;
}

async function postTransactions(transactions) {
	return http.post("/transactions", {
		transactions: Array.isArray(transactions)
			? transactions
			: [transactions]
	});
}

export {
	getTransactions,
	postTransactions
};
