import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button
} from "@material-ui/core";

function DBs(props) {
  const { activeDB, setActiveDB, dbs } = props;

  return (
    <div>
      Databases
      {dbs ?
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dbs.map((db) => (
              <TableRow key={db}>
                <TableCell>{db}</TableCell>
                <TableCell>
                  {db === activeDB ? "True" :
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setActiveDB(db)}
                    >
                      Set Active
                    </Button>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      : "Loading..."}
    </div>
  );
}

export default DBs;
