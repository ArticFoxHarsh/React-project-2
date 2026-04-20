import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard      from './pages/Dashboard';
import Transactions   from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import Budget         from './pages/Budget';
import Analytics      from './pages/Analytics';

export default function App() {
  return (
    <Routes>
      <Route path="/"                 element={<Dashboard />} />
      <Route path="/dashboard"         element={<Navigate to="/" replace />} />
      <Route path="/transactions"     element={<Transactions />} />
      <Route path="/transactions/new" element={<AddTransaction />} />
      <Route path="/budget"           element={<Budget />} />
      <Route path="/analytics"        element={<Analytics />} />
      <Route path="*"                 element={<Navigate to="/" replace />} />
    </Routes>
  );
}
