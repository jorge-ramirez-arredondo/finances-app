import React from "react";

import DBForm from "./DBForm";
import DBsTable from "./DBsTable";

function DBs({ activeDB, setActiveDB, dbs, getDBs }) {
  return (
    <div>
      <DBForm onSaveSuccess={() => getDBs()} />
      <DBsTable
        activeDB={activeDB}
        setActiveDB={setActiveDB}
        dbs={dbs}
      />
    </div>
  );
}

export default DBs;
