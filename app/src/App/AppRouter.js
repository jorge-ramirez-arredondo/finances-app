import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Accounts from "../Pages/Accounts";
import Budgets from "../Pages/Budgets";
import AccountTotals from "../Pages/AccountTotals";
import Transactions from "../Pages/Transactions";

function AppRouter(props) {
	return (
		<Switch>
      <Route exact path="/accounts" component={Accounts} />
      <Route exact path="/accountTotals" component={AccountTotals} />
			<Route exact path="/budgets" component={Budgets} />
			<Route exact path="/transactions" component={Transactions} />
			<Redirect exact from="/" to="/accounts" />
			<Redirect to="/" />
		</Switch>
	);
}

export default AppRouter;
