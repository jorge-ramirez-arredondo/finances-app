import React from "react";
import styled from "styled-components/macro";
import {
  AppBar,
  Tabs,
  Tab
} from '@material-ui/core';
import { withRouter } from "react-router";

import { useDBsManagementContext } from "../components/providers";

const LeftRightSplit = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function NavBar({ location, history }) {
  const [activeDB] = useDBsManagementContext();

  function navigate(event, newValue) {
    history.push(newValue);
  }

  return (
    <React.Fragment>
      <div css="margin-top: 60px;" />
      <AppBar>
        <LeftRightSplit>
          <Tabs value={location.pathname} onChange={navigate}>
            <Tab value="/dbs" label="Databases" />
            <Tab value="/accounts" label="Accounts" disabled={!activeDB}/>
            <Tab value="/budgets" label="Budgets" disabled={!activeDB}/>
            <Tab value="/transactions" label="Transactions" disabled={!activeDB}/>
          </Tabs>
          <div css="margin-right: 20px;">{activeDB}</div>
        </LeftRightSplit>
      </AppBar>
    </React.Fragment>
  );
}

export default withRouter(NavBar);
