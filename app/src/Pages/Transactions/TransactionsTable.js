import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	CircularProgress,
	Paper,
	makeStyles
} from "@material-ui/core";
import styled from "styled-components";

import { useAccountsMap, useBudgetsMap, usePaginatedTransactions } from "../../utilities/apiCallHooks";
import { amountFormatter } from "../../utilities/displayFormatters";

const LoadMoreRow = styled.div`
	text-align: center;
	margin-top: 15px;
`;

const useStyles = makeStyles(() => ({
  root: {
    padding: 20,
    margin: 20
  },
}));

function TransactionsTable() {
	const classes = useStyles();
	const [budgetsMap] = useBudgetsMap();
	const [accountsMap] = useAccountsMap();
	const [transactions, loadMoreTransactions, isLoading] = usePaginatedTransactions();

	return (
		<Paper className={classes.root}>
			Transactions
			{budgetsMap && accountsMap && transactions && transactions.length ?
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Account</TableCell>
							<TableCell>Budget</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Description</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{transactions.map((transaction) => {
							const budget = budgetsMap[transaction.budgetID];
							const account = accountsMap[budget.accountID];

							return (
								<TableRow key={transaction.id}>
									<TableCell>({account.id}) {account.name}</TableCell>
									<TableCell>({budget.id}) {budget.name}</TableCell>
									<TableCell>{transaction.date}</TableCell>
									<TableCell align="right">{amountFormatter(transaction.amount)}</TableCell>
									<TableCell>{transaction.description}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				: null}
			<LoadMoreRow>
				{isLoading ? <CircularProgress /> :
					<Button
						variant="contained"
						color="primary"
						onClick={loadMoreTransactions}
					>
						Load More
					</Button>
				}
			</LoadMoreRow>
		</Paper>
	);
}

export default TransactionsTable;
