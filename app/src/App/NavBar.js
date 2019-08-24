import React from "react";
import "styled-components/macro";
import {
	AppBar,
	Tabs,
	Tab
} from '@material-ui/core';
import { withRouter } from "react-router";

function NavBar({ location, history }) {
	function navigate(event, newValue) {
		history.push(newValue);
	}

	return (
		<React.Fragment>
			<div css="margin-top: 60px;" />
			<AppBar>
				<Tabs value={location.pathname} onChange={navigate}>
					<Tab value="/accounts" label="Accounts" />
					<Tab value="/accountTotals" label="Account Totals" />
					<Tab value="/budgets" label="Budgets" />
					<Tab value="/transactions" label="Transactions" />
				</Tabs>
			</AppBar>
		</React.Fragment>
	);
}

export default withRouter(NavBar);
