import React, { useState, useReducer, useMemo } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent
} from "@material-ui/core";
import styled from "styled-components/macro";

import { putTransactionSet } from "../../apiCalls/transactionSets";
import { useBudgets, useBudgetsMap, useAccountsMap } from "../../utilities/apiCallHooks";
import { AutoSuggest } from "../../components/inputs";
import { InputsRow } from "../../components/layout";

const ActionButtonRow = styled.div`
  text-align: right;
  margin: 0 20px;
`;

function dollarsToCents(amount) {
  return Math.round(amount * 100);
}

const transactionItemsInitialState = [{
  budgetInputValue: "",
  amount: "",
  description: "",
  key: 0
}];

function transactionItemsReducer(state, action) {
  switch (action.type) {
    case "add": {
      const {
        transactionItem = {
          budgetInputValue: "",
          amount: "",
          description: "",
          key: state[state.length - 1].key + 1
        }
      } = action;

      return [...state, transactionItem];
    }
    case "replace": {
      const { index, transactionItem } = action;

      return [
        ...state.slice(0, index),
        transactionItem,
        ...state.slice(index + 1)
      ];
    }
    case "update": {
      const { index, transactionItem } = action;

      return [
        ...state.slice(0, index),
        { ...state[index], ...transactionItem },
        ...state.slice(index + 1)
      ];
    }
    case "delete": {
      const { index } = action;

      return [...state.slice(0, index), ...state.slice(index + 1)];
    }
    case "clear": {
      return transactionItemsInitialState;
    }
    default:
      throw new Error("Invalid action");
  }
}

function TransactionSetForm({
  budgets,
  accountsMap,
  open,
  onClose,
  editMode,
  transactionSetID,
  initialState = {},
  onSaveTransactionSet,
  onSaveSuccess
}) {
  const {
    name: initialName = "",
    description: initialSetDescription = "",
    items: initalItems = transactionItemsInitialState
  } = initialState;

  const [name, setName] = useState(initialName);
  const [setDescription, setSetDescription] = useState(initialSetDescription);
  const [
    transactionItems,
    transactionItemsDispatch
  ] = useReducer(transactionItemsReducer, initalItems);

  if (!budgets || !accountsMap) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {editMode ? "Edit" : "Add New"} Transaction Set
      </DialogTitle>
      <DialogContent>
        <InputsRow>
          <div>Set Details:</div>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Description"
            value={setDescription}
            onChange={(event) => setSetDescription(event.target.value)}
          />
        </InputsRow>
        <div>Set Transactions:</div>
        {transactionItems.map(({ key, budgetInputValue, amount, description }, index) => (
          <InputsRow key={key}>
            <AutoSuggest
              items={budgets}
              inputValue={budgetInputValue}
              getItemText={(item) => item.name}
              maxSuggestions={10}
              onChange={(newInputValue, newSelectedItem) => transactionItemsDispatch({
                type: "update",
                index,
                transactionItem: {
                  budgetInputValue: newInputValue,
                  budget: newSelectedItem
                }
              })}
              label="Budget"
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
              type="number"
              label="Amount ($)"
              value={amount}
              onChange={(event) => transactionItemsDispatch({
                type: "update",
                index,
                transactionItem: { amount: event.target.value }
              })}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(event) => transactionItemsDispatch({
                type: "update",
                index,
                transactionItem: { description: event.target.value }
              })}
            />
            {transactionItems.length > 1
              ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => transactionItemsDispatch({ type: "delete", index })}
                >
                  Delete
                </Button>
              ) : null}
          </InputsRow>
        ))}
        <InputsRow>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const lastTransactionItem = transactionItems[transactionItems.length - 1];

              transactionItemsDispatch({
                type: "add",
                transactionItem: {
                  ...lastTransactionItem,
                  key: lastTransactionItem.key + 1
                }
              });
            }}
          >
            Add
          </Button>
        </InputsRow>
        <ActionButtonRow>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSaveTransactionSet({
              id: transactionSetID,
              name,
              description: setDescription,
              items: transactionItems.map(({
                budget,
                amount,
                description
              }) => ({
                budgetID: budget.id,
                amount: dollarsToCents(Number(amount)),
                description
              }))
            }).then(() => {
              transactionItemsDispatch({ type: "clear" });
              typeof onClose === "function" && onClose();
              typeof onSaveSuccess === "function" && onSaveSuccess();
            })}
          >
            Save Transaction Set
          </Button>
        </ActionButtonRow>
      </DialogContent>
    </Dialog>
  );
}

function TransactionSetFormWrapper({ activeDB, editableTransactionSet, ...rest }) {
  const [budgets] = useBudgets(activeDB, { active: true });
  const [budgetsMap] = useBudgetsMap(activeDB);
  const [accountsMap] = useAccountsMap(activeDB);

  const initialFormState = useMemo(() => {
    if (!editableTransactionSet || !budgetsMap) {
      return;
    }

    return {
      name: editableTransactionSet.name,
      description: editableTransactionSet.description,
      items: editableTransactionSet.items.map(({ budgetID, amount, description }, index) => ({
        key: index,
        budget: budgetsMap[budgetID],
        budgetInputValue: budgetsMap[budgetID].name,
        amount: amount * 0.01,
        description
      }))
    };
  }, [editableTransactionSet, budgetsMap]);

  return (
    <TransactionSetForm
      key={initialFormState ? editableTransactionSet.id : "Add"}
      transactionSetID={initialFormState && editableTransactionSet.id}
      budgets={budgets}
      accountsMap={accountsMap}
      editMode={editableTransactionSet}
      initialState={initialFormState}
      onSaveTransactionSet={(...args) => putTransactionSet(activeDB, ...args)}
      {...rest}
    />
  );
}

export default TransactionSetFormWrapper;
