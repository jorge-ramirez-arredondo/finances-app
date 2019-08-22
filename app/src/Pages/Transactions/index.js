import React, { useState } from "react";

import TransactionsForm from "./TransactionsForm";
import TransactionsTable from "./TransactionsTable";

function Transactions() {
	const [tableKey, setTableKey] = useState(0);

	return (
		<div>
			<TransactionsForm onSaveSuccess={() => setTableKey(tableKey + 1)} />
			<TransactionsTable key={tableKey} />
		</div>
	);
}

export default Transactions;
