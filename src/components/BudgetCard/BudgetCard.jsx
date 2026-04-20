import { useBudget } from '../../hooks/useBudget';
import { formatCurrency } from '../../utils/formatters';
import './BudgetCard.css';

export default function BudgetCard() {
    const { 
        monthlyBudget, 
        remainingBudget, 
        percentageUsed, 
        isOverBudget, 
        totalExpense 
    } = useBudget();

    return (
        <div className={`budget-card ${isOverBudget ? 'budget-card--over' : ''}`}>
            <div className="budget-card__head">
                <span className="budget-card__label">Monthly Budget</span>
                <span className={`budget-card__status ${isOverBudget ? 'status--over' : ''}`}>
                    {isOverBudget ? 'Over Budget' : 'On Track'}
                </span>
            </div>

            <div className="budget-card__main">
                <div className="budget-card__amount">
                    <strong>{formatCurrency(totalExpense)}</strong>
                    <span> / {formatCurrency(monthlyBudget)}</span>
                </div>
                
                <div className="budget-card__progress">
                    <div 
                        className="progress-bar" 
                        style={{ width: `${percentageUsed}%` }}
                    ></div>
                </div>
            </div>

            <div className="budget-card__footer">
                <div className="footer-item">
                    <label>Remaining</label>
                    <strong className={isOverBudget ? 'text-danger' : 'text-success'}>
                        {formatCurrency(remainingBudget)}
                    </strong>
                </div>
                <div className="footer-item">
                    <label>Usage</label>
                    <strong>{percentageUsed}%</strong>
                </div>
            </div>
        </div>
    );
}
