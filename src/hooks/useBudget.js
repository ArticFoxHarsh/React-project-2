import { useFinance } from '../context/FinanceContext';

/**
 * Custom hook for budget tracking and logic
 */
export const useBudget = () => {
    const { 
        monthlyBudget, 
        setMonthlyBudget, 
        totalExpense, 
        balance 
    } = useFinance();

    const remainingBudget = Math.max(0, monthlyBudget - totalExpense);
    const percentageUsed = monthlyBudget > 0 
        ? Math.min(100, Math.round((totalExpense / monthlyBudget) * 100)) 
        : 0;

    const isOverBudget = totalExpense > monthlyBudget && monthlyBudget > 0;

    return {
        monthlyBudget,
        setMonthlyBudget,
        remainingBudget,
        percentageUsed,
        isOverBudget,
        totalExpense,
        balance
    };
};
