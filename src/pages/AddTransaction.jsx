import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Topbar from '../components/Topbar';
import { useTransactions } from '../hooks/useTransactions';
import { transactionSchema } from '../utils/validation';
import './AddTransaction.css';

const CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health & Fitness', 'Housing & Utilities', 'Education',
  'Travel', 'Salary', 'Freelance', 'Investment', 'Subscriptions', 'Other',
];

const TODAY = new Date().toISOString().split('T')[0];

export default function AddTransaction() {
    const navigate = useNavigate();
    const { addTransaction } = useTransactions();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(transactionSchema),
        defaultValues: {
            title: '', amount: '', category: '', type: 'expense', date: TODAY, notes: '', isRecurring: false
        }
    });

    function onSubmit(data) {
        addTransaction(data);
        navigate('/transactions');
    }

    return (
        <div className="add-page">
            <Topbar />

            <main className="add-main">
                <div className="add-header">
                    <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
                    <h1>Add New Transaction</h1>
                </div>

                <div className="add-card">
                    <form onSubmit={handleSubmit(onSubmit)} className="add-form">
                        <section className="form-section">
                            <h3>Basic Details</h3>
                            <div className="form-row">
                                <div className="f-group">
                                    <label>Title</label>
                                    <input placeholder="e.g. Netflix Subscription" className={errors.title ? 'f-input f-input--err' : 'f-input'} {...register('title')} />
                                    {errors.title && <span className="f-err">{errors.title.message}</span>}
                                </div>
                                <div className="f-group">
                                    <label>Amount (₹)</label>
                                    <input type="number" step="0.01" className={errors.amount ? 'f-input f-input--err' : 'f-input'} {...register('amount')} />
                                    {errors.amount && <span className="f-err">{errors.amount.message}</span>}
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h3>Categorization</h3>
                            <div className="form-row">
                                <div className="f-group">
                                    <label>Category</label>
                                    <select className={errors.category ? 'f-input f-input--err' : 'f-input'} {...register('category')}>
                                        <option value="">Select Category</option>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {errors.category && <span className="f-err">{errors.category.message}</span>}
                                </div>
                                <div className="f-group">
                                    <label>Transaction Type</label>
                                    <select className="f-input" {...register('type')}>
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
                                </div>
                                <div className="f-group">
                                    <label>Date</label>
                                    <input type="date" className="f-input" {...register('date')} />
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h3>Extra Information</h3>
                            <div className="f-group">
                                <label>Notes</label>
                                <textarea placeholder="Add any details about this transaction..." className="f-input" rows="4" {...register('notes')} />
                                {errors.notes && <span className="f-err">{errors.notes.message}</span>}
                            </div>
                            <div className="f-group f-group--check">
                                <label className="f-check">
                                    <input type="checkbox" {...register('isRecurring')} />
                                    <span>Mark as recurring transaction</span>
                                </label>
                            </div>
                        </section>

                        <div className="add-actions">
                            <button type="button" className="btn-ghost" onClick={() => navigate('/transactions')}>Cancel</button>
                            <button type="submit" className="btn-primary">Save Transaction</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
