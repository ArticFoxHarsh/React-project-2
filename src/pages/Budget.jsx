import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Topbar from '../components/Topbar';
import { useBudget } from '../hooks/useBudget';
import { budgetSchema } from '../utils/validation';
import BudgetCard from '../components/BudgetCard/BudgetCard';
import './Budget.css';

export default function Budget() {
    const { monthlyBudget, setMonthlyBudget } = useBudget();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: yupResolver(budgetSchema),
        defaultValues: { monthlyBudget }
    });

    function onSubmit(data) {
        setMonthlyBudget(data.monthlyBudget);
        reset({ monthlyBudget: data.monthlyBudget });
    }

    return (
        <div className="budget-page">
            <Topbar />

            <main className="budget-main">
                <div className="budget-header">
                    <h1 className="budget-heading">Budget Tracker</h1>
                    <p className="budget-sub">Manage your monthly spending goals</p>
                </div>

                <div className="budget-grid">
                    {/* Set Budget Form */}
                    <div className="budget-form-card">
                        <h2>⚙️ Update Monthly Budget</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="budget-form">
                            <div className="f-group">
                                <label htmlFor="monthlyBudget">Standard Monthly Budget (₹)</label>
                                <input 
                                    id="monthlyBudget"
                                    type="number"
                                    className={errors.monthlyBudget ? 'f-input f-input--err' : 'f-input'}
                                    placeholder="Enter amount (e.g. 50000)"
                                    {...register('monthlyBudget')}
                                />
                                {errors.monthlyBudget && <span className="f-err">{errors.monthlyBudget.message}</span>}
                            </div>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Save Settings'}
                            </button>
                        </form>
                    </div>

                    {/* Budget Overview Card */}
                    <BudgetCard />
                </div>
            </main>
        </div>
    );
}
