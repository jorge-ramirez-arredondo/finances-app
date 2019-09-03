import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

import { useAccounts } from "../../utilities/apiCallHooks";
import { Section } from "../../components/layout";

function AccountsTable(props) {
  const [accounts] = useAccounts();

  return (
    <Section>
      Accounts
      {accounts ?
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        : null}
    </Section>
  );
}

export default AccountsTable;
