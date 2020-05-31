import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import styled from "styled-components/macro";

import { putBudget } from "../../apiCalls/budgets";
import { useAccounts } from "../../utilities/apiCallHooks";
import { InputsRow } from "../../components/layout";
import { AutoSuggest } from "../../components/inputs";
import { QuickTransferModal } from "../../components/modals";

const ActionButtonRow = styled.div`
  text-align: right;
  margin: 0 20px;
`;

const defaultNewBudgetState = {
  accountInputValue: "",
  account: null,
  name: "",
  description: ""
};

function BudgetForm(props) {
  const { activeDB, onSaveSuccess, onQuickTransferSuccess } = props;

  const [accounts] = useAccounts(activeDB);
  const [newBudget, setNewBudget] = useState(defaultNewBudgetState);
  const [quickTransferModalOpen, setQuickTransferModalOpen] = useState(false);

  return (
    <>
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
          onClick={() => setQuickTransferModalOpen(true)}
        >
          Quick Transfer
        </Button>
      </ActionButtonRow>
      <InputsRow>
        <span>Create New Budget:</span>
        <AutoSuggest
          label="Account"
          items={accounts}
          inputValue={newBudget.accountInputValue}
          getItemText={(item) => item.name}
          onChange={(newInputValue, newSelectedItem) => setNewBudget({
            ...newBudget,
            accountInputValue: newInputValue,
            account: newSelectedItem
          })}
        />
        <TextField
          label="Name"
          value={newBudget.name}
          onChange={(event) => setNewBudget({
            ...newBudget,
            name: event.target.value
          })}
        />
        <TextField
          label="Description"
          value={newBudget.description}
          onChange={(event) => setNewBudget({
            ...newBudget,
            description: event.target.value
          })}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!newBudget.account || !newBudget.name}
          onClick={() => putBudget(activeDB, {
            accountID: newBudget.account.id,
            name: newBudget.name,
            description: newBudget.description
          }).then(() => {
            setNewBudget(defaultNewBudgetState);
            typeof onSaveSuccess === "function" && onSaveSuccess();
          })}
        >
          Save
        </Button>
      </InputsRow>
    </>
  );
}

export default BudgetForm;
