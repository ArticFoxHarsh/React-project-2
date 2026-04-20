import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import Topbar from '../components/Topbar';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatMonth } from '../utils/formatters';
import './Analytics.css';

const COLORS = ['#4361ee','#f04438','#12b76a','#f79009','#9b8afb','#06aed4','#e879f9','#64748b'];

function Empty({ text }) {
  return <p className="analytics-empty">{text}</p>;
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="analytics-tip">
      {label && <strong>{label}</strong>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
    const { totalIncome, totalExpense, balance, categoryData, monthlyData } = useTransactions();

    const barData = monthlyData.map(d => ({ ...d, label: formatMonth(d.month) }));

    return (
        <div className="analytics-page">
            <Topbar />

            <main className="analytics-main">
                <div className="analytics-header">
                    <h1 className="analytics-heading">Financial Insights</h1>
                    <p className="analytics-sub">Deeper analysis of your spending habits</p>
                </div>

                <div className="analytics-grid">
                    {/* Monthly Trends - Line Chart */}
                    <div className="analytics-card card--full">
                        <h2>📈 Monthly Spending Trend</h2>
                        {monthlyData.length === 0 ? <Empty text="Need more data to show trends." /> : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} unit="k" />
                                    <Tooltip content={<ChartTip />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="expense" name="Expenses" stroke="#f04438" strokeWidth={3} dot={{ r: 6, fill: '#f04438', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="income" name="Income" stroke="#12b76a" strokeWidth={3} dot={{ r: 6, fill: '#12b76a', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Category Breakdown - Pie Chart */}
                    <div className="analytics-card">
                        <h2>🍕 Expense Breakdown</h2>
                        {categoryData.length === 0 ? <Empty text="No expenses to categorize yet." /> : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%" cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        stroke="none"
                                    >
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTip />} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Income vs Expense - Bar Chart */}
                    <div className="analytics-card">
                        <h2>📊 Income vs Expense</h2>
                        {barData.length === 0 ? <Empty text="Add transactions to compare monthly flows." /> : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#667085' }} />
                                    <Tooltip content={<ChartTip />} />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#12b76a" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" name="Expense" fill="#f04438" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
