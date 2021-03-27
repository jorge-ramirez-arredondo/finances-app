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

const colors = {
  money: {
    positive: "#016535",
    negative: "#B40606",
    zero: "#4c4c4c"
  }
};

export default theme;
export {
  colors
};
