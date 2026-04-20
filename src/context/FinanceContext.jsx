import { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'pf_transactions';
const BUDGET_KEY  = 'pf_budget';
const USER_KEY    = 'pf_user';

const ACTIONS = {
  ADD:    'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadBudget() {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    return raw ? JSON.parse(raw) : 0;
  } catch { return 0; }
}

function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : { name: 'User', avatar: '' };
  } catch { return { name: 'User', avatar: '' }; }
}

function save(transactions) { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); }
function saveBudget(budget) { localStorage.setItem(BUDGET_KEY, JSON.stringify(budget)); }
function saveUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:    return [action.payload, ...state];
    case ACTIONS.UPDATE: return state.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t);
    case ACTIONS.DELETE: return state.filter(t => t.id !== action.payload);
    default:             return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context & Provider
// ─────────────────────────────────────────────────────────────────────────────

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [transactions, dispatch] = useReducer(reducer, [], load);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Budget & User State
  const [monthlyBudget, setMonthlyBudget] = useState(loadBudget);
  const [user, setUser] = useState(loadUser);

  // Filters & Sorting state
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Persistence effects
  useEffect(() => { setLoading(false); }, []);
  useEffect(() => { save(transactions); }, [transactions]);
  useEffect(() => { saveBudget(monthlyBudget); }, [monthlyBudget]);
  useEffect(() => { saveUser(user); }, [user]);

  // ── User Action Helpers ───────────────────────────────────────────────────

  function updateUserName(newName) {
    setUser(prev => ({ ...prev, name: newName.trim() || 'User' }));
    toast.success('Profile name updated!');
  }

  function updateUserAvatar(base64) {
    setUser(prev => ({ ...prev, avatar: base64 }));
    toast.success('Profile photo updated!');
  }

  // ── Transaction Action helpers ──────────────────────────────────────────────

  function addTransaction(data) {
    dispatch({
      type: ACTIONS.ADD,
      payload: {
        id:          uuidv4(),
        title:       data.title.trim(),
        amount:      Math.abs(Number(data.amount)),
        category:    data.category,
        type:        data.type,
        date:        data.date || new Date().toISOString().split('T')[0],
        notes:       data.notes || '',
        isRecurring: !!data.isRecurring,
      },
    });
    toast.success('Transaction added!');
  }

  function updateTransaction(id, data) {
    dispatch({
      type: ACTIONS.UPDATE,
      payload: { id, title: data.title.trim(), amount: Math.abs(Number(data.amount)), category: data.category, type: data.type, date: data.date, notes: data.notes || '', isRecurring: !!data.isRecurring },
    });
    toast.info('Transaction updated.');
  }

  function deleteTransaction(id) {
    dispatch({ type: ACTIONS.DELETE, payload: id });
    toast.warn('Transaction removed.');
  }

  // ── Processing logic (Search + Filter + Sort) ───────────────────────────────

  const processedTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(s) || t.category.toLowerCase().includes(s) || (t.notes && t.notes.toLowerCase().includes(s)));
    }
    if (categoryFilter !== 'All') filtered = filtered.filter(t => t.category === categoryFilter);
    if (typeFilter !== 'All')     filtered = filtered.filter(t => t.type === typeFilter);
    if (dateRange.start) filtered = filtered.filter(t => t.date >= dateRange.start);
    if (dateRange.end)   filtered = filtered.filter(t => t.date <= dateRange.end);

    filtered.sort((a, b) => {
      let aVal = a[sortBy]; let bVal = b[sortBy];
      if (sortBy === 'amount') return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      if (sortBy === 'category') { aVal = a.category.toLowerCase(); bVal = b.category.toLowerCase(); }
      if (aVal < bVal) return sortOrder === 'desc' ? 1 : -1;
      if (aVal > bVal) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });
    return filtered;
  }, [transactions, searchTerm, categoryFilter, typeFilter, dateRange, sortBy, sortOrder]);

  // ── Derived analytics ───────────────────────────────────────────────────────

  const analytics = useMemo(() => {
    const totalIncome = processedTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = processedTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const categoryMap = {};
    processedTransactions.filter(t => t.type === 'expense').forEach(t => { categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount; });
    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    const monthlyMap = {};
    processedTransactions.forEach(t => {
      const month = t.date?.slice(0, 7) ?? 'Unknown';
      if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expense: 0 };
      if (t.type === 'income')  monthlyMap[month].income  += t.amount;
      if (t.type === 'expense') monthlyMap[month].expense += t.amount;
    });
    const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
    return { totalIncome, totalExpense, balance, categoryData, monthlyData };
  }, [processedTransactions]);

  const value = {
    transactions: processedTransactions, allTransactions: transactions, loading,
    searchTerm, setSearchTerm,
    monthlyBudget, setMonthlyBudget,
    user, updateUserName, updateUserAvatar, // New Profile features
    filters: { category: categoryFilter, setCategory: setCategoryFilter, type: typeFilter, setType: setTypeFilter, dateRange, setDateRange },
    sorting: { sortBy, setSortBy, sortOrder, setSortOrder },
    addTransaction, updateTransaction, deleteTransaction,
    ...analytics,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used inside <FinanceProvider>');
  return ctx;
}
