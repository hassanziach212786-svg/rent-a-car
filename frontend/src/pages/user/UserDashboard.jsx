// src/pages/user/UserDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, User, LogOut, Clock, CheckCircle2,
  XCircle, CreditCard, Car, Menu, X, MapPin, Star, AlertCircle,
  ChevronRight, TrendingUp, Edit2, Save, Phone, Mail, Shield,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

/* ── helpers ── */
const STATUS = {
  pending_payment:   { label: 'Pending Payment', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   Icon: Clock },
  payment_submitted: { label: 'Under Review',    cls: 'bg-blue-500/10  text-blue-400  border-blue-500/20',    Icon: CreditCard },
  confirmed:         { label: 'Confirmed',       cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', Icon: CheckCircle2 },
  completed:         { label: 'Completed',       cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20', Icon: CheckCircle2 },
  cancelled:         { label: 'Cancelled',       cls: 'bg-red-500/10   text-red-400   border-red-500/20',     Icon: XCircle },
};

const fmt = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
};

const daysBetween = (a, b) =>
  Math.max(1, Math.ceil((new Date(b) - new Date(a)) / 86_400_000));

/* ── Skeleton ── */
const Skeleton = ({ h = 'h-20', n = 3 }) => (
  <div className="space-y-3">
    {[...Array(n)].map((_, i) => (
      <div key={i} className={`${h} skeleton`} />
    ))}
  </div>
);

/* ════════════════════════════════════════════
   OVERVIEW TAB
════════════════════════════════════════════ */
const OverviewTab = ({ onViewBookings }) => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    API.get('/bookings/mybookings')
      .then((r) => setBookings(r.data))
      .catch(() => toast.error('Failed to load overview'))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Bookings', val: bookings.length,                                                          icon: Calendar,    color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Active Rentals', val: bookings.filter(b => b.status === 'confirmed').length,                    icon: Car,         color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Pending',        val: bookings.filter(b => ['pending_payment','payment_submitted'].includes(b.status)).length, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Total Spent',    val: `Rs ${bookings.reduce((s, b) => s + (b.total_amount || 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`rounded-2xl border bg-[#121218] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)] ${s.bg}`}
          >
            <div className="mb-3 flex items-start justify-between">
              <p className="text-xs font-semibold text-gray-600">{s.label}</p>
              <s.icon size={16} className={s.color} />
            </div>
            <p className={`font-display font-bold text-2xl ${s.color}`}>{loading ? '—' : s.val}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#121218] shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col gap-3 border-b border-white/[0.05] px-4 py-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between sm:px-6">
          <h3 className="font-bold text-white text-sm">Recent Bookings</h3>
          <button onClick={onViewBookings} className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            View all →
          </button>
        </div>
        {loading ? (
          <div className="p-6"><Skeleton n={3} h="h-16" /></div>
        ) : bookings.slice(0, 4).length === 0 ? (
          <div className="py-12 text-center text-gray-600 text-sm">No bookings yet</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {bookings.slice(0, 4).map((b) => {
              const s = STATUS[b.status] || STATUS.pending_payment;
              return (
                <div key={b._id} className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-2 overflow-hidden flex-shrink-0">
                      <img src={b.car_id?.image || '/placeholder-car.jpg'} alt="" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{b.car_id?.brand} {b.car_id?.model}</p>
                      <p className="text-xs text-gray-600">{fmt(b.start_date)} → {fmt(b.end_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white hidden sm:block">Rs {b.total_amount?.toLocaleString()}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${s.cls}`}>
                      <s.Icon size={9} /> {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   BOOKINGS TAB
════════════════════════════════════════════ */
const BookingsTab = () => {
  const navigate   = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    API.get('/bookings/mybookings')
      .then((r) => setBookings(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      setBookings((p) => p.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const tabs = [
    { k: 'all',              l: 'All' },
    { k: 'pending_payment',  l: 'Pending' },
    { k: 'confirmed',        l: 'Confirmed' },
    { k: 'completed',        l: 'Completed' },
    { k: 'cancelled',        l: 'Cancelled' },
  ];

  const shown = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">My Bookings</h2>
          <p className="text-gray-600 text-sm mt-0.5">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => navigate('/cars')} className="btn-primary w-full px-5 py-2.5 text-sm sm:w-auto">
          <Car size={14} /> Rent a Car
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-1 p-1 bg-surface-2 rounded-2xl mb-6 overflow-x-auto">
        {tabs.map(({ k, l }) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filter === k ? 'bg-blue-600 text-white shadow-blue-glow-sm' : 'text-gray-500 hover:text-gray-300'
            }`}>
            {l}
            {k === 'all' && <span className="ml-1.5 opacity-50">({bookings.length})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton n={4} h="h-24" />
      ) : shown.length === 0 ? (
        <div className="text-center py-16 glass-card border-dashed border-white/[0.06]">
          <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} className="text-gray-700" />
          </div>
          <p className="text-gray-400 font-semibold mb-1">No bookings found</p>
          <p className="text-gray-700 text-sm mb-5">
            {filter === 'all' ? 'Start your first journey today' : `No ${filter.replace('_', ' ')} bookings`}
          </p>
          <button onClick={() => navigate('/cars')} className="btn-primary text-sm px-6 py-2.5">Browse Cars</button>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((b, i) => {
            const s       = STATUS[b.status] || STATUS.pending_payment;
            const d       = daysBetween(b.start_date, b.end_date);
            const canPay  = b.status === 'pending_payment';
            const canCxl  = ['pending_payment', 'payment_submitted'].includes(b.status);
            const canRev  = b.status === 'completed';

            return (
              <motion.div key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass-card-hover flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 group">

                {/* Car info */}
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <div className="w-16 h-12 rounded-xl bg-surface-2 overflow-hidden flex-shrink-0">
                    <img src={b.car_id?.image || '/placeholder-car.jpg'} alt="car" className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-sm truncate">{b.car_id?.brand} {b.car_id?.model}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar size={10} className="text-blue-400" />
                        {fmt(b.start_date)} → {fmt(b.end_date)}
                      </span>
                      {b.pickup_location_id?.city && (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <MapPin size={10} className="text-blue-400" />
                          {b.pickup_location_id.city}
                        </span>
                      )}
                      <span className="text-xs text-gray-700">{d}d</span>
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex w-full flex-shrink-0 flex-wrap items-center gap-3 sm:w-auto">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-gray-700 uppercase tracking-wider font-bold">Total</p>
                    <p className="text-sm font-bold text-white">Rs {b.total_amount?.toLocaleString()}</p>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${s.cls}`}>
                    <s.Icon size={9} /> {s.label}
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {canPay && (
                      <button onClick={() => navigate(`/Checkout/${b._id}`)}
                        className="text-xs font-bold px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-colors">
                        Pay Now
                      </button>
                    )}
                    
                    {canRev && (
                      <button onClick={() => navigate(`/review/${b.car_id?._id}`, { state: { bookingId: b._id } })}
                        className="text-xs font-bold px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/20 transition-colors">
                        <Star size={10} className="inline mr-1" />Review
                      </button>
                    )}
                    {canCxl && (
                      <button onClick={() => handleCancel(b._id)}
                        className="text-xs font-bold px-3 py-1.5 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>

                  <ChevronRight size={14} className="text-gray-800 hidden sm:block group-hover:text-gray-500 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   PROFILE TAB
════════════════════════════════════════════ */
const ProfileTab = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
  });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      setUser(data);
      toast.success('Profile updated ✓');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPw.length < 6) return toast.error('Password must be at least 6 characters');
    if (pwForm.newPw !== pwForm.confirm) return toast.error('Passwords do not match');
    setPwLoading(true);
    try {
      await API.put('/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.newPw });
      toast.success('Password changed successfully ✓');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Profile Settings</h2>
        <p className="text-gray-600 text-sm mt-0.5">Manage your account information</p>
      </div>

      {/* Avatar + name card */}
      <div className="glass-card p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/[0.05] pb-6 min-[420px]:flex-row min-[420px]:items-center sm:gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-blue-glow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-white text-lg">{user?.name}</p>
            <p className="text-gray-600 text-sm">{user?.email}</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 mt-1 rounded-full text-[10px] font-bold border bg-blue-500/10 text-blue-400 border-blue-500/20">
              <Shield size={9} /> Customer
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Full Name</label>
            {editing ? (
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="glass-input w-full text-sm" placeholder="Your full name" />
            ) : (
              <p className="text-gray-200 text-sm py-3 px-4 bg-surface-2 rounded-2xl border border-white/[0.05]">{user?.name}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">
              Email Address <span className="text-gray-700 normal-case">(cannot be changed)</span>
            </label>
            <div className="flex items-center gap-2.5 py-3 px-4 bg-surface-2 rounded-2xl border border-white/[0.05]">
              <Mail size={13} className="text-gray-700" />
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Phone Number</label>
            {editing ? (
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="glass-input w-full text-sm" placeholder="+92 3XX XXXXXXX" type="tel" />
            ) : (
              <div className="flex items-center gap-2.5 py-3 px-4 bg-surface-2 rounded-2xl border border-white/[0.05]">
                <Phone size={13} className="text-gray-700" />
                <p className="text-sm text-gray-400">{user?.phone || 'Not provided'}</p>
              </div>
            )}
          </div>

          {/* Member since */}
          <div>
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">Member Since</label>
            <p className="text-gray-500 text-sm py-3 px-4 bg-surface-2 rounded-2xl border border-white/[0.05]">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            {editing ? (
              <>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="btn-primary text-sm px-5 py-2.5 flex-1">
                  <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditing(false); setForm({ name: user?.name || '', phone: user?.phone || '' }); }}
                  className="btn-outline text-sm px-5 py-2.5">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-outline text-sm px-5 py-2.5">
                <Edit2 size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="glass-card p-5 sm:p-6">
        <h3 className="font-bold text-white mb-5 flex items-center gap-2">
          <Shield size={16} className="text-blue-400" /> Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { label: 'Current Password', key: 'current', val: pwForm.current },
            { label: 'New Password',     key: 'newPw',   val: pwForm.newPw },
            { label: 'Confirm New',      key: 'confirm', val: pwForm.confirm },
          ].map(({ label, key, val }) => (
            <div key={key}>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2">{label}</label>
              <input type="password" value={val} required
                onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                className="glass-input w-full text-sm" placeholder="••••••••" />
            </div>
          ))}
          <button type="submit" disabled={pwLoading} className="btn-primary text-sm px-5 py-2.5">
            {pwLoading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════════ */
const MENU_ITEMS = [
  { id: 'overview',  label: 'Overview',    Icon: LayoutDashboard },
  { id: 'bookings',  label: 'My Bookings', Icon: Calendar },
  { id: 'profile',   label: 'Profile',     Icon: User },
];

const UserDashboard = () => {
  const [tab,      setTab]      = useState('overview');
  const [sideOpen, setSideOpen] = useState(false);
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();

  /* Close sidebar on tab change on mobile */
  const changeTab = (id) => { setTab(id); setSideOpen(false); };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Car size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-base text-white">Drive<span className="text-gradient">Ease</span></span>
        </div>
        <button onClick={() => setSideOpen(false)} className="lg:hidden text-gray-600 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* User info */}
      <div className="border-b border-white/[0.06] px-5 py-5">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
          <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-600/40 to-indigo-600/40 text-sm font-bold text-blue-300">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-600 truncate">{user?.email}</p>
          </div>
          </div>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
            <Shield size={9} /> Customer
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {MENU_ITEMS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => changeTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === id
                ? 'border border-blue-500/20 bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-gray-500 hover:bg-white/[0.05] hover:text-white'
            }`}>
            <Icon size={16} className={tab === id ? 'text-blue-400' : 'text-gray-700'} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/[0.06] p-4">
        <button onClick={() => { logout(); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] px-3 pb-6 pt-24 sm:px-5">
      <div className="mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-[1480px] overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0d0d11] shadow-[0_26px_90px_rgba(0,0,0,0.42)]">

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/[0.06] bg-[#101016] lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sideOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSideOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="fixed bottom-0 left-0 top-0 z-50 w-64 border-r border-white/[0.06] bg-[#101016] lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-white/[0.06] bg-[#0d0d11]/95 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(true)} className="rounded-xl p-2 text-gray-600 transition-colors hover:bg-white/5 lg:hidden">
              <Menu size={18} />
            </button>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-400">Customer Dashboard</p>
              <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                {MENU_ITEMS.find(m => m.id === tab)?.label || tab}
              </h1>
              <p className="mt-1 hidden text-sm text-gray-600 sm:block">
                {new Date().toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/cars')} className="btn-primary shrink-0 px-3 py-2 text-xs sm:px-4">
            <Car size={13} /> Rent Now
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {tab === 'overview' && <OverviewTab onViewBookings={() => changeTab('bookings')} />}
              {tab === 'bookings' && <BookingsTab />}
              {tab === 'profile'  && <ProfileTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      </div>
    </div>
  );
};

export default UserDashboard;
