import http from "./http";

async function getAccountTotals() {
	return (await http.get("/accountTotals")).data;
}

export {
	getAccountTotals
};
