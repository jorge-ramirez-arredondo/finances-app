import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { useDBsManagementContext } from "../components/providers";
import DBs from "../Pages/DBs";
import Accounts from "../Pages/Accounts";
import Budgets from "../Pages/Budgets";
import BudgetTotals from "../Pages/BudgetTotals";
import Transactions from "../Pages/Transactions";

function AppRouter(props) {
  const [activeDB, setActiveDB, dbs, getDBs] = useDBsManagementContext();

  return (
    <Switch>
      <Route
        path="/dbs"
        render={(renderProps) => (
          <DBs
            {...renderProps}
            activeDB={activeDB}
            setActiveDB={setActiveDB}
            dbs={dbs}
            getDBs={getDBs}
          />
        )}
      />
      {activeDB ? null : <Redirect to="/dbs" />}
      <Route
        path="/accounts"
        render={(renderProps) => (
          <Accounts
            {...renderProps}
            activeDB={activeDB}
          />
        )}
      />
      <Route
        path="/budgets"
        render={(renderProps) => (
          <Budgets
            {...renderProps}
            activeDB={activeDB}
          />
        )}
      />
      <Route
        path="/budgetTotals"
        render={(renderProps) => (
          <BudgetTotals
            {...renderProps}
            activeDB={activeDB}
          />
        )}
      />
      <Route
        path="/transactions"
        render={(renderProps) => (
          <Transactions
            {...renderProps}
            activeDB={activeDB}
          />
        )}
      />
      <Redirect exact from="/" to="/dbs" />
      <Redirect to="/" />
    </Switch>
  );
}

export default AppRouter;
