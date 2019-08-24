import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from "@material-ui/core";

import { useAccountTotals } from "../utilities/apiCallHooks";
import { amountFormatter } from "../utilities/displayFormatters";

function Home(props) {
	const [accountTotals] = useAccountTotals();

	return (
		<div>
			Totals by Account
			{accountTotals ?
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{accountTotals.map((accountTotal) => (
							<TableRow key={accountTotal.id}>
								<TableCell>{accountTotal.id}</TableCell>
								<TableCell>{accountTotal.name}</TableCell>
								<TableCell>{accountTotal.description}</TableCell>
								<TableCell align="right">{amountFormatter(accountTotal.total)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				: null}
		</div>
	);
}

export default Home;
