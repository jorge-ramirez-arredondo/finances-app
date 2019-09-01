import React, { useState, useReducer, useRef, useEffect } from "react";
import {
	Button,
	TextField
} from "@material-ui/core";
import styled from "styled-components";

import { postTransactions } from "../../apiCalls/transactions";
import { useBudgets } from "../../utilities/apiCallHooks";
import AutoSuggest from "../../components/inputs/AutoSuggest";

const Row = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	margin-bottom: 10px;
`;

const ActionButtonRow = styled.div`
	text-align: right;
	margin: 0 20px;
`;

const initialState = [{
	budgetID: "",
	date: "",
	amount: "",
	description: "",
	key: 0
}];

function transactionsReducer(state, action) {
	switch (action.type) {
		case "add": {
			const {
				transaction = {
					budgetID: "",
					date: "",
					amount: "",
					description: "",
					key: state[state.length - 1].key + 1
				}
			} = action;

			return [...state, transaction];
		}
		case "replace": {
			const { index, transaction } = action;

			return [
				...state.slice(0, index),
				transaction,
				...state.slice(index + 1)
			];
		}
		case "update": {
			const { index, transaction } = action;

			return [
				...state.slice(0, index),
				{ ...state[index], ...transaction },
				...state.slice(index + 1)
			];
		}
		case "delete": {
			const { index } = action;

			return [...state.slice(0, index), ...state.slice(index + 1)];
		}
		case "clear": {
			return initialState;
		}
		default:
			throw new Error("Invalid action");
	}
}

function useEffectWithTrigger(effect, watchList = []) {
	const [triggerValue, setTriggerValue] = useState(0);

	useEffect(effect, [triggerValue, ...watchList]);

	return () => setTriggerValue(triggerValue + 1);
}

function TransactionsForm({ onSaveSuccess }) {
	const [budgets] = useBudgets();
	const [
		transactions,
		transactionsDispatch
	] = useReducer(transactionsReducer, initialState);

	const lastBudgetIDRef = useRef(null);

	const triggerLastBudgetIDFocus = useEffectWithTrigger(() => {
		lastBudgetIDRef.current.input.focus();
	});

	return (
		<div>
			{transactions.map(({
				key,
				budgetInputValue,
				budget,
				date,
				amount,
				description,
			}, index) => (
				<Row key={key}>
					<AutoSuggest
						items={budgets}
						inputValue={budgetInputValue}
						getItemText={(item) => item.name}
						onChange={(newInputValue, newSelectedItem) => {
							transactionsDispatch({
								type: "update",
								index,
								transaction: {
									budgetInputValue: newInputValue,
									budget: newSelectedItem
								}
							});
						}}
						label="Budget"
						inputRef={transactions.length === index + 1
							? lastBudgetIDRef
							: null
						}
					/>
					<TextField
						label="Date"
						value={date}
						onChange={(event) => transactionsDispatch({
							type: "update",
							index,
							transaction: { date: event.target.value }
						})}
					/>
					<TextField
						type="number"
						label="Amount"
						value={amount}
						onChange={(event) => transactionsDispatch({
							type: "update",
							index,
							transaction: { amount: event.target.value }
						})}
					/>
					<TextField
						label="Description"
						value={description}
						onChange={(event) => transactionsDispatch({
							type: "update",
							index,
							transaction: { description: event.target.value }
						})}
					/>
					{transactions.length > 1
						? (
							<Button
								variant="contained"
								color="primary"
								onClick={() => transactionsDispatch({ type: "delete", index })}
							>
								Delete
							</Button>
						) : null}
				</Row>
			))}
			<Row>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						const lastTransaction = transactions[transactions.length - 1];

						transactionsDispatch({
							type: "add",
							transaction: {
								...lastTransaction,
								key: lastTransaction.key + 1
							}
						});
						triggerLastBudgetIDFocus();
					}}
				>
					Add
				</Button>
			</Row>
			<ActionButtonRow>
				<Button
					variant="contained"
					color="primary"
					onClick={() => postTransactions(transactions.map(({
						budget,
						date,
						amount,
						description
					}) => ({
						budgetID: budget.id,
						date,
						amount,
						description
					}))).then(() => {
						transactionsDispatch({ type: "clear" });
						typeof onSaveSuccess === "function" && onSaveSuccess();
					})}
				>
					Save Transactions
				</Button>
			</ActionButtonRow>
		</div>
	);
}

export default TransactionsForm;
