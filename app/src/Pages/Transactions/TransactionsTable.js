import React, { useState, useEffect, useCallback } from "react";
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

import { getTransactions } from "../../apiCalls/transactions";

const LoadMoreRow = styled.div`
	text-align: center;
	margin-top: 15px;
`;

function amountFormatter(amount) {
	return `$${(amount / 100).toFixed(2)}`;
}

const useStyles = makeStyles(() => ({
  root: {
    padding: 20,
    margin: 20
  },
}));

function useTransactions({ orderBy = "date", orderDir = "desc", limit = 10 } = {}) {
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function loadInitialTransactions() {
			setIsLoading(true);
			const initialTransactions = await getTransactions({
				orderBy,
				orderDir,
				limit,
				offset: 0
			});

			setTransactions(initialTransactions);
			setIsLoading(false);
		}
		loadInitialTransactions();
	}, [orderBy, orderDir, limit]);

	const loadMoreTransactions = useCallback(async () => {
		setIsLoading(true);
		const newTransactions = await getTransactions({
			orderBy,
			orderDir,
			limit,
			offset: transactions.length
		});

		setTransactions([...transactions, ...newTransactions]);
		setIsLoading(false);
	}, [transactions, orderBy, orderDir, limit]);

	return [isLoading, transactions, loadMoreTransactions];
}

function TransactionsTable() {
	const classes = useStyles();
	const [isLoading, transactions, loadMoreTransactions] = useTransactions();

	return (
		<Paper className={classes.root}>
			Transactions
			{transactions.length ?
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>AccountID</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>CategoryID</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{transactions.map((transaction) => (
							<TableRow key={transaction.ID}>
								<TableCell>{transaction.AccountID}</TableCell>
								<TableCell>{transaction.Date}</TableCell>
								<TableCell align="right">{amountFormatter(transaction.Amount)}</TableCell>
								<TableCell>{transaction.Description}</TableCell>
								<TableCell>{transaction.CategoryID}</TableCell>
							</TableRow>
						))}
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
