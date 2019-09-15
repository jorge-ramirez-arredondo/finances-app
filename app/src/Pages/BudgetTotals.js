import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import { useBudgetTotals, useAccountsMap } from "../utilities/apiCallHooks";
import { amountFormatter } from "../utilities/displayFormatters";

function BudgetTotals(props) {
  const { activeDB } = props;

  const [budgetTotals] = useBudgetTotals(activeDB);
  const [accountsMap] = useAccountsMap(activeDB);

  return (
    <div>
      Totals by Budget
      {budgetTotals && accountsMap ?
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetTotals.map((budgetTotal) => (
              <TableRow key={budgetTotal.id}>
                <TableCell>{budgetTotal.id}</TableCell>
                <TableCell>{budgetTotal.name}</TableCell>
                <TableCell>{accountsMap[budgetTotal.accountID].name}</TableCell>
                <TableCell>{budgetTotal.description}</TableCell>
                <TableCell align="right">{amountFormatter(budgetTotal.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        : null}
    </div>
  );
}

export default BudgetTotals;
