import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import { useAccountsMap, useBudgets } from "../utilities/apiCallHooks";

function Home(props) {
  const [accountsMap] = useAccountsMap();
  const [budgets] = useBudgets();

  return (
    <div>
      Budgets
      {budgets ?
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell>{budget.id}</TableCell>
                <TableCell>{budget.name}</TableCell>
                <TableCell>{accountsMap[budget.accountID].name}</TableCell>
                <TableCell>{budget.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        : null}
    </div>
  );
}

export default Home;
