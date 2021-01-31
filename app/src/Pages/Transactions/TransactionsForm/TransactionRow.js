import React from "react";
import {
  Button,
  TextField
} from "@material-ui/core";
import styled from "styled-components/macro";

import { AutoSuggest } from "../../../components/inputs";
import { InputsRow } from "../../../components/layout";

const InputsSubRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const TransactionRow = React.memo(({
  index,
  budgets,
  budgetInputValue,
  onUpdate,
  budgetInputInnerRef,
  accountsMap,
  date,
  amount,
  description,
  showDeleteButton,
  showDuplicateButton,
  onDelete,
  onDuplicate
}) => (
  <InputsRow
    css={`
      padding-bottom: 15px;

      &:nth-child(odd) {
        background-color: #e7f5fd;
      }
    `}
  >
    <div
      css={`
        flex: 2 0 0;
        padding: 0 20px;
      `}
    >
      <InputsSubRow>
        <div css="flex: 0.65 1 0;">
        <AutoSuggest
          items={budgets}
          inputValue={budgetInputValue}
          getItemText={(item) => item.name}
          maxSuggestions={10}
          onChange={(newInputValue, newSelectedItem) => onUpdate(
            index,
            {
              budgetInputValue: newInputValue,
              budget: newSelectedItem
            }
          )}
          label="Budget"
          inputRef={budgetInputInnerRef}
          renderSuggestion={(highlightedText, suggestion) => (
            <React.Fragment>
              <span css="margin-right: 5px; color: rgba(0, 0, 0, 0.2);">
                ({accountsMap[suggestion.accountID].name})
              </span>
              {highlightedText}
            </React.Fragment>
          )}
        />
        </div>
      </InputsSubRow>
      <InputsSubRow>
        <TextField
          label="Date"
          placeholder="YYYY-MM-DD"
          value={date}
          onChange={(event) => onUpdate(index, { date: event.target.value })}
        />
        <TextField
          type="number"
          label="Amount ($)"
          value={amount}
          onChange={(event) => onUpdate(index, { amount: event.target.value })}
        />
      </InputsSubRow>
    </div>
    <InputsSubRow
      css={`
        flex: 2 0 0;
        padding: 0 20px;
      `}
    >
      <TextField
        fullWidth
        multiline
        rows={2}
        label="Description"
        value={description}
        onChange={(event) => onUpdate(index, { description: event.target.value })}
      />
    </InputsSubRow>
    {showDeleteButton || showDuplicateButton
      ? (
        <InputsSubRow
          css={`
            flex: 1 0 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 0 20px;
          `}
        >
          {showDeleteButton
            ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => onDelete(index)}
              >
                Delete
              </Button>
            ) : null}
          {showDuplicateButton
            ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => onDuplicate(index)}
              >
                Duplicate
              </Button>
            ) : null
          }
        </InputsSubRow>
      ) : null}
  </InputsRow>
));

export default TransactionRow;
