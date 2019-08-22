import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import AccountTotals from "../Pages/AccountTotals";
import Transactions from "../Pages/Transactions";

function AppRouter(props) {
	return (
		<Switch>
			<Route exact path="/accountTotals" component={AccountTotals} />
			<Route exact path="/transactions" component={Transactions} />
			<Redirect exact from="/" to="/accountTotals" />
			<Redirect to="/" />
		</Switch>
	);
}

export default AppRouter;
