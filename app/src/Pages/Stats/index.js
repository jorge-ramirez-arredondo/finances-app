import React, { useMemo, useState } from "react";
import "styled-components/macro";
import {
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip
} from "recharts";
import {
	MenuItem,
	Select,
	TextField
} from "@material-ui/core";

import { Section, InputsRow } from "../../components/layout";
import { AutoSuggest } from "../../components/inputs";
import { useBudgetMonthlyTotals, useTransactionTotals } from "../../utilities/apiCallHooks";
import { useAccountsMap, useBudgets, useAccounts } from "../../utilities/apiCallHooks";
import { amountFormatter } from "../../utilities/displayFormatters";

const oneYearAgo = (() => {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 1);
	return date;
})();

const lineColors = [
	"#001219",
	"#005f73",
	"#0a9396",
	"#94d2bd",
	"#e9d8a6",
	"#ee9b00",
	"#ca6702",
	"#bb3e03",
	"#ae2012",
	"#9b2226"
];

function isIsoDate(dateStr) {
	return /^\d{4}((-\d{2})?-\d{2})?$/gm.test(dateStr);
}

function isIsoMonthYear(dateStr) {
	return /^\d{4}(-\d{2})?$/gm.test(dateStr);
}

function groupByBudget(monthlyTotals, allowedBudgets) {
	return monthlyTotals.reduce((acc, monthlyTotal) => {
		const { id } = monthlyTotal;

		if (allowedBudgets && !allowedBudgets[id]) return acc; 

		if (!acc[id]) {
			acc[id] = [];
		}

		acc[id].push(monthlyTotal);
		
		return acc;
	}, {});
}

function createGroups(monthlyTotals) {
	return monthlyTotals.reduce(({ budgets, yearMonths }, monthlyTotal) => {
		const { id, yearMonth } = monthlyTotal;

		if (!budgets[id]) {
			budgets[id] = true;
		}

		if (!yearMonths[yearMonth]) {
			yearMonths[yearMonth] = {
				yearMonth,
				budgets: {}
			};
		}

		yearMonths[yearMonth].budgets[id] = monthlyTotal;
		
		return { budgets, yearMonths };
	}, { budgets: {}, yearMonths: {} });
}

function TransactionStats({ activeDB, accounts, budgets }) {
	const accountsAndBudgets = [...(accounts ?? []), ...(budgets ?? [])];
	const [accountBudgetFilter, setAccountBudgetFilter] = useState({});
	const [dateFrom, setDateFrom] = useState(oneYearAgo.toISOString().substring(0,10));
	const [dateTo, setDateTo] = useState();

	const [accountsMap] = useAccountsMap(activeDB);
	const [transactionTotals] = useTransactionTotals(activeDB);

	const graphData = useMemo(
		() => {
			if (!transactionTotals) return [];

			const data = [];
			let currIndex = -1;
			let currDate;
			transactionTotals.forEach((transaction) => {
				if (
					(dateFrom && transaction.date < dateFrom) ||
					(dateTo && transaction.date > dateTo)
				) {
					return;
				}

				if (transaction.date !== currDate) {
					currDate = transaction.date;
					data.push({ date: currDate });
					currIndex++;
				}

				data[currIndex] = {
					...data[currIndex],
					[`account_${transaction.accountID}`]: transaction.accountTotal,
					[`budget_${transaction.budgetID}`]: transaction.budgetTotal,
					total: transaction.total
				};
			});

			return data;
		},
		[transactionTotals, dateFrom, dateTo]
	);

	return (
		<React.Fragment>
			<div>
				<InputsRow>
					<span css="flex: 0.3 1 0">
						<AutoSuggest
							items={accountsAndBudgets}
							inputValue={accountBudgetFilter.inputValue}
							getItemText={(item) => item.name}
							maxSuggestions={10}
							onChange={(newInputValue, newSelectedItem) => setAccountBudgetFilter({
								inputValue: newInputValue,
								selectedItem: newSelectedItem
							})}
							label="Filter by Account or Budget"
							renderSuggestion={(highlightedText, suggestion) => (
								<React.Fragment>
									{suggestion.accountID && 
										<span css="margin-right: 5px; color: rgba(0, 0, 0, 0.2);">
											({accountsMap[suggestion.accountID].name})
										</span>
									}
									{highlightedText}
								</React.Fragment>
							)}
						/>
					</span>
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
				</InputsRow>
			</div>
			{graphData.length > 0 ?
				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={graphData}>
						{accountsAndBudgets.filter((accountOrBudget) =>
							!accountBudgetFilter.selectedItem || (
								Boolean(accountBudgetFilter.selectedItem.accountID) === Boolean(accountOrBudget.accountID) &&
								accountBudgetFilter.selectedItem.id === accountOrBudget.id
							)
						).map((accountOrBudget, index) => {
							const key = `${accountOrBudget.accountID ? 'budget' : 'account'}_${accountOrBudget.id}`;
							return (
								<Line
									key={key}
									dataKey={key}
									stroke={lineColors[index % lineColors.length]}
									connectNulls={true}
								/>
							);
						})}
						<CartesianGrid stroke="#ccc" />
						<XAxis dataKey="date" />
						<YAxis tickFormatter={(amount) => amountFormatter(amount, false)} />
						<Tooltip
							formatter={(value, key) => {
								const [type, idStr] = key.split('_');
								const id = Number(idStr);

								const name = type === 'budget'
									? budgets.find((budget) => budget.id === id).name
									: accounts.find((account) => account.id === id).name;

								return [amountFormatter(value), name];
							}}
						/>
					</LineChart>
				</ResponsiveContainer>
			: null}
		</React.Fragment>
	);
}

function BudgetMonthlyStats({ activeDB, budgets }) {
	const [budgetFilter, setBudgetFilter] = useState({});
	const [dateFrom, setDateFrom] = useState();
	const [dateTo, setDateTo] = useState();

	const [accountsMap] = useAccountsMap(activeDB);
	const [budgetMonthlyTotals] = useBudgetMonthlyTotals(activeDB);

	const graphData = useMemo(
		() => {
			if (!budgetMonthlyTotals) return { budgets: null, monthlyTotals: null };

			const { budgets, yearMonths } = createGroups(budgetMonthlyTotals);
			return {
				budgets: Object.keys(budgets).sort(),
				monthlyTotals: Object.keys(yearMonths)
					.map((yearMonth) => yearMonths[yearMonth])
					.filter((yearMonth) =>
						(!dateFrom || !isIsoMonthYear(dateFrom) || yearMonth.yearMonth >= dateFrom)
						&& (!dateTo || !isIsoMonthYear(dateTo) || yearMonth.yearMonth <= dateTo)
					).sort((a, b) => {
						if (a.yearMonth < b.yearMonth) return -1;
						if (a.yearMonth > b.yearMonth) return 1;
						return 0;
					})
			};
		},
		[budgetMonthlyTotals, dateFrom, dateTo]
	);

	return (
		<React.Fragment>
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
				</InputsRow>
			</div>
			{graphData.monthlyTotals ?
				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={graphData.monthlyTotals}>
						{graphData.budgets.filter((id) => 
							!budgetFilter.selectedItem || budgetFilter.selectedItem.id.toString() === id
						).map((id, index) => (
							<Line
								key={id}
								dataKey={({ budgets }) => budgets[id] ? budgets[id].total : 0}
								stroke={lineColors[index % lineColors.length]}
							/>
						))}
						<CartesianGrid stroke="#ccc" />
						<XAxis dataKey="yearMonth" />
						<YAxis tickFormatter={(amount) => amountFormatter(amount, false)} />
						<Tooltip
							formatter={(value) => amountFormatter(value)}
						/>
					</LineChart>
				</ResponsiveContainer>
			: null}
		</React.Fragment>
	);
}

const GRAPH_TYPES = {
	TRANSACTIONS: "TRANSACTIONS",
	BUDGETS_MONTHLY: "BUDGETS_MONTHLY",
	ACCOUNTS_MONTHLY: "ACCOUNTS_MONTHLY"
};

function Stats({ activeDB }) {
	const [accounts] = useAccounts(activeDB);
	const [budgets] = useBudgets(activeDB);
	const [graphType, setGraphType] = useState(GRAPH_TYPES.TRANSACTIONS);

	let graphElement;
	switch (graphType) {
		case GRAPH_TYPES.TRANSACTIONS:
			graphElement = (
				<TransactionStats activeDB={activeDB} accounts={accounts} budgets={budgets} />
			);
			break;
		case GRAPH_TYPES.BUDGETS_MONTHLY:
			graphElement = (
				<BudgetMonthlyStats activeDB={activeDB} budgets={budgets} />
			);
			break;
		case GRAPH_TYPES.ACCOUNTS_MONTHLY:
			
			break;
	}

	return (
		<Section>
			<div css="display: flex; justify-content: space-between; align-items: center;">
				Stats
				<Select
					value={graphType}
					label="Graph Type"
					onChange={(e) => setGraphType(e.target.value)}
				>
					<MenuItem value={GRAPH_TYPES.TRANSACTIONS}>Transaction Totals</MenuItem>
					<MenuItem value={GRAPH_TYPES.BUDGETS_MONTHLY}>Budget Monthly Totals</MenuItem>
					<MenuItem value={GRAPH_TYPES.ACCOUNTS_MONTHLY}>Account Monthly Totals</MenuItem>
				</Select>
			</div>
			{graphElement}
		</Section>
	);
}

export default Stats;
