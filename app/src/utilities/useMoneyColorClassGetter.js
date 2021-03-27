import { makeStyles } from "@material-ui/core/styles";

import { colors } from "../theme";

const useStyles = makeStyles({
	positive: {
		color: colors.money.positive
	},
	negative: {
		color: colors.money.negative
	},
	zero: {
		color: colors.money.zero
	}
});

function useMoneyColorClassGetter() {
	const classes = useStyles();

	return (money = 0) => {
		if (money > 0) return classes.positive;
		if (money < 0) return classes.negative;
		if (money === 0) return classes.zero;
		return null;
	};
}

export default useMoneyColorClassGetter;
