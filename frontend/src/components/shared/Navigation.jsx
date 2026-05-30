// src/components/shared/Navigation.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Car, Search, X, Menu, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  `relative text-sm font-bold transition-colors duration-300 ${
    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
  }`;

const activeLine = (isActive) => (
  <span
    className={`absolute -bottom-2 left-0 h-[2px] rounded-full bg-blue-500 transition-all duration-300 ${
      isActive ? 'w-full' : 'w-0'
    }`}
  />
);

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
    <nav className="fixed top-0 z-50 w-full px-3 py-3 sm:px-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#111116]/85 px-4 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:px-5">
        <Link to="/" className="group flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-glow-sm">
            <Car size={18} />
          </div>
          <span className="truncate text-base font-black tracking-tight text-white transition-colors group-hover:text-blue-300 sm:text-lg">
            Drive<span className="text-blue-400">Ease</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="group relative hidden max-w-lg flex-1 md:flex">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500" size={18} />
          <input
            type="text"
            placeholder="Search premium cars..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
          />
        </form>

        <div className="hidden items-center gap-7 lg:flex">
          <NavLink to="/cars" className={navLinkClass}>
            {({ isActive }) => (
              <>
                Fleet
                {activeLine(isActive)}
              </>
            )}
          </NavLink>

          <NavLink to="/community" className={navLinkClass}>
            {({ isActive }) => (
              <>
                Community
                {activeLine(isActive)}
              </>
            )}
          </NavLink>
           
<Link to="/signup" className="btn-primary">
  Sign Up
</Link>
          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              <NavLink
                to={isAdmin ? '/admin' : '/dashboard'}
                className={({ isActive }) =>
                  `relative flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <LayoutDashboard size={16} />
                    Dashboard
                    {activeLine(isActive)}
                  </>
                )}
              </NavLink>

              <button
                onClick={logout}
                className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-500/25 bg-blue-500/10 px-4 py-2.5 text-sm font-bold text-white transition hover:border-blue-400/40 hover:bg-blue-500/20"
            >
              <UserCircle size={16} />
              Sign In
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-3 flex max-h-[calc(100vh-6rem)] flex-col gap-5 overflow-y-auto rounded-2xl border border-white/10 bg-[#111116]/95 p-5 shadow-2xl backdrop-blur-2xl lg:hidden"
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
                <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setMobileOpen(false)} className="btn-primary text-center">Dashboard</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-xl border border-red-500/20 px-4 py-3 text-sm font-bold text-red-400">Sign Out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary text-center">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
