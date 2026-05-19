// src/components/shared/Navigation.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, X, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/cars?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full px-3 py-3 sm:px-4">
      <div className="glass-card mx-auto flex max-w-7xl items-center justify-between gap-3 border-white/5 px-4 py-3 shadow-2xl sm:px-6">
        {/* Logo */}
        <Link to="/" className="group flex min-w-0 items-center gap-2">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg text-white font-bold text-sm">
            🚗
          </div>
          <span className="truncate text-lg font-black tracking-tighter text-white transition-colors group-hover:text-blue-500 sm:text-xl">
            DRIVE<span className="text-blue-500 group-hover:text-white">EASE</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search premium cars..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
        </form>

        <div className="hidden lg:flex items-center gap-8">

  <NavLink
    to="/cars"
    className={({ isActive }) =>
      `
      relative text-sm font-bold transition-colors duration-300
      ${isActive ? 'text-white' : 'text-gray-400 hover:text-blue-500'}
      `
    }
  >
    {({ isActive }) => (
      <>
        Fleet

        <span
          className={`
            absolute -bottom-2 left-0 h-[2px]
            bg-blue-500 transition-all duration-300
            ${isActive ? 'w-full' : 'w-0'}
          `}
        />
      </>
    )}
  </NavLink>

  <NavLink
    to="/community"
    className={({ isActive }) =>
      `
      relative text-sm font-bold transition-colors duration-300
      ${isActive ? 'text-white' : 'text-gray-400 hover:text-blue-500'}
      `
    }
  >
    {({ isActive }) => (
      <>
        Community

        <span
          className={`
            absolute -bottom-2 left-0 h-[2px]
            bg-blue-500 transition-all duration-300
            ${isActive ? 'w-full' : 'w-0'}
          `}
        />
      </>
    )}
  </NavLink>

  {user ? (
    <div className="flex items-center gap-4 pl-4 border-l border-white/10">

      <NavLink
        to={isAdmin ? "/admin" : "/dashboard"}
        className={({ isActive }) =>
          `
          relative flex items-center gap-2 text-sm font-bold transition-colors duration-300
          ${isActive ? 'text-white' : 'text-gray-400 hover:text-blue-400'}
          `
        }
      >
        {({ isActive }) => (
          <>
            <LayoutDashboard size={16} />
            Dashboard

            <span
              className={`
                absolute -bottom-2 left-0 h-[2px]
                bg-blue-500 transition-all duration-300
                ${isActive ? 'w-full' : 'w-0'}
              `}
            />
          </>
        )}
      </NavLink>

      <button
        onClick={logout}
        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
      >
        <LogOut size={18} />
      </button>
    </div>
  ) : (
    <Link
      to="/login"
      className="btn-gradient text-xs py-2.5 px-6"
    >
      Sign In
    </Link>
  )}
</div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10 lg:hidden" aria-label="Toggle navigation">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card mt-3 flex max-h-[calc(100vh-6rem)] flex-col gap-5 overflow-y-auto border-white/10 p-5 shadow-2xl lg:hidden"
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search cars..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500/50"
              />
            </form>
            <Link to="/cars" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-white">Fleet</Link>
            <Link to="/community" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-white">Community</Link>
            <hr className="border-white/5" />
            {user ? (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setMobileOpen(false)} className="btn-gradient text-center">Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-xl border border-red-500/20 px-4 py-3 text-sm font-bold text-red-400">Sign Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-gradient text-center">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
