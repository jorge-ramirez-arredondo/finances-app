import http from "./http";

async function getAccountTotals(dbName) {
	return (await http.get(`/dbs/${dbName}/accountTotals`)).data;
}

export {
	getAccountTotals
};
