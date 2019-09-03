import React, { useState } from "react";

import BudgetForm from "./BudgetForm";
import BudgetsTable from "./BudgetsTable";

function Budgets() {
  const [tableKey, setTableKey] = useState(0);

  return (
    <div>
      <BudgetForm onSaveSuccess={() => setTableKey(tableKey + 1)} />
      <BudgetsTable key={tableKey} />
    </div>
  );
}

export default Budgets;
