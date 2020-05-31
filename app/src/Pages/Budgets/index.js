import React, { useState } from "react";

import BudgetForm from "./BudgetForm";
import BudgetsTable from "./BudgetsTable";

function Budgets({ activeDB }) {
  const [tableKey, setTableKey] = useState(0);

  function refreshTable() {
    setTableKey(tableKey + 1);
  }

  return (
    <div>
      <BudgetForm
        activeDB={activeDB}
        onSaveSuccess={refreshTable}
        onQuickTransferSuccess={refreshTable}
      />
      <BudgetsTable key={tableKey} activeDB={activeDB} />
    </div>
  );
}

export default Budgets;
