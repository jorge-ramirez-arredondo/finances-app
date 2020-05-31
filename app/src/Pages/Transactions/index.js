import React, { useState } from "react";

import TransactionsForm from "./TransactionsForm";
import TransactionsTable from "./TransactionsTable";

function Transactions({ activeDB }) {
  const [tableKey, setTableKey] = useState(0);

  function refreshTable() {
    setTableKey(tableKey + 1);
  }

  return (
    <div>
      <TransactionsForm
        activeDB={activeDB}
        onSaveSuccess={refreshTable}
        onQuickTransferSuccess={refreshTable}
      />
      <TransactionsTable key={tableKey} activeDB={activeDB} />
    </div>
  );
}

export default Transactions;
