import React from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function defaultRenderSuggestion(highlightedText, suggestion, getItemText) {
  return highlightedText;
}

const renderSuggestionWrapper = (renderSuggestion, getItemText) => (suggestion, { query, isHighlighted }) => {
  const matches = match(getItemText(suggestion), query);
  const parts = parse(getItemText(suggestion), matches);

  const highlightedText = (
    <React.Fragment>
      {parts.map(part => (
        <span key={part.text} style={{ fontWeight: part.highlight ? "bold" : "regular" }}>
          {part.text}
        </span>
      ))}
    </React.Fragment>
  );

  return (
    <MenuItem selected={isHighlighted} component="div">
      {renderSuggestion(highlightedText, suggestion, getItemText)}
    </MenuItem>
  );
};

function getDisplaySuggestions(suggestions, getItemText, value = "", maxSuggestions) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < maxSuggestions && getItemText(suggestion).slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function defaultGetItemText(item) {
  return item.label;
}

const useStyles = makeStyles(theme => ({
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing(2),
  },
}));

export default function AutoSuggest(props) {
  const {
    items,
    inputValue = "",
    renderSuggestion = defaultRenderSuggestion,
    getItemText = defaultGetItemText,
    maxSuggestions = 5,
    onChange,
    label = "",
    placeholder = "",
    inputRef
  } = props;

  const classes = useStyles();
  const [stateSuggestions, setSuggestions] = React.useState([]);

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getDisplaySuggestions(items, getItemText, value, maxSuggestions));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleOnSuggestionSelected = (event, { suggestion, suggestionValue }) => {
    typeof onChange === "function" && onChange(suggestionValue, suggestion);
  };

  const handleInputOnChange = (event, { newValue }) => {
    typeof onChange === "function" && onChange(newValue, null);
  };

  const handleInputOnBlur = (event, { highlightedSuggestion }) => {
    if (highlightedSuggestion && typeof onChange === "function") {
      onChange(getItemText(highlightedSuggestion), highlightedSuggestion);
    }
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    onSuggestionSelected: handleOnSuggestionSelected,
    getSuggestionValue: getItemText,
    renderSuggestion: renderSuggestionWrapper(renderSuggestion, getItemText)
  };

  return (
    <Autosuggest
      {...autosuggestProps}
      inputProps={{
        classes,
        id: 'react-autosuggest-simple',
        label,
        placeholder,
        value: inputValue,
        onChange: handleInputOnChange,
        onBlur: handleInputOnBlur
      }}
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion
      }}
      renderSuggestionsContainer={options => (
        <Paper {...options.containerProps} square>
          {options.children}
        </Paper>
      )}
      ref={inputRef}
    />
  );
}
