import React from "react";
import { ThemeProvider } from "@material-ui/styles";

import theme from "../theme";

function AppProviders(props) {
  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  );
}

export default AppProviders;
