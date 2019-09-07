import React from "react";
import { ThemeProvider } from "@material-ui/styles";

import { DBsManagementProvider } from "../components/providers";
import theme from "../theme";

function AppProviders(props) {
  return (
    <ThemeProvider theme={theme}>
      <DBsManagementProvider>
        {props.children}
      </DBsManagementProvider>
    </ThemeProvider>
  );
}

export default AppProviders;
