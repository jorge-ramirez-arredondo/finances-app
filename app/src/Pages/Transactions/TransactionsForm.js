import React, { useState, useReducer, useCallback, useRef, useEffect } from "react";
import {
	Button,
	TextField
} from "@material-ui/core";
import styled from "styled-components";

import { postTransactions } from "../../apiCalls/transactions";

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
	accountID: "",
	date: "",
	amount: "",
	description: "",
	categoryID: "",
	key: 0
}];

function transactionsReducer(state, action) {
	switch (action.type) {
		case "add": {
			const {
				transaction = {
					accountID: "",
					date: "",
					amount: "",
					description: "",
					categoryID: "",
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
	const [
		transactions,
		transactionsDispatch
	] = useReducer(transactionsReducer, initialState);

	const lastAccountIDRef = useRef(null);

	const triggerLastAccountIDFocus = useEffectWithTrigger(() => {
		lastAccountIDRef.current.focus();
	});

	return (
		<div>
			{transactions.map(({
				key,
				accountID,
				date,
				amount,
				description,
				categoryID
			}, index) => (
				<Row key={key}>
					<TextField
						label="AccountID"
						value={accountID}
						onChange={(event) => transactionsDispatch({
							type: "update",
							index,
							transaction: { accountID: event.target.value }
						})}
						inputRef={transactions.length === index + 1
							? lastAccountIDRef
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
					<TextField
						label="CategoryID"
						value={categoryID}
						onChange={(event) => transactionsDispatch({
							type: "update",
							index,
							transaction: { categoryID: event.target.value }
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
						triggerLastAccountIDFocus();
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
						accountID,
						date,
						amount,
						description,
						categoryID
					}) => ({
						AccountID: accountID,
						Date: date,
						Amount: amount,
						Description: description,
						CategoryID: categoryID
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
