import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiGrid, FiList, FiPieChart, FiSettings, FiUser } from 'react-icons/fi';
import { useFinance } from '../context/FinanceContext';
import ProfileModal from './ProfileModal';
import './Topbar.css';

export default function Topbar() {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, user } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar__inner">

        <div className="topbar__logo">
          <span className="topbar__logo-mark">◈</span>
          <span className="topbar__logo-name">FinanceX</span>
        </div>

        <nav className="topbar__nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'topbar__link topbar__link--active' : 'topbar__link'}>
            <FiGrid /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? 'topbar__link topbar__link--active' : 'topbar__link'}>
            <FiList /> <span>Transactions</span>
          </NavLink>
          <NavLink to="/budget" className={({ isActive }) => isActive ? 'topbar__link topbar__link--active' : 'topbar__link'}>
            <FiSettings /> <span>Budget</span>
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'topbar__link topbar__link--active' : 'topbar__link'}>
            <FiPieChart /> <span>Analytics</span>
          </NavLink>
        </nav>

        <div className="topbar__right">
          <div className="topbar__search">
            <FiSearch className="search-icon" />
            <input
              type="search"
              placeholder="Search title, notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="topbar__cta" onClick={() => navigate('/transactions/new')}>
            <FiPlus /> <span>New</span>
          </button>

          {/* User Profile Hook */}
          <div className="topbar__profile" onClick={() => setIsModalOpen(true)} title={user.name}>
            <div className="topbar__avatar">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="avatar-img" />
              ) : (
                <FiUser />
              )}
            </div>
            <span className="topbar__user-name">{user.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
