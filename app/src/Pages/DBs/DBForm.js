import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";

import { postDBs } from "../../apiCalls/dbs";
import { InputsRow } from "../../components/layout";


function DBForm(props) {
  const { onSaveSuccess } = props;

  const [newDBName, setNewDBName] = useState("");

  return (
    <InputsRow>
      <span>Create New DB:</span>
      <TextField
        label="Name"
        value={newDBName}
        onChange={(event) => setNewDBName(event.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => postDBs(newDBName).then(() => {
          setNewDBName("");
          typeof onSaveSuccess === "function" && onSaveSuccess();
        })}
      >
        Save
      </Button>
    </InputsRow>
  );
}

export default DBForm;
