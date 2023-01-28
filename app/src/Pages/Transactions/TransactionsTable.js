import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Button,
	CircularProgress
} from "@material-ui/core";
import styled from "styled-components/macro";

import useMoneyColorClassGetter from "../../utilities/useMoneyColorClassGetter";
import { useAccountsMap, useBudgets, useBudgetsMap, usePaginatedTransactions } from "../../utilities/apiCallHooks";
import { amountFormatter } from "../../utilities/displayFormatters";
import { Section, InputsRow } from "../../components/layout";
import { AutoSuggest } from "../../components/inputs";

const LoadMoreRow = styled.div`
	text-align: center;
	margin-top: 15px;
`;

function dollarsToCents(amount) {
  return Math.round(amount * 100);
}

function isIsoDate(dateStr) {
	return /^\d{4}((-\d{2})?-\d{2})?$/gm.test(dateStr);
}

function TransactionsTable({ activeDB }) {
	const [budgetFilter, setBudgetFilter] = useState({});
	const [descriptionSearch, setDescriptionSearch] = useState();
	const [dateFrom, setDateFrom] = useState();
	const [dateTo, setDateTo] = useState();
	const [amountFrom, setAmountFrom] = useState();
	const [amountTo, setAmountTo] = useState();

	const [budgets] = useBudgets(activeDB, { active: true });
	const [budgetsMap] = useBudgetsMap(activeDB);
	const [accountsMap] = useAccountsMap(activeDB);

	const filters = {};
	if (budgetFilter.selectedItem) { filters.budgetID = budgetFilter.selectedItem.id; }
	if (descriptionSearch) { filters.descriptionSearch = descriptionSearch; }
	if (dateFrom && isIsoDate(dateFrom)) { filters.dateFrom = dateFrom; }
	if (dateTo && isIsoDate(dateTo)) { filters.dateTo = dateTo; }
	if (amountFrom && !isNaN(amountFrom)) { filters.amountFrom = dollarsToCents(Number(amountFrom)); }
	if (amountTo && !isNaN(amountTo)) { filters.amountTo = dollarsToCents(Number(amountTo)); }
	const [transactions, loadMoreTransactions, isLoading] = usePaginatedTransactions(activeDB, filters);

  const moneyColorClassGetter = useMoneyColorClassGetter();

	return (
		<Section>
			Transactions
			<div>
				<InputsRow>
					<AutoSuggest
						items={budgets}
						inputValue={budgetFilter.inputValue}
						getItemText={(item) => item.name}
						maxSuggestions={10}
						onChange={(newInputValue, newSelectedItem) => setBudgetFilter({
							inputValue: newInputValue,
							selectedItem: newSelectedItem
						})}
						label="Filter by Budget"
						renderSuggestion={(highlightedText, suggestion) => (
							<React.Fragment>
							<span css="margin-right: 5px; color: rgba(0, 0, 0, 0.2);">
								({accountsMap[suggestion.accountID].name})
							</span>
							{highlightedText}
							</React.Fragment>
						)}
					/>
					<TextField
						label="Description Search"
						value={descriptionSearch}
						onChange={(event) => setDescriptionSearch(event.target.value)}
					/>
					<TextField
					  label="Date From"
					  placeholder="YYYY-MM-DD"
					  value={dateFrom}
					  onChange={(event) => setDateFrom(event.target.value)}
					/>
					<TextField
					  label="Date To"
					  placeholder="YYYY-MM-DD"
					  value={dateTo}
					  onChange={(event) => setDateTo(event.target.value)}
					/>
					<TextField
					  type="number"
					  label="Amount From ($)"
					  value={amountFrom}
					  onChange={(event) => setAmountFrom(event.target.value)}
					/>
					<TextField
					  type="number"
					  label="Amount To ($)"
					  value={amountTo}
					  onChange={(event) => setAmountTo(event.target.value)}
					/>
				</InputsRow>
			</div>
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
									<TableCell>{account.name}</TableCell>
									<TableCell>{budget.name}</TableCell>
									<TableCell>{transaction.date}</TableCell>
									<TableCell
										align="right"
										classes={{
										  root: moneyColorClassGetter(transaction.amount)
										}}
									>
										{amountFormatter(transaction.amount)}
									</TableCell>
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
		</Section>
	);
}

export default TransactionsTable;
