import { NavLink } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

export default function Navbar() {
  const { period, setPeriod } = useAppStore();

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">₺ Fine-ance</span>
      </div>

      <ul className="navbar-nav">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-entry"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Veri Girişi
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/sankey"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-sankey"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-8 4 4 4-8" />
            </svg>
            Sankey
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            id="nav-analytics"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="12" width="4" height="8" rx="1" />
              <rect x="10" y="8" width="4" height="12" rx="1" />
              <rect x="17" y="4" width="4" height="16" rx="1" />
            </svg>
            Analiz
          </NavLink>
        </li>
      </ul>

      <div className="navbar-actions">
        <div className="period-toggle" id="period-toggle">
          <button
            className={`period-toggle-btn ${period === 'weekly' ? 'active' : ''}`}
            onClick={() => setPeriod('weekly')}
            id="toggle-weekly"
          >
            Haftalık
          </button>
          <button
            className={`period-toggle-btn ${period === 'monthly' ? 'active' : ''}`}
            onClick={() => setPeriod('monthly')}
            id="toggle-monthly"
          >
            Aylık
          </button>
        </div>
      </div>
    </nav>
  );
}
