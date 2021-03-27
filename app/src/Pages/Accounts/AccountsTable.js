import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import useMoneyColorClassGetter from "../../utilities/useMoneyColorClassGetter";
import { useAccountTotals } from "../../utilities/apiCallHooks";
import { amountFormatter } from "../../utilities/displayFormatters";
import { Section } from "../../components/layout";

function AccountsTable({ activeDB }) {
  const [accountTotals] = useAccountTotals(activeDB);

  const moneyColorClassGetter = useMoneyColorClassGetter();

  return (
    <Section>
      Accounts
      {accountTotals ?
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountTotals.map((accountTotal) => (
              <TableRow key={accountTotal.id}>
                <TableCell>{accountTotal.name}</TableCell>
                <TableCell>{accountTotal.description}</TableCell>
                <TableCell
                  align="right"
                  classes={{
                    root: moneyColorClassGetter(accountTotal.total)
                  }}
                >
                  {amountFormatter(accountTotal.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        : null}
    </Section>
  );
}

export default AccountsTable;
