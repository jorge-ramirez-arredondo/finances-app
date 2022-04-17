import React, { useMemo } from "react";
import {
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip
} from "recharts";

import { Section } from "../../components/layout";
import { useBudgetMonthlyTotals } from "../../utilities/apiCallHooks";

const lineColors = [
	"#001219",
	"#005f73",
	"#0a9396",
	"#94d2bd",
	"#e9d8a6",
	"#ee9b00",
	"#ca6702",
	"#bb3e03",
	"#ae2012",
	"#9b2226"
];

function groupByBudget(monthlyTotals, allowedBudgets) {
	return monthlyTotals.reduce((acc, monthlyTotal) => {
		const { id } = monthlyTotal;

		if (allowedBudgets && !allowedBudgets[id]) return acc; 

		if (!acc[id]) {
			acc[id] = [];
		}

		acc[id].push(monthlyTotal);
		
		return acc;
	}, {});
}

function createGroups(monthlyTotals) {
	return monthlyTotals.reduce(({ budgets, yearMonths }, monthlyTotal) => {
		const { id, yearMonth } = monthlyTotal;

		if (!budgets[id]) {
			budgets[id] = true;
		}

		if (!yearMonths[yearMonth]) {
			yearMonths[yearMonth] = {
				yearMonth,
				budgets: {}
			};
		}

		yearMonths[yearMonth].budgets[id] = monthlyTotal;
		
		return { budgets, yearMonths };
	}, { budgets: {}, yearMonths: {} });
}

const filters = { 1: true, 2: true, 3: true, 4: true };

function Stats({ activeDB }) {
	const [budgetMonthlyTotals] = useBudgetMonthlyTotals(activeDB);
	const monthlyTotalsByBudget = useMemo(
		() => {
			if (budgetMonthlyTotals) {
				console.log(groupByBudget(budgetMonthlyTotals, filters));
				return groupByBudget(budgetMonthlyTotals, filters);
			}

			return null;
		},
		[budgetMonthlyTotals]
	);
	const { budgets, monthlyTotals } = useMemo(
		() => {
			if (!budgetMonthlyTotals) return { budgets: null, monthlyTotals: null };

			const { budgets, yearMonths} = createGroups(budgetMonthlyTotals);
			return {
				budgets: Object.keys(budgets).sort(),
				monthlyTotals: Object.keys(yearMonths)
					.map((yearMonth) => yearMonths[yearMonth])
					.sort((a, b) => {
						if (a.yearMonth < b.yearMonth) return -1;
						if (a.yearMonth > b.yearMonth) return 1;
						return 0;
					})
			};
		},
		[budgetMonthlyTotals]
	);
	
	return (
		<Section>
			Stats
			{monthlyTotals ?
				<ResponsiveContainer width="100%" height={400}>
					<LineChart data={monthlyTotals}>
						{budgets.map((id, index) => (
							<Line
								key={id}
								dataKey={({ budgets }) => budgets[id] ? budgets[id].total : 0}
								stroke={lineColors[index % lineColors.length]}
							/>
						))}
						<CartesianGrid stroke="#ccc" />
						<XAxis dataKey="yearMonth" />
						<YAxis />
						<Tooltip />
					</LineChart>
				</ResponsiveContainer>
			: null}
		</Section>
	);
}

export default Stats;
