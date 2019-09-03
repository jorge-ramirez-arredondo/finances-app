import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";

import { putBudget } from "../../apiCalls/budgets";
import { useAccounts } from "../../utilities/apiCallHooks";
import { InputsRow } from "../../components/layout";
import { AutoSuggest } from "../../components/inputs";

const defaultNewBudgetState = {
  accountInputValue: "",
  account: null,
  name: "",
  description: ""
};

function BudgetForm(props) {
  const { onSaveSuccess } = props;

  const [accounts] = useAccounts();
  const [newBudget, setNewBudget] = useState(defaultNewBudgetState);

  return (
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
        onClick={() => putBudget({
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
  );
}

export default BudgetForm;
