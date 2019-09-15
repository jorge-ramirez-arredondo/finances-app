import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  global: {
    body: {
      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif"
    }
  },
  overrides: {
    MuiTableCell: {
      head: {
        fontWeight: "bold"
      }
    }
  }
});

export default theme;
