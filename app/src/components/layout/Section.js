import React from "react";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    padding: 20,
    margin: 20
  },
}));

function Section({ className, ...rest }) {
  const classes = useStyles();

  return (
    <Paper
      className={`${classes.root} ${className}`}
      {...rest}
    />
  );
}

export default Section;
