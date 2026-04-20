import { useFinance } from '../context/FinanceContext';

/**
 * Custom hook to managed transactions and analytics
 */
export const useTransactions = () => {
  const { 
    transactions, 
    allTransactions, 
    loading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    searchTerm,
    setSearchTerm,
    filters,
    sorting,
    totalIncome,   // New: Added analytics fields
    totalExpense,  // New: Added analytics fields
    balance,       // New: Added analytics fields
    categoryData,  // New: Added analytics fields
    monthlyData    // New: Added analytics fields
  } = useFinance();

  return {
    transactions,
    allTransactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    searchTerm,
    setSearchTerm,
    filters,
    sorting,
    totalIncome,   // New: Return analytics
    totalExpense,  // New: Return analytics
    balance,       // New: Return analytics
    categoryData,  // New: Return analytics
    monthlyData    // New: Return analytics
  };
};
