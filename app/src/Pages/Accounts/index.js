import React, { useState } from "react";

import AccountForm from "./AccountForm";
import AccountsTable from "./AccountsTable";

function Accounts() {
  const [tableKey, setTableKey] = useState(0);

  return (
    <div>
      <AccountForm onSaveSuccess={() => setTableKey(tableKey + 1)} />
      <AccountsTable key={tableKey} />
    </div>
  );
}

export default Accounts;
