import http from "./http";

async function getAccounts() {
	return (await http.get("/accounts")).data;
}

export {
	getAccounts
};
