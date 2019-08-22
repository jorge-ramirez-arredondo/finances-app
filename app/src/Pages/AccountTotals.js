import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from "@material-ui/core";

import { getAccountTotals } from "../apiCalls/accountTotals";

function Home(props) {
	const [accountTotals, setAccountTotals] = useState(null);

	useEffect(() => {
		getAccountTotals().then(setAccountTotals);
	}, []);

	return (
		<div>
			Totals by Account
			{accountTotals ?
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Total</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Active</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{accountTotals.map((accountTotal) => (
							<TableRow key={accountTotal.Name}>
								<TableCell>{accountTotal.Name}</TableCell>
								<TableCell align="right">{accountTotal.Total}</TableCell>
								<TableCell>{accountTotal.Description}</TableCell>
								<TableCell>
									{Boolean(accountTotal.Active) ? "True" : "False"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				: null}
		</div>
	);
}

export default Home;
