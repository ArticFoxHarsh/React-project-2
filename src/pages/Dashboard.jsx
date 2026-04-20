import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import Topbar from '../components/Topbar';
import BudgetCard from '../components/BudgetCard/BudgetCard';
import { useFinance } from '../context/FinanceContext';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatDate, formatMonth } from '../utils/formatters';
import './Dashboard.css';

const COLORS = ['#4361ee', '#f04438', '#12b76a', '#f79009', '#9b8afb', '#06aed4', '#e879f9', '#64748b'];

function Empty({ text }) { return <p className="db-empty">{text}</p>; }

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tip">
      {label && <strong>{label}</strong>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>{p.name}: {formatCurrency(p.value)}</p>
      ))}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useFinance();
  const { transactions, loading, totalIncome, totalExpense, balance, categoryData, monthlyData } = useTransactions();

  const recent  = transactions.slice(0, 5);
  const topCat  = categoryData[0] ?? null;
  const barData = monthlyData.map(d => ({ ...d, label: formatMonth(d.month) }));

  if (loading) {
    return (
      <div className="db">
        <Topbar />
        <main className="db-main db-loading"><div className="spinner"></div><p>Loading your dashboard...</p></main>
      </div>
    );
  }

  return (
    <div className="db">
      <Topbar />

      <main className="db-main">

        <div className="db-greeting">
          <h1>{getGreeting()}, {user.name.split(' ')[0]} 👋</h1>
          <p>Here's your financial summary</p>
        </div>

        <div className="db-cards">
          <div className="db-card db-card--income">
            <span className="db-card__label">Total Income</span>
            <span className="db-card__icon">↑</span>
            <strong className="db-card__value">{formatCurrency(totalIncome)}</strong>
          </div>

          <div className="db-card db-card--expense">
            <span className="db-card__label">Total Expense</span>
            <span className="db-card__icon">↓</span>
            <strong className="db-card__value">{formatCurrency(totalExpense)}</strong>
          </div>

          <div className={`db-card ${balance >= 0 ? 'db-card--pos' : 'db-card--neg'}`}>
            <span className="db-card__label">Balance</span>
            <span className="db-card__icon">⚖</span>
            <strong className="db-card__value">{formatCurrency(balance)}</strong>
          </div>
        </div>

        <div className="db-secondary-grid">
           <BudgetCard />
           {topCat && (
              <div className="db-top-cat-card">
                 <div className="db-card-head">
                    <span className="db-card-label">🔥 Top Spending Category</span>
                    <strong className="db-card-title">{topCat.name}</strong>
                 </div>
                 <div className="db-card-body">
                    <strong className="db-card-amount">{formatCurrency(topCat.value)}</strong>
                    <p className="db-card-sub">spent this month</p>
                 </div>
              </div>
           )}
        </div>

        <div className="db-charts">
          <div className="db-chart-card card--full">
            <h2>📈 Monthly Trend</h2>
            {barData.length === 0 ? <Empty text="Need more data for trends." /> : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={barData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                  <Tooltip content={<ChartTip />} />
                  <Line type="monotone" dataKey="expense" name="Expenses" stroke="#f04438" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="income" name="Income" stroke="#12b76a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="db-chart-card">
            <h2>🍕 Expense by Category</h2>
            {categoryData.length === 0 ? <Empty text="No expenses yet." /> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={85} paddingAngle={2} stroke="none">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="db-chart-card">
            <h2>📊 Income vs Expense</h2>
            {barData.length === 0 ? <Empty text="No comparison data." /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} barGap={4} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ec" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#667085' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => formatCurrency(v).replace('₹', '')} tick={{ fontSize: 10, fill: '#667085' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="income" name="Income" fill="#12b76a" radius={[4,4,0,0]} />
                  <Bar dataKey="expense" name="Expense" fill="#f04438" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="db-recent">
          <div className="db-recent__head">
            <h2>Recent Transactions</h2>
            <a href="/transactions" className="db-link">View all →</a>
          </div>

          {recent.length === 0 ? <p className="db-empty">No transactions yet.&ensp;<a href="/transactions/new">Add your first one!</a></p> : (
            <table className="db-table">
              <thead><tr><th>Title</th><th>Category</th><th>Date</th><th style={{ textAlign: 'right' }}>Amount</th></tr></thead>
              <tbody>
                {recent.map(t => (
                  <tr key={t.id}>
                    <td><span className="db-dot" style={{ background: t.type === 'income' ? 'var(--c-income)' : 'var(--c-expense)' }} />{t.title}</td>
                    <td><span className="db-badge">{t.category}</span></td>
                    <td className="db-muted">{formatDate(t.date)}</td>
                    <td style={{ color: t.type === 'income' ? 'var(--c-income)' : 'var(--c-expense)', fontWeight: 600, textAlign: 'right' }}>
                      {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
