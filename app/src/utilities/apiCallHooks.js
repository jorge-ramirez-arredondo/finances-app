import { useState, useEffect, useCallback, useMemo } from "react";

import { getDBs as getDBsCall } from "../apiCalls/dbs";
import { getAccounts as getAccountsCall } from "../apiCalls/accounts";
import { getAccountTotals as getAccountTotalsCall } from "../apiCalls/accountTotals";
import { getBudgets as getBudgetsCall } from "../apiCalls/budgets";
import { getTransactions as getTransactionsCall } from "../apiCalls/transactions";

// DBs
function useDBs() {
  const [dbs, setDBs] = useState(null);

  const getDBs = useCallback(async () => {
    setDBs(await getDBsCall());
  }, []);

  useEffect(() => {
    getDBs();
  }, [getDBs]);

  return [dbs, getDBs];
}

// Accounts
function useAccounts(activeDB) {
  const [accounts, setAccounts] = useState(null);

  const getAccounts = useCallback(async () => {
    setAccounts(await getAccountsCall(activeDB));
  }, [activeDB]);

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  return [accounts, getAccounts];
}

function useAccountsMap(activeDB) {
  const [accounts, getAccounts] = useAccounts(activeDB);

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
function useAccountTotals(activeDB) {
  const [accountTotals, setAccountTotals] = useState(null);

  const getAccountTotals = useCallback(async () => {
    setAccountTotals(await getAccountTotalsCall(activeDB));
  }, [activeDB]);

  useEffect(() => {
    getAccountTotals();
  }, [getAccountTotals]);

  return [accountTotals, getAccountTotals];
}

// Budgets
function useBudgets(activeDB) {
  const [budgets, setBudgets] = useState(null);

  const getBudgets = useCallback(async () => {
    setBudgets(await getBudgetsCall(activeDB));
  }, [activeDB]);

  useEffect(() => {
    getBudgets();
  }, [getBudgets]);

  return [budgets, getBudgets];
}

function useBudgetsMap(activeDB) {
  const [budgets, getBudgets] = useBudgets(activeDB);

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
function usePaginatedTransactions(activeDB, { orderBy = "date", orderDir = "desc", limit = 10 } = {}) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadInitialTransactions() {
      setIsLoading(true);
      const initialTransactions = await getTransactionsCall(activeDB, {
        orderBy,
        orderDir,
        limit,
        offset: 0
      });

      setTransactions(initialTransactions);
      setIsLoading(false);
    }
    loadInitialTransactions();
  }, [activeDB, orderBy, orderDir, limit]);

  const loadMoreTransactions = useCallback(async () => {
    setIsLoading(true);
    const newTransactions = await getTransactionsCall(activeDB, {
      orderBy,
      orderDir,
      limit,
      offset: transactions.length
    });

    setTransactions([...transactions, ...newTransactions]);
    setIsLoading(false);
  }, [activeDB, transactions, orderBy, orderDir, limit]);

  return [transactions, loadMoreTransactions, isLoading];
}


export {
  useDBs,
  useAccounts,
  useAccountsMap,
  useAccountTotals,
  useBudgets,
  useBudgetsMap,
  usePaginatedTransactions
};