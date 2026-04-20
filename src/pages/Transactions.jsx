import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Topbar from '../components/Topbar';
import { useTransactions } from '../hooks/useTransactions';
import { transactionSchema } from '../utils/validation';
import { formatCurrency, formatDate } from '../utils/formatters';
import './Transactions.css';

const CATEGORIES = [
  'Food & Dining', 'Transport', 'Shopping', 'Entertainment',
  'Health & Fitness', 'Housing & Utilities', 'Education',
  'Travel', 'Salary', 'Freelance', 'Investment', 'Subscriptions', 'Other',
];

const TODAY = new Date().toISOString().split('T')[0];

export default function Transactions() {
  const { 
    transactions, 
    loading,
    filters,
    sorting,
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();

  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      title: '', amount: '', category: '', type: 'expense', date: TODAY, notes: '', isRecurring: false,
    },
  });

  function onSubmit(data) {
    if (editId) {
      updateTransaction(editId, data);
      setEditId(null);
    } else {
      addTransaction(data);
    }
    reset({ title: '', amount: '', category: '', type: 'expense', date: TODAY, notes: '', isRecurring: false });
  }

  function startEdit(t) {
    setEditId(t.id);
    setValue('title',       t.title);
    setValue('amount',      t.amount);
    setValue('category',    t.category);
    setValue('type',        t.type);
    setValue('date',        t.date);
    setValue('notes',       t.notes || '');
    setValue('isRecurring', !!t.isRecurring);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditId(null);
    reset({ title: '', amount: '', category: '', type: 'expense', date: TODAY, notes: '', isRecurring: false });
  }

  return (
    <div className="txn-page">
      <Topbar />

      <main className="txn-main">
        <div className="txn-header">
           <h1 className="txn-heading">Transactions</h1>
           {loading && <div className="txn-loader-mini">Updating...</div>}
        </div>

        {loading ? (
             <div className="txn-loading-state">
                <div className="spinner"></div>
                <p>Loading your transactions...</p>
             </div>
        ) : (
          <>
            {/* ── Add / Edit form ────────────────────────────────────── */}
            <section className="txn-form-card">
              <h2>{editId ? '✏️ Edit Transaction' : '+ Quick Add'}</h2>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="txn-form">
                <div className="txn-form-grid">
                    <div className="f-group">
                      <label>Title</label>
                      <input className={errors.title ? 'f-input f-input--err' : 'f-input'} {...register('title')} />
                      {errors.title && <span className="f-err">{errors.title.message}</span>}
                    </div>

                    <div className="f-group">
                      <label>Amount (₹)</label>
                      <input type="number" step="0.01" className={errors.amount ? 'f-input f-input--err' : 'f-input'} {...register('amount')} />
                      {errors.amount && <span className="f-err">{errors.amount.message}</span>}
                    </div>

                    <div className="f-group">
                      <label>Category</label>
                      <select className={errors.category ? 'f-input f-input--err' : 'f-input'} {...register('category')}>
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.category && <span className="f-err">{errors.category.message}</span>}
                    </div>

                    <div className="f-group">
                      <label>Type</label>
                      <select className="f-input" {...register('type')}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>

                    <div className="f-group">
                      <label>Date</label>
                      <input type="date" className="f-input" {...register('date')} />
                    </div>

                    <div className="f-group">
                        <label>Notes</label>
                        <input className="f-input" placeholder="Optional notes" {...register('notes')} />
                        {errors.notes && <span className="f-err">{errors.notes.message}</span>}
                    </div>

                    <div className="f-group f-group--check">
                        <label className="f-check">
                            <input type="checkbox" {...register('isRecurring')} />
                            <span>Recurring transaction</span>
                        </label>
                    </div>
                </div>

                <div className="f-actions">
                  <button type="submit" className="btn-primary">
                    {editId ? 'Save Changes' : 'Add'}
                  </button>
                  {editId && (
                    <button type="button" className="btn-ghost" onClick={cancelEdit}>Cancel</button>
                  )}
                </div>
              </form>
            </section>

            {/* ── Filters & Sorting ───────────────────────────────────── */}
            <section className="txn-controls-card">
                <div className="ctrl-grid">
                    <div className="ctrl-item">
                        <label>Filter By Category</label>
                        <select value={filters.category} onChange={e => filters.setCategory(e.target.value)} className="f-input f-input--sm">
                            <option value="All">All Categories</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="ctrl-item">
                        <label>Filter By Type</label>
                        <select value={filters.type} onChange={e => filters.setType(e.target.value)} className="f-input f-input--sm">
                            <option value="All">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div className="ctrl-item">
                        <label>Date Range (Start)</label>
                        <input type="date" className="f-input f-input--sm" value={filters.dateRange.start} onChange={e => filters.setDateRange(prev => ({ ...prev, start: e.target.value }))} />
                    </div>
                    <div className="ctrl-item">
                        <label>Date Range (End)</label>
                        <input type="date" className="f-input f-input--sm" value={filters.dateRange.end} onChange={e => filters.setDateRange(prev => ({ ...prev, end: e.target.value }))} />
                    </div>
                    <div className="ctrl-item">
                        <label>Sort By</label>
                        <div className="sort-group">
                            <select value={sorting.sortBy} onChange={e => sorting.setSortBy(e.target.value)} className="f-input f-input--sm">
                                <option value="date">Date</option>
                                <option value="amount">Amount</option>
                                <option value="category">Category</option>
                            </select>
                            <button className="btn-toggle" onClick={() => sorting.setSortOrder(sorting.sortOrder === 'asc' ? 'desc' : 'asc')}>{sorting.sortOrder === 'asc' ? '↑' : '↓'}</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── List ────────────────────────────────────────────────── */}
            <section className="txn-list-card">
              <div className="txn-list-head">
                 <h2>All Transactions&ensp;<span className="txn-count">{transactions.length}</span></h2>
                 { (filters.category !== 'All' || filters.type !== 'All' || filters.dateRange.start || filters.dateRange.end) && (
                     <button className="btn-reset" onClick={() => {
                         filters.setCategory('All');
                         filters.setType('All');
                         filters.setDateRange({ start: '', end: '' });
                     }}>Reset Filters</button>
                 )}
              </div>

              {transactions.length === 0 ? (
                <div className="txn-empty-state"><div className="empty-icon">📭</div><p>No transactions found matching your criteria.</p></div>
              ) : (
                <div className="txn-table-wrap">
                  <table className="txn-table">
                    <thead>
                      <tr><th>Title</th><th>Category</th><th>Notes</th><th>Date</th><th style={{ textAlign: 'right' }}>Amount</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                    </thead>
                    <tbody>
                      {transactions.map(t => (
                        <tr key={t.id} className={`txn-row ${editId === t.id ? 'txn-row--editing' : ''} ${t.isRecurring ? 'txn-row--recurring' : ''}`}>
                          <td className="txn-title">
                            <span className="txn-dot" style={{ background: t.type === 'income' ? 'var(--c-income)' : 'var(--c-expense)' }} />
                            <div className="title-wrap">{t.title} {t.isRecurring && <span className="badge-recurring">Recurring</span>}</div>
                          </td>
                          <td><span className="txn-cat">{t.category}</span></td>
                          <td><span className="txn-notes">{t.notes || '-'}</span></td>
                          <td className="txn-date">{formatDate(t.date)}</td>
                          <td className="txn-amount" style={{ color: t.type === 'income' ? 'var(--c-income)' : 'var(--c-expense)' }}>
                            {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                          </td>
                          <td className="txn-actions">
                            <button className="btn-edit" onClick={() => startEdit(t)}>Edit</button>
                            <button className="btn-delete" onClick={() => deleteTransaction(t.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
