import React from "react";
import { ThemeProvider, makeStyles } from "@material-ui/styles";

import { DBsManagementProvider } from "../components/providers";
import theme from "../theme";

const useStyles = makeStyles({
  "@global": theme.global
});

function AppProviders(props) {
  useStyles();

  return (
    <ThemeProvider theme={theme}>
      <DBsManagementProvider>
        {props.children}
      </DBsManagementProvider>
    </ThemeProvider>
  );
}

export default AppProviders;
