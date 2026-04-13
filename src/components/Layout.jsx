import { NavLink } from 'react-router-dom';

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-earth-500 text-cream-100' : 'text-cream-200 hover:bg-forest-800 hover:text-cream-100'
  }`;

function Layout({ children }) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 rounded-xl border border-forest-800 bg-forest-900/80 p-4 shadow-card backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream-100">Mushroom Cultivation Dashboard</h1>
          <p className="text-sm text-cream-200">Track grows, harvests, and performance over time.</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          <NavLink className={navClass} to="/">
            Grows
          </NavLink>
          <NavLink className={navClass} to="/stats">
            Stats
          </NavLink>
        </nav>
      </header>
      {children}
    </div>
  );
}

export default Layout;
