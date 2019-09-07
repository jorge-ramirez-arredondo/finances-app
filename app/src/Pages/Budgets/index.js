import React, { useState } from "react";

import BudgetForm from "./BudgetForm";
import BudgetsTable from "./BudgetsTable";

function Budgets({ activeDB }) {
  const [tableKey, setTableKey] = useState(0);

  return (
    <div>
      <BudgetForm activeDB={activeDB} onSaveSuccess={() => setTableKey(tableKey + 1)} />
      <BudgetsTable key={tableKey} activeDB={activeDB} />
    </div>
  );
}

export default Budgets;
