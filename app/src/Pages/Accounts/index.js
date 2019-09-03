import React, { useState } from "react";

import AccountsForm from "./AccountsForm";
import AccountsTable from "./AccountsTable";

function Accounts() {
  const [tableKey, setTableKey] = useState(0);

  return (
    <div>
      <AccountsForm onSaveSuccess={() => setTableKey(tableKey + 1)} />
      <AccountsTable key={tableKey} />
    </div>
  );
}

export default Accounts;
