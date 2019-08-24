function amountFormatter(amount) {
  return `$${(amount / 100).toFixed(2)}`;
}

export {
  amountFormatter
};
