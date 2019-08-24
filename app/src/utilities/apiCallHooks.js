import { useState, useEffect, useCallback, useMemo } from "react";

import { getAccounts as getAccountsCall } from "../apiCalls/accounts";
import { getAccountTotals as getAccountTotalsCall } from "../apiCalls/accountTotals";
import { getBudgets as getBudgetsCall } from "../apiCalls/budgets";
import { getTransactions as getTransactionsCall } from "../apiCalls/transactions";

// Accounts
function useAccounts() {
  const [accounts, setAccounts] = useState(null);

  const getAccounts = useCallback(async () => {
    setAccounts(await getAccountsCall());
  }, []);

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  return [accounts, getAccounts];
}

function useAccountsMap() {
  const [accounts, getAccounts] = useAccounts();

  const accountsMap = useMemo(() => {
    if (!accounts) return null;

    const _accountsMap = {};

    accounts.forEach((account) => {
      _accountsMap[account.id] = account;
    });

    return _accountsMap;
  }, [accounts]);

  return [accountsMap, getAccounts];
}

// Account Totals
function useAccountTotals() {
  const [accountTotals, setAccountTotals] = useState(null);

  const getAccountTotals = useCallback(async () => {
    setAccountTotals(await getAccountTotalsCall());
  }, []);

  useEffect(() => {
    getAccountTotals();
  }, [getAccountTotals]);

  return [accountTotals, getAccountTotals];
}

// Budgets
function useBudgets() {
  const [budgets, setBudgets] = useState(null);

  const getBudgets = useCallback(async () => {
    setBudgets(await getBudgetsCall());
  }, []);

  useEffect(() => {
    getBudgets();
  }, [getBudgets]);

  return [budgets, getBudgets];
}

function useBudgetsMap() {
  const [budgets, getBudgets] = useBudgets();

  const budgetsMap = useMemo(() => {
    if (!budgets) return null;

    const _budgetsMap = {};

    budgets.forEach((budget) => {
      _budgetsMap[budget.id] = budget;
    });

    return _budgetsMap;
  }, [budgets]);

  return [budgetsMap, getBudgets];
}

// Transactions
function usePaginatedTransactions({ orderBy = "date", orderDir = "desc", limit = 10 } = {}) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadInitialTransactions() {
      setIsLoading(true);
      const initialTransactions = await getTransactionsCall({
        orderBy,
        orderDir,
        limit,
        offset: 0
      });

      setTransactions(initialTransactions);
      setIsLoading(false);
    }
    loadInitialTransactions();
  }, [orderBy, orderDir, limit]);

  const loadMoreTransactions = useCallback(async () => {
    setIsLoading(true);
    const newTransactions = await getTransactionsCall({
      orderBy,
      orderDir,
      limit,
      offset: transactions.length
    });

    setTransactions([...transactions, ...newTransactions]);
    setIsLoading(false);
  }, [transactions, orderBy, orderDir, limit]);

  return [transactions, loadMoreTransactions, isLoading];
}


export {
  useAccounts,
  useAccountsMap,
  useAccountTotals,
  useBudgets,
  useBudgetsMap,
  usePaginatedTransactions
};