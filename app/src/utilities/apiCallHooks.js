import { useState, useEffect, useCallback, useMemo } from "react";

import { getDBs as getDBsCall } from "../apiCalls/dbs";
import { getAccounts as getAccountsCall } from "../apiCalls/accounts";
import { getAccountTotals as getAccountTotalsCall } from "../apiCalls/accountTotals";
import { getBudgetTotals as getBudgetTotalsCall } from "../apiCalls/budgetTotals";
import { getBudgets as getBudgetsCall } from "../apiCalls/budgets";
import { getTransactions as getTransactionsCall } from "../apiCalls/transactions";
import { getTransactionSets as getTransactionSetsCall } from "../apiCalls/transactionSets";
import { getBudgetMonthlyTotals as getBudgetMonthlyTotalsCall } from "../apiCalls/stats";
import { getTransactionTotals as getTransactionTotalsCall } from "../apiCalls/stats";

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
function useBudgets(activeDB, { active } = {}) {
  const [budgets, setBudgets] = useState(null);

  const getBudgets = useCallback(async () => {
    setBudgets(await getBudgetsCall(activeDB, { active }));
  }, [activeDB, active]);

  useEffect(() => {
    getBudgets();
  }, [getBudgets]);

  return [budgets, getBudgets];
}

function useBudgetsMap(activeDB, params) {
  const [budgets, getBudgets] = useBudgets(activeDB, params);

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

// Budget Totals
function useBudgetTotals(activeDB) {
  const [budgetTotals, setBudgetTotals] = useState(null);

  const getBudgetTotals = useCallback(async () => {
    setBudgetTotals(await getBudgetTotalsCall(activeDB));
  }, [activeDB]);

  useEffect(() => {
    getBudgetTotals();
  }, [getBudgetTotals]);

  return [budgetTotals, getBudgetTotals];
}

// Transactions
function usePaginatedTransactions(
  activeDB,
  {
    budgetID,
    descriptionSearch,
    dateFrom,
    dateTo,
    amountFrom,
    amountTo,
    orderBy = "date",
    orderDir = "desc",
    limit = 10
  } = {}
) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadInitialTransactions() {
      setIsLoading(true);
      const initialTransactions = await getTransactionsCall(activeDB, {
        budgetID,
        descriptionSearch,
        dateFrom,
        dateTo,
        amountFrom,
        amountTo,
        orderBy,
        orderDir,
        limit,
        offset: 0
      });

      setTransactions(initialTransactions);
      setIsLoading(false);
    }
    loadInitialTransactions();
  }, [
    activeDB,
    budgetID,
    descriptionSearch,
    dateFrom,
    dateTo,
    amountFrom,
    amountTo,
    orderBy,
    orderDir,
    limit
  ]);

  const loadMoreTransactions = useCallback(async () => {
    setIsLoading(true);
    const newTransactions = await getTransactionsCall(activeDB, {
      budgetID,
      descriptionSearch,
      dateFrom,
      dateTo,
      amountFrom,
      amountTo,
      orderBy,
      orderDir,
      limit,
      offset: transactions.length
    });

    setTransactions([...transactions, ...newTransactions]);
    setIsLoading(false);
  }, [
    activeDB,
    transactions,
    budgetID,
    descriptionSearch,
    dateFrom,
    dateTo,
    amountFrom,
    amountTo,
    orderBy,
    orderDir,
    limit
  ]);

  return [transactions, loadMoreTransactions, isLoading];
}

// TransactionSets
function useTransactionSets(activeDB) {
  const [transactionSets, setTransactionSets] = useState(null);

  const getTransactionSets = useCallback(async () => {
    setTransactionSets(await getTransactionSetsCall(activeDB));
  }, [activeDB]);

  useEffect(() => {
    getTransactionSets();
  }, [getTransactionSets]);

  return [transactionSets, getTransactionSets];
}

// Stats
function useBudgetMonthlyTotals(activeDB) {
  const [budgetMonthlyTotals, setBudgetMonthlyTotals] = useState(null);

  const getBudgetMonthlyTotals = useCallback(async () => {
    setBudgetMonthlyTotals(await getBudgetMonthlyTotalsCall(activeDB));
  }, [activeDB]);

  useEffect(() => {
    getBudgetMonthlyTotals();
  }, [getBudgetMonthlyTotals]);

  return [budgetMonthlyTotals, getBudgetMonthlyTotals];
}

function useTransactionTotals(activeDB) {
  const [transactionTotals, setTransactionTotals] = useState(null);

  const getTransactionTotals = useCallback(async () => {
    setTransactionTotals(await getTransactionTotalsCall(activeDB));
  }, [activeDB]);

  useEffect(() => {
    getTransactionTotals();
  }, [getTransactionTotals]);

  return [transactionTotals, getTransactionTotals];
}

export {
  useDBs,
  useAccounts,
  useAccountsMap,
  useAccountTotals,
  useBudgets,
  useBudgetsMap,
  useBudgetTotals,
  usePaginatedTransactions,
  useTransactionSets,
  useBudgetMonthlyTotals,
  useTransactionTotals
};