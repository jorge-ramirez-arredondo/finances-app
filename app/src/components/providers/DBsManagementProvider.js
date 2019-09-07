import React, { useState, useContext } from "react";

import { useDBs } from "../../utilities/apiCallHooks";

const DBsManagementContext = React.createContext(null);

function DBsManagementProvider(props) {
  const [activeDB, setActiveDB] = useState(null);
  const [dbs, getDBs] = useDBs();

  return (
    <DBsManagementContext.Provider value={[activeDB, setActiveDB, dbs, getDBs]}>
      {props.children}
    </DBsManagementContext.Provider>
  );
}

function useDBsManagementContext() {
  return useContext(DBsManagementContext);
}

export default DBsManagementProvider;
export {
  useDBsManagementContext
};
