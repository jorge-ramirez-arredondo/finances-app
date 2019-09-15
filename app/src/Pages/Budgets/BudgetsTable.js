import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import { useAccountsMap, useBudgetTotals } from "../../utilities/apiCallHooks";
import { amountFormatter } from "../../utilities/displayFormatters";
import { Section } from "../../components/layout";

function BudgetsTable({ activeDB }) {
  const [accountsMap] = useAccountsMap(activeDB);
  const [budgetTotals] = useBudgetTotals(activeDB);

  return (
    <Section>
      Budgets
      {budgetTotals && accountsMap ?
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetTotals.map((budgetTotal) => (
              <TableRow key={budgetTotal.id}>
                <TableCell>{accountsMap[budgetTotal.accountID].name}</TableCell>
                <TableCell>{budgetTotal.name}</TableCell>
                <TableCell>{budgetTotal.description}</TableCell>
                <TableCell align="right">{amountFormatter(budgetTotal.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        : null}
    </Section>
  );
}

export default BudgetsTable;
