import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent
} from "@material-ui/core";
import styled from "styled-components/macro";
import moment from "moment";

import { postTransactions } from "../../apiCalls/transactions";
import { useBudgets, useAccountsMap } from "../../utilities/apiCallHooks";
import { InputsRow } from "../../components/layout";
import { AutoSuggest } from "../../components/inputs";

const ActionButtonRow = styled.div`
  text-align: right;
  margin: 20px;
`;

function dollarsToCents(amount) {
  return Math.round(amount * 100);
}

const initalAutoSuggestValue = {
  inputValue: "",
  value: null
};
const initalTextboxValue = "";

function QuickTransferModal(props) {
  const { activeDB, open, onClose, onTransferSuccess } = props;

  const [budgets] = useBudgets(activeDB, { active: true });
  const [accountsMap] = useAccountsMap(activeDB);

  const [fromBudget, setFromBudget] = useState(initalAutoSuggestValue);
  const [toBudget, setToBudget] = useState(initalAutoSuggestValue);
  const [date, setDate] = useState(initalTextboxValue);
  const [amount, setAmount] = useState(initalTextboxValue);
  const [description, setDescription] = useState(initalTextboxValue);

  function validateTransfer() {
    const errors = [];

    if (!fromBudget.value) {
      const errorText = "Invalid fromBudget value: No value found.";

      errors.push(errorText);
      console.log(errorText);
    }

    if (!toBudget.value) {
      const errorText = "Invalid toBudget value: No value found.";

      errors.push(errorText);
      console.log(errorText);
    }

    if (!moment(date, "YYYY-MM-DD", true).isValid()) {
      const errorText = "Invalid date specified.";

      errors.push(errorText);
      console.log(errorText);
    }

    if (Number.isNaN(amount)) {
      const errorText = "Invalid amount value: amount is NaN.";

      errors.push(errorText);
      console.log(errorText);
    } else if (Number(amount) <= 0) {
      const errorText = "Invalid amount value: amount must be greater than 0.";

      errors.push(errorText);
      console.log(errorText);
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length === 0 ? null : errors
    };
  }

  async function saveTransfer() {
    const transactions = [
      {
        budgetID: fromBudget.value.id,
        date,
        amount: dollarsToCents(-Number(amount)),
        description: `Transfer to ${toBudget.value.name}: ${description}`
      },
      {
        budgetID: toBudget.value.id,
        date,
        amount: dollarsToCents(Number(amount)),
        description: `Transfer from ${fromBudget.value.name}: ${description}`
      }
    ];

    return postTransactions(activeDB, transactions);
  }

  function clearValues() {
    setFromBudget(initalAutoSuggestValue);
    setToBudget(initalAutoSuggestValue);
    setDate(initalTextboxValue);
    setAmount(initalTextboxValue);
    setDescription(initalTextboxValue);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Quick Transfer
      </DialogTitle>
      <DialogContent>
        <InputsRow>
          <AutoSuggest
            items={budgets}
            inputValue={fromBudget.inputValue}
            getItemText={(item) => item.name}
            maxSuggestions={10}
            onChange={(newInputValue, newSelectedItem) => setFromBudget({
              inputValue: newInputValue,
              value: newSelectedItem
            })}
            label="From Budget"
            renderSuggestion={(highlightedText, suggestion) => (
              <React.Fragment>
                <span css="margin-right: 5px; color: rgba(0, 0, 0, 0.2);">
                  ({accountsMap[suggestion.accountID].name})
                </span>
                {highlightedText}
              </React.Fragment>
            )}
          />
          <AutoSuggest
            items={budgets}
            inputValue={toBudget.inputValue}
            getItemText={(item) => item.name}
            maxSuggestions={10}
            onChange={(newInputValue, newSelectedItem) => setToBudget({
              inputValue: newInputValue,
              value: newSelectedItem
            })}
            label="To Budget"
            renderSuggestion={(highlightedText, suggestion) => (
              <React.Fragment>
                <span css="margin-right: 5px; color: rgba(0, 0, 0, 0.2);">
                  ({accountsMap[suggestion.accountID].name})
                </span>
                {highlightedText}
              </React.Fragment>
            )}
          />
        </InputsRow>
        <InputsRow>
          <TextField
            label="Date"
            placeholder="YYYY-MM-DD"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <TextField
            type="number"
            label="Amount ($)"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </InputsRow>
        <ActionButtonRow>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              const { isValid } = validateTransfer();

              if (isValid) {
                await saveTransfer();
                clearValues();
                onTransferSuccess && onTransferSuccess();
              }
            }}
          >
            Transfer
          </Button>
        </ActionButtonRow>
      </DialogContent>
    </Dialog>
  );
}

export default QuickTransferModal;
