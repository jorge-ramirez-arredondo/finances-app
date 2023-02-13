function formatNumberCommas(num) {
  const numStr = num.toString();
  
  let absoluteNumStr = numStr;
  let isNegative = false;
  if (numStr[0] === '-') {
    absoluteNumStr = numStr.substring(1);
    isNegative = true;
  }

  const wholeFractionalSplit = absoluteNumStr.split('.');
  const wholeNumStr = wholeFractionalSplit[0];

  let formattedWholeNumStr = '';
  for (let setEndPos = wholeNumStr.length; setEndPos > 0; setEndPos -= 3) {
    const setStartPos = Math.max(0, setEndPos - 3);

    const nextSet = wholeNumStr.substring(setStartPos, setEndPos);
    
    if (setEndPos === wholeNumStr.length) {
      formattedWholeNumStr = nextSet;
    } else {
      formattedWholeNumStr = `${nextSet},${formattedWholeNumStr}`;
    }
  }

  wholeFractionalSplit[0] = formattedWholeNumStr;

  return `${isNegative ? '-' : ''}${wholeFractionalSplit.join('.')}`;
}

function amountFormatter(amount, show0Cents = true) {
  if (!show0Cents && amount % 100 === 0) {
    return `$${formatNumberCommas(amount / 100)}`;
  }

  return `$${formatNumberCommas((amount / 100).toFixed(2))}`;
}

export {
  amountFormatter
};
