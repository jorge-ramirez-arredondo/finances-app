import React from "react";
import {
  Button,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import styled from "styled-components/macro";

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
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))
      }
    </div>
  );
}

export default TransactionSetsList;
