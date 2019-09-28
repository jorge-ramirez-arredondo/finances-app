import React, { useState } from "react";
import {
  Button
} from "@material-ui/core";
import "styled-components/macro";

import TransactionSetForm from "./TransactionSetForm";
import TransactionSetsList from "./TransactionSetsList";

function Transactions({ activeDB }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editableTransactionSet, setEditableTransactionSet] = useState(null);
  const [tableKey, setTableKey] = useState(0);

  return (
    <div>
      <div css="text-align: right;">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setFormOpen(true);
            setEditableTransactionSet(null);
          }}
        >
          Add New Transaction Set
        </Button>
        <TransactionSetForm
          activeDB={activeDB}
          onSaveSuccess={() => setTableKey(tableKey + 1)}
          open={formOpen}
          editableTransactionSet={editableTransactionSet}
          onClose={() => {
            setFormOpen(false);
            setEditableTransactionSet(null);
          }}
        />
      </div>
      <TransactionSetsList
        key={tableKey}
        activeDB={activeDB}
        onEditTransactionSet={(transactionSet) => {
          setEditableTransactionSet(transactionSet);
          setFormOpen(true);
        }}
      />
    </div>
  );
}

export default Transactions;
