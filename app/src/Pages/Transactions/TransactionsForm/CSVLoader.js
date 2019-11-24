import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@material-ui/core";
import styled from "styled-components/macro";
import moment from "moment";

const ActionButtonRow = styled.div`
  text-align: right;
  margin: 20px;
`;

function parseTDCSVTransactions(text) {
	const lines = text.split("\n");
	const transactions = lines.map((line, index) => {
		const [tdDate, tdDescription, tdWithdrawal, tdDeposit] = line.split(",");

		const withdrawal = tdWithdrawal ? Number(tdWithdrawal) : 0;
		const deposit = tdDeposit ? Number(tdDeposit) : 0;

		return {
			key: index,
			budgetID: "",
			date: moment(tdDate, "MM/DD/YYYY").format("YYYY-MM-DD"),
			amount: (deposit - withdrawal).toString(),
			description: tdDescription
		};
	});

	return transactions;
}

function parseCIBCCSVTransactions(text) {
	const lines = text.split("\n");
	const transactions = lines.map((line, index) => {
		const [cibcDate, cibcDescription, cibcWithdrawal, cibcDeposit] = line.split(",");

		const withdrawal = cibcWithdrawal ? Number(cibcWithdrawal) : 0;
		const deposit = cibcDeposit ? Number(cibcDeposit) : 0;

		return {
			key: index,
			budgetID: "",
			date: cibcDate,
			amount: (deposit - withdrawal).toString(),
			description: cibcDescription
		};
	});

	return transactions;
}

const bankParsersMap = {
	td: parseTDCSVTransactions,
	cibc: parseCIBCCSVTransactions
};

function CSVLoader({ open, onClose, onCSVLoad }) {
	const [csvText, setCSVText] = useState("");
	const [bank, setBank] = useState("td");

	return (
		<Dialog
		  open={open}
		  onClose={onClose}
		  fullWidth
		  maxWidth="md"
		>
		  <DialogTitle>
		    CSV Loader
		  </DialogTitle>
		  <DialogContent>
		  	<TextField
		  		label="CSV"
		  		fullWidth
		  		multiline
		  		value={csvText}
		  		onChange={(event) => setCSVText(event.target.value)}
		  	/>
		  	<ActionButtonRow>
		  		<RadioGroup
		  			name="bank"
		  			row
		  			value={bank}
		  			onChange={(event) => setBank(event.target.value)}
		  		>
		  			<FormControlLabel
		  				value="td"
		  				control={<Radio color="primary" />}
		  				label="TD"
		  				labelPlacement="end"
		  			/>
		  			<FormControlLabel
		  				value="cibc"
		  				control={<Radio color="primary" />}
		  				label="CIBC"
		  				labelPlacement="end"
		  			/>
		  		</RadioGroup>
		  		<Button
		  		  variant="contained"
		  		  color="primary"
		  		  onClick={() => {
		  		  	if (onCSVLoad) {
		  		  		onCSVLoad(bankParsersMap[bank](csvText));
		  		  		setCSVText("");
		  		  	}
		  		  }}
		  		>
		  		  Load CSV
		  		</Button>
		  	</ActionButtonRow>
		  </DialogContent>
		</Dialog>
	);
}

export default CSVLoader;
