import React, { useState, useReducer, useRef, useEffect, useCallback } from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components/macro";
import { v4 as uuidv4 } from "uuid";

import { postTransactions } from "../../../apiCalls/transactions";
import { useBudgets, useAccountsMap } from "../../../utilities/apiCallHooks";
import { QuickTransferModal } from "../../../components/modals";
import { InputsRow } from "../../../components/layout";

import CSVLoader from "./CSVLoader";
import TransactionRow from "./TransactionRow";


const ActionButtonRow = styled.div`
  text-align: right;
  margin: 0 20px;
  & > * {
    &:not(:last-child) {
      margin-right: 15px;
    }
  }
`;

function dollarsToCents(amount) {
  return Math.round(amount * 100);
}

const initialState = [{
  budgetID: "",
  date: "",
  amount: "",
  description: "",
  key: uuidv4()
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
          key: uuidv4()
        }
      } = action;

      return [...state, transaction];
    }
    case "duplicate": {
      const { index } = action;

      const duplicateTransaction = {
        ...state[index],
        key: uuidv4()
      };

      const newState = [...state];
      newState.splice(index + 1, 0, duplicateTransaction);

      return newState;
    }
    case "replace": {
      const { index, transaction } = action;

      return [
        ...state.slice(0, index),
        transaction,
        ...state.slice(index + 1)
      ];
    }
    case "replaceAll": {
      const { transactions } = action;

      return transactions;
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

function TransactionsForm({ activeDB, onSaveSuccess, onQuickTransferSuccess }) {
  const [budgets] = useBudgets(activeDB, { active: true });
  const [accountsMap] = useAccountsMap(activeDB);
  const [
    transactions,
    transactionsDispatch
  ] = useReducer(transactionsReducer, initialState);

  const lastBudgetIDRef = useRef(null);
  const [csvLoaderModalOpen, setCSVLoaderModalOpen] = useState(false);
  const [quickTransferModalOpen, setQuickTransferModalOpen] = useState(false);

  const triggerLastBudgetIDFocus = useEffectWithTrigger(() => {
    lastBudgetIDRef.current.input.focus();
  });

  const onTransactionUpdate = useCallback((index, transaction) => {
    transactionsDispatch({
      type: "update",
      index,
      transaction
    });
  }, [transactionsDispatch]);

  const onTransactionDelete = useCallback((index) => {
    transactionsDispatch({ type: "delete", index });
  }, [transactionsDispatch]);

  const onTransactionDuplicate = useCallback((index) => {
    transactionsDispatch({ type: "duplicate", index });
  }, [transactionsDispatch]);

  return (
    <div>
      <CSVLoader
        open={csvLoaderModalOpen}
        onClose={() => setCSVLoaderModalOpen(false)}
        onCSVLoad={(newTransactions) => {
          transactionsDispatch({
            type: "replaceAll",
            transactions: newTransactions
          });
          setCSVLoaderModalOpen(false);
        }}
      />
      <QuickTransferModal
        open={quickTransferModalOpen}
        onClose={() => setQuickTransferModalOpen(false)}
        onTransferSuccess={onQuickTransferSuccess}
        activeDB={activeDB}
      />
      <ActionButtonRow>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCSVLoaderModalOpen(true)}
        >
          CSV Loader
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setQuickTransferModalOpen(true)}
        >
          Quick Transfer
        </Button>
      </ActionButtonRow>
      {transactions.map(({
        key,
        budgetInputValue,
        budget,
        date,
        amount,
        description,
      }, index) => (
        <TransactionRow
          key={key}
          index={index}
          budgets={budgets}
          budgetInputValue={budgetInputValue}
          onUpdate={onTransactionUpdate}
          budgetInputInnerRef={transactions.length === index + 1
            ? lastBudgetIDRef
            : null
          }
          accountsMap={accountsMap}
          date={date}
          amount={amount}
          description={description}
          showDeleteButton={transactions.length > 1}
          showDuplicateButton={transactions.length > 1}
          onDelete={onTransactionDelete}
          onDuplicate={onTransactionDuplicate}
        />
      ))}
      <InputsRow>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const lastTransaction = transactions[transactions.length - 1];

            transactionsDispatch({
              type: "add",
              transaction: {
                ...lastTransaction,
                key: uuidv4()
              }
            });
            triggerLastBudgetIDFocus();
          }}
        >
          Add
        </Button>
      </InputsRow>
      <ActionButtonRow>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            let hasError = false;
            const body = transactions.map(({
              budget,
              date,
              amount,
              description
            }, index) => {
              if (!budget) {
                hasError = true;
                console.error(`No budget selected at row index ${index}.`);
                return null;
              }

              return {
                budgetID: budget.id,
                date,
                amount: dollarsToCents(Number(amount)),
                description
              };
            });

            if (hasError) {
              return;
            }

            postTransactions(activeDB, body).then(() => {
              transactionsDispatch({ type: "clear" });
              typeof onSaveSuccess === "function" && onSaveSuccess();
            });
          }}
        >
          Save Transactions
        </Button>
      </ActionButtonRow>
    </div>
  );
}

export default TransactionsForm;
