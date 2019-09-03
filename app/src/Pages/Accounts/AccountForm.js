import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";

import { putAccount } from "../../apiCalls/accounts";
import { InputsRow } from "../../components/layout";

const defaultNewAccountState = { name: "", description: "" };

function AccountForm(props) {
  const { onSaveSuccess } = props;

  const [newAccount, setNewAccount] = useState(defaultNewAccountState);

  return (
    <InputsRow>
      <span>Create New Account:</span>
      <TextField
        label="Name"
        value={newAccount.name}
        onChange={(event) => setNewAccount({
          ...newAccount,
          name: event.target.value
        })}
      />
      <TextField
        label="Description"
        value={newAccount.description}
        onChange={(event) => setNewAccount({
          ...newAccount,
          description: event.target.value
        })}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => putAccount(newAccount).then(() => {
          setNewAccount(defaultNewAccountState);
          typeof onSaveSuccess === "function" && onSaveSuccess();
        })}
      >
        Save
      </Button>
    </InputsRow>
  );
}

export default AccountForm;
