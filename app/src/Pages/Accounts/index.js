import React, { useState } from "react";

import AccountForm from "./AccountForm";
import AccountsTable from "./AccountsTable";

function Accounts({ activeDB }) {
  const [tableKey, setTableKey] = useState(0);

  return (
    <div>
      <AccountForm activeDB={activeDB} onSaveSuccess={() => setTableKey(tableKey + 1)} />
      <AccountsTable key={tableKey} activeDB={activeDB} />
    </div>
  );
}

export default Accounts;
