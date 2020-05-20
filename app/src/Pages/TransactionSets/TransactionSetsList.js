import React, { useState } from "react";
import {
  Button,
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  CircularProgress
} from "@material-ui/core";
import styled from "styled-components/macro";

import { postTransactions } from "../../apiCalls/transactions";
import { useTransactionSets, useBudgetsMap, useAccountsMap } from "../../utilities/apiCallHooks";
import { amountFormatter } from "../../utilities/displayFormatters";
import { InputsRow } from "../../components/layout";

const TransactionSetItemLabel = styled.span`
  flex: 1 1 0;
`;

function TransactionSetItem({ budgetName, accountName, amount, description }) {
  return (
    <InputsRow>
      <TransactionSetItemLabel>Budget: {budgetName} ({accountName})</TransactionSetItemLabel>
      <TransactionSetItemLabel>Amount: {amountFormatter(amount)}</TransactionSetItemLabel>
      <TransactionSetItemLabel>Description: {description}</TransactionSetItemLabel>
    </InputsRow>
  );
}

function TransactionSetsList({ activeDB, onEditTransactionSet }) {
  const [transactionSets] = useTransactionSets(activeDB);
  const [budgetsMap] = useBudgetsMap(activeDB);
  const [accountsMap] = useAccountsMap(activeDB);
  const [dates, setDates] = useState({});
  const [saving, setSaving] = useState(false);

  return (
    <div>
      <div css="margin: 15px;">
        Transaction Sets List
      </div>
      {!transactionSets || !budgetsMap || !accountsMap ? "Loading..." :
        transactionSets.map(({ id, name, description, items }) => (
          <ExpansionPanel key={id}>
            <ExpansionPanelSummary>
              {name}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div css="width: 100%;">
                {description}
                {typeof onEditTransactionSet === "function" ?
                  <div css="text-align: right;">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => onEditTransactionSet({ id, name, description, items })}
                    >
                      Edit
                    </Button>
                  </div>
                : null}
                {items.map(({ id: itemID, budgetID, ...rest }) => (
                  <TransactionSetItem
                    key={itemID}
                    {...rest}
                    budgetName={budgetsMap[budgetID].name}
                    accountName={accountsMap[budgetsMap[budgetID].accountID].name}
                  />
                ))}
                <InputsRow>
                  <TextField
                    label="Date"
                    placeholder="YYYY-MM-DD"
                    value={dates[id] || ""}
                    onChange={(event) => setDates({
                      ...dates,
                      [id]: event.target.value
                    })}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                      setSaving(true);
                      await postTransactions(activeDB, items.map(({
                        budgetID,
                        amount,
                        description: itemDescription
                      }) => ({
                        budgetID,
                        date: dates[id],
                        amount,
                        description: itemDescription
                      })));
                      setDates({
                        ...dates,
                        [id]: ""
                      });
                      setSaving(false);
                    }}
                    disabled={!dates[id] || saving}
                  >
                    {saving && <CircularProgress size={24} />}
                    Execute Set
                  </Button>
                </InputsRow>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))
      }
    </div>
  );
}

export default TransactionSetsList;
