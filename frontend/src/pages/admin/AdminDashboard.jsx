// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, Car, Calendar, Users, CheckCircle2,
  XCircle, Plus, Edit2, Trash2, LogOut,
  DollarSign, MapPin, Truck, X, Save, Eye,
  TrendingUp, Clock, AlertCircle, RefreshCw, Flag,
} from '../../components/shared/BootstrapIcons';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/dateTime';
import { OfficeMap } from '../../components/shared/OfficeMap';

const getId = (value) => value?._id || value || '';

const toCarFormData = (form) => {
  const body = new FormData();
  ['brand', 'model', 'year', 'base_rent_per_day', 'location_id', 'status'].forEach((key) => {
    if (form[key] !== undefined && form[key] !== null && form[key] !== '') {
      body.append(key, form[key]);
    }
  });
  if (form.imageFile) body.append('image', form.imageFile);
  return body;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_BOOKING = {
  pending_payment:   { label: 'Pending Payment', cls: 'bg-amber-500/10 text-amber-400'  },
  payment_submitted: { label: 'Under Review',    cls: 'bg-blue-500/10 text-blue-400'    },
  confirmed:         { label: 'Confirmed',        cls: 'bg-emerald-500/10 text-emerald-400' },
  completed:         { label: 'Completed',        cls: 'bg-purple-500/10 text-purple-400'   },
  cancelled:         { label: 'Cancelled',        cls: 'bg-red-500/10 text-red-400'      },
};

const STATUS_PAYMENT = {
  pending:  { label: 'Pending',  cls: 'bg-amber-500/10 text-amber-400' },
  paid:     { label: 'Paid',     cls: 'bg-emerald-500/10 text-emerald-400' },
  rejected: { label: 'Rejected', cls: 'bg-red-500/10 text-red-400' },
};

const STATUS_CAR = {
  available:   { label: 'Available',    cls: 'bg-emerald-500/10 text-emerald-400' },
  booked:      { label: 'Booked',       cls: 'bg-blue-500/10 text-blue-400'  },
  maintenance: { label: 'Maintenance',  cls: 'bg-amber-500/10 text-amber-400' },
};

const MENU = [
  { id: 'analytics', label: 'Analytics',  Icon: BarChart2  },
  { id: 'cars',      label: 'Fleet',      Icon: Car        },
  { id: 'bookings',  label: 'Bookings',   Icon: Calendar   },
  { id: 'payments',  label: 'Payments',   Icon: DollarSign },
  { id: 'drivers',   label: 'Drivers',    Icon: Truck      },
  { id: 'locations', label: 'Locations',  Icon: MapPin     },
  { id: 'users',     label: 'Users',      Icon: Users      },
];

const fmt = (d) =>
  formatDateTime(d) || '—';

// ─── Shared UI ───────────────────────────────────────────────────────────────

const TableSkeleton = ({ cols = 5 }) => (
  <tr>
    <td colSpan={cols} className="px-6 py-8">
      <div className="space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    </td>
  </tr>
);

const EmptyRow = ({ cols, message }) => (
  <tr>
    <td colSpan={cols} className="px-6 py-16 text-center text-gray-600 text-sm">
      <AlertCircle size={28} className="mx-auto mb-3 opacity-30" />
      {message}
    </td>
  </tr>
);

const Badge = ({ status, map }) => {
  const s = map[status] || { label: status, cls: 'bg-gray-500/10 text-gray-400' };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.cls}`}>
      {s.label}
    </span>
  );
};

// ─── Modal Wrapper ────────────────────────────────────────────────────────────

const Modal = ({ title, onClose, children }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─── Car Form ─────────────────────────────────────────────────────────────────

const CAR_DEFAULTS = {
  brand: '', model: '', year: new Date().getFullYear(),
  base_rent_per_day: '', location_id: '', status: 'available', imageFile: null,
};

const CarForm = ({ initial, locations, onSave, onClose, saving }) => {
  const [form, setForm] = useState({
    ...CAR_DEFAULTS,
    ...(initial || {}),
    location_id: getId(initial?.location_id),
    imageFile: null,
  });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Brand</label>
          <input className={inputCls} value={form.brand} onChange={set('brand')} placeholder="Toyota" required />
        </div>
        <div>
          <label className={labelCls}>Model</label>
          <input className={inputCls} value={form.model} onChange={set('model')} placeholder="Corolla" required />
        </div>
        <div>
          <label className={labelCls}>Year</label>
          <input type="number" className={inputCls} value={form.year} onChange={set('year')} min="2000" max="2030" required />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <select className={inputCls} value={form.location_id} onChange={set('location_id')} required>
            <option value="">Select location</option>
            {locations.map(l => <option key={l._id} value={l._id}>{l.name} - {l.city}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Rent / Day (Rs)</label>
          <input type="number" className={inputCls} value={form.base_rent_per_day} onChange={set('base_rent_per_day')} placeholder="5000" required />
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={form.status} onChange={set('status')}>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Car Image</label>
        <input
          type="file"
          accept="image/*"
          className={inputCls}
          onChange={(e) => setForm(p => ({ ...p, imageFile: e.target.files?.[0] || null }))}
          required={!initial}
        />
        {initial?.image && <p className="mt-1 text-[11px] text-gray-600">Leave empty to keep existing image.</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {initial ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
};

// ─── Driver Form ──────────────────────────────────────────────────────────────

const DRIVER_DEFAULTS = { name: '', phone: '', license_number: '', location_id: '', availability_status: 'available' };

const DriverForm = ({ initial, locations, onSave, onClose, saving }) => {
  const [form, setForm] = useState({
    ...DRIVER_DEFAULTS,
    ...(initial || {}),
    location_id: getId(initial?.location_id),
  });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Full Name</label>
          <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Ali Hassan" required />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="03001234567" required />
        </div>
        <div>
          <label className={labelCls}>License No.</label>
          <input className={inputCls} value={form.license_number} onChange={set('license_number')} placeholder="LHR-12345" required />
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <select className={inputCls} value={form.location_id} onChange={set('location_id')} required>
            <option value="">Select location</option>
            {locations.map(l => <option key={l._id} value={l._id}>{l.name} - {l.city}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Status</label>
          <select className={inputCls} value={form.availability_status} onChange={set('availability_status')}>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {initial ? 'Update Driver' : 'Add Driver'}
        </button>
      </div>
    </form>
  );
};

// ─── Location Form ────────────────────────────────────────────────────────────

const LOCATION_DEFAULTS = {
  name: '',
  city: '',
  address: '',
  latitude: '',
  longitude: '',
  phone: '',
  hours: '24/7 Open',
};

const LocationForm = ({ initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState({ ...LOCATION_DEFAULTS, ...(initial || {}) });
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className={labelCls}>Location Name</label>
        <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Lahore Airport" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>City</label>
          <input className={inputCls} value={form.city} onChange={set('city')} placeholder="Lahore" required />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="+92 300 111 2222" />
        </div>
      </div>
      <div>
        <label className={labelCls}>Full Address</label>
        <textarea className={`${inputCls} resize-none`} rows={2} value={form.address} onChange={set('address')} placeholder="Street, Area, City" required />
      </div>
      <div>
        <label className={labelCls}>Office Hours</label>
        <input className={inputCls} value={form.hours} onChange={set('hours')} placeholder="24/7 Open" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Latitude</label>
          <input type="number" step="any" className={inputCls} value={form.latitude || ''} onChange={set('latitude')} placeholder="30.1575" />
        </div>
        <div>
          <label className={labelCls}>Longitude</label>
          <input type="number" step="any" className={inputCls} value={form.longitude || ''} onChange={set('longitude')} placeholder="71.5249" />
        </div>
      </div>
      {(form.address || form.latitude || form.longitude) && <OfficeMap location={form} compact />}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm font-bold transition-colors">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          {initial ? 'Update Location' : 'Add Location'}
        </button>
      </div>
    </form>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('analytics');

  // Data
  const [stats,     setStats]     = useState(null);
  const [cars,      setCars]      = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [payments,  setPayments]  = useState([]);
  const [drivers,   setDrivers]   = useState([]);
  const [locations, setLocations] = useState([]);
  const [users,     setUsers]     = useState([]);

  // Loading per-section
  const [loading, setLoading] = useState({});
  const [saving,  setSaving]  = useState(false);
  const setLoad = (key, val) => setLoading(p => ({ ...p, [key]: val }));

  // Modal state — { type: 'car'|'driver'|'location'|'booking', mode: 'add'|'edit'|'view', data: {} }
  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  // ── Fetchers ──────────────────────────────────────────────────────────────

  const fetchStats = async () => {
    setLoad('stats', true);
    try { const r = await API.get('/admin/stats'); setStats(r.data.stats || r.data); }
    catch { toast.error('Failed to load stats'); }
    finally { setLoad('stats', false); }
  };

  const fetchCars = async () => {
    setLoad('cars', true);
    try { const r = await API.get('/cars'); setCars(r.data); }
    catch { toast.error('Failed to load cars'); }
    finally { setLoad('cars', false); }
  };

  const fetchBookings = async () => {
    setLoad('bookings', true);
    try { const r = await API.get('/bookings'); setBookings(r.data); }
    catch { toast.error('Failed to load bookings'); }
    finally { setLoad('bookings', false); }
  };

  const fetchPayments = async () => {
    setLoad('payments', true);
    try { const r = await API.get('/payments'); setPayments(r.data); }
    catch { toast.error('Failed to load payments'); }
    finally { setLoad('payments', false); }
  };

  const fetchDrivers = async () => {
    setLoad('drivers', true);
    try { const r = await API.get('/drivers'); setDrivers(r.data); }
    catch { toast.error('Failed to load drivers'); }
    finally { setLoad('drivers', false); }
  };

  const fetchLocations = async () => {
    setLoad('locations', true);
    try { const r = await API.get('/locations'); setLocations(r.data); }
    catch { toast.error('Failed to load locations'); }
    finally { setLoad('locations', false); }
  };

  const fetchUsers = async () => {
    setLoad('users', true);
    try { const r = await API.get('/admin/users'); setUsers(r.data); }
    catch { toast.error('Failed to load users'); }
    finally { setLoad('users', false); }
  };

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if ((tab === 'cars' || tab === 'drivers') && !locations.length) fetchLocations();
    if (tab === 'cars'      && !cars.length)      fetchCars();
    if (tab === 'bookings'  && !bookings.length)  fetchBookings();
    if (tab === 'payments'  && !payments.length)  fetchPayments();
    if (tab === 'drivers'   && !drivers.length)   fetchDrivers();
    if (tab === 'locations' && !locations.length) fetchLocations();
    if (tab === 'users'     && !users.length)     fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // ── Car Handlers ──────────────────────────────────────────────────────────

  const handleSaveCar = async (form) => {
    setSaving(true);
    try {
      const body = toCarFormData(form);
      if (modal?.data?._id) {
        const r = await API.put(`/cars/${modal.data._id}`, body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setCars(prev => prev.map(c => c._id === modal.data._id ? r.data : c));
        toast.success('Vehicle updated');
      } else {
        const r = await API.post('/cars', body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setCars(prev => [r.data, ...prev]);
        toast.success('Vehicle added');
      }
      closeModal();
      fetchStats();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await API.delete(`/cars/${id}`);
      setCars(prev => prev.filter(c => c._id !== id));
      toast.success('Car deleted');
      fetchStats();
    } catch { toast.error('Delete failed'); }
  };

  // ── Booking Handlers ──────────────────────────────────────────────────────

  const handleBookingAction = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
      fetchStats();
    } catch { toast.error('Action failed'); }
  };

  // ── Payment Handlers ──────────────────────────────────────────────────────

  const handlePaymentAction = async (id, status) => {
    try {
      await API.put(`/payments/${id}/${status}`);
      toast.success('Payment status updated');
      fetchPayments();
      fetchStats();
    } catch { toast.error('Action failed'); }
  };

  // ── Driver Handlers ───────────────────────────────────────────────────────

  const handleSaveDriver = async (form) => {
    setSaving(true);
    try {
      if (modal?.data?._id) {
        const r = await API.put(`/drivers/${modal.data._id}`, form);
        setDrivers(prev => prev.map(d => d._id === modal.data._id ? r.data : d));
        toast.success('Driver updated');
      } else {
        const r = await API.post('/drivers', form);
        setDrivers(prev => [r.data, ...prev]);
        toast.success('Driver added');
      }
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDriver = async (id) => {
    if (!window.confirm('Remove this driver?')) return;
    try {
      await API.delete(`/drivers/${id}`);
      setDrivers(prev => prev.filter(d => d._id !== id));
      toast.success('Driver removed');
    } catch { toast.error('Delete failed'); }
  };

  // ── Location Handlers ─────────────────────────────────────────────────────

  const handleSaveLocation = async (form) => {
    setSaving(true);
    try {
      if (modal?.data?._id) {
        const r = await API.put(`/locations/${modal.data._id}`, form);
        setLocations(prev => prev.map(l => l._id === modal.data._id ? r.data : l));
        toast.success('Location updated');
      } else {
        const r = await API.post('/locations', form);
        setLocations(prev => [r.data, ...prev]);
        toast.success('Location added');
      }
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm('Delete this location?')) return;
    try {
      await API.delete(`/locations/${id}`);
      setLocations(prev => prev.filter(l => l._id !== id));
      toast.success('Location deleted');
    } catch { toast.error('Delete failed'); }
  };

  // ── User Handlers ─────────────────────────────────────────────────────────

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
      fetchStats();
    } catch { toast.error('Delete failed'); }
  };

  // ── Tab Components ─────────────────────────────────────────────────────────

  const AnalyticsTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Revenue',   val: `Rs ${(stats?.totalRevenue || 0).toLocaleString()}`, Icon: DollarSign, color: 'blue',    bg: 'bg-blue-600/10',    text: 'text-blue-400'    },
          { label: 'Total Bookings',  val: stats?.totalBookings  || 0,                          Icon: Calendar,   color: 'purple',  bg: 'bg-purple-600/10',  text: 'text-purple-400'  },
          { label: 'Fleet Size',      val: stats?.totalCars      || 0,                          Icon: Car,        color: 'emerald', bg: 'bg-emerald-600/10', text: 'text-emerald-400' },
          { label: 'Active Users',    val: stats?.totalUsers     || 0,                          Icon: Users,      color: 'amber',   bg: 'bg-amber-600/10',   text: 'text-amber-400'   },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#121218] p-6 shadow-[0_18px_55px_rgba(0,0,0,0.22)] transition-colors hover:border-white/15"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.025] blur-xl transition group-hover:bg-white/[0.04]" />
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.Icon size={22} className={s.text} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-0.5">{s.label}</p>
              <p className="text-2xl font-bold text-white leading-none">{loading.stats ? '—' : s.val}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Pending Bookings',  val: stats?.pendingBookings  || 0, Icon: Clock,      cls: 'text-amber-400'   },
          { label: 'Confirmed Trips',   val: stats?.confirmedBookings || 0, Icon: TrendingUp, cls: 'text-blue-400'    },
          { label: 'Available Cars',    val: stats?.availableCars    || 0, Icon: Car,        cls: 'text-emerald-400' },
          { label: 'Active Drivers',    val: stats?.activeDrivers    || 0, Icon: Truck,      cls: 'text-purple-400'  },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#121218] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
            <div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{s.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{loading.stats ? '—' : s.val}</p>
            </div>
            <s.Icon size={32} className={`${s.cls} opacity-30`} />
          </div>
        ))}
      </div>
    </motion.div>
  );

  const CarsTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">Vehicle <span className="text-blue-500">Fleet</span>
          <span className="ml-2 text-xs text-gray-600 font-normal">({cars.length} vehicles)</span>
        </h2>
        <button
          onClick={() => setModal({ type: 'car', mode: 'add', data: null })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
        >
          <Plus size={15} /> Add Vehicle
        </button>
      </div>
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5">
              <tr className="text-[10px] uppercase text-gray-600 font-black tracking-widest">
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Rate / Day</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading.cars ? <TableSkeleton cols={5} /> : cars.length === 0 ? <EmptyRow cols={5} message="No vehicles in fleet" /> : cars.map(car => (
                <tr key={car._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {car.image
                        ? <img src={car.image} className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0" alt="" />
                        : <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0"><Car size={18} className="text-gray-600" /></div>
                      }
                      <div>
                        <p className="text-sm font-bold text-white">{car.brand} {car.model}</p>
                        <p className="text-[10px] text-gray-600">{car.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {car.location_id ? `${car.location_id.name || ''}${car.location_id.city ? `, ${car.location_id.city}` : ''}` : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-400">Rs {car.base_rent_per_day?.toLocaleString()}</td>
                  <td className="px-6 py-4"><Badge status={car.status} map={STATUS_CAR} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setModal({ type: 'car', mode: 'edit', data: car })}
                        className="p-2 hover:bg-blue-500/10 rounded-lg text-gray-500 hover:text-blue-400 transition-colors"
                        title="Edit"
                      ><Edit2 size={14} /></button>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete"
                      ><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const BookingsTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">Bookings <span className="text-[11px] text-gray-600 font-normal">({bookings.length})</span></h2>
        <button onClick={fetchBookings} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors" title="Refresh"><RefreshCw size={15} /></button>
      </div>
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5">
              <tr className="text-[10px] uppercase text-gray-600 font-black tracking-widest">
                <th className="px-6 py-4">Ref</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading.bookings ? <TableSkeleton cols={7} /> : bookings.length === 0 ? <EmptyRow cols={7} message="No bookings yet" /> : bookings.map(b => (
                <tr key={b._id} className="hover:bg-white/[0.02] text-sm">
                  <td className="px-6 py-4 font-mono text-xs text-blue-400">#{b._id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm">{b.user_id?.name || 'Guest'}</p>
                    <p className="text-[11px] text-gray-600">{b.user_id?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{b.car_id?.brand} {b.car_id?.model}</td>
                  <td className="px-6 py-4 text-[11px] text-gray-500">{fmt(b.start_date)}<br/>→ {fmt(b.end_date)}</td>
                  <td className="px-6 py-4 font-bold text-white">Rs {b.total_amount?.toLocaleString()}</td>
                  <td className="px-6 py-4"><Badge status={b.status} map={STATUS_BOOKING} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setModal({ type: 'booking', mode: 'view', data: b })} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors" title="View"><Eye size={14} /></button>
                      {b.status === 'payment_submitted' && (
                        <button onClick={() => handleBookingAction(b._id, 'confirmed')} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all" title="Confirm"><CheckCircle2 size={14}/></button>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => handleBookingAction(b._id, 'completed')} className="p-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all" title="Mark Completed"><Flag size={14}/></button>
                      )}
                      {b.status !== 'cancelled' && b.status !== 'completed' && (
                        <button onClick={() => handleBookingAction(b._id, 'cancelled')} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Cancel"><XCircle size={14}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const PaymentsTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">Payments <span className="text-[11px] text-gray-600 font-normal">({payments.length})</span></h2>
        <button onClick={fetchPayments} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"><RefreshCw size={15} /></button>
      </div>
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5">
              <tr className="text-[10px] uppercase text-gray-600 font-black tracking-widest">
                <th className="px-6 py-4">Booking Ref</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Screenshot</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading.payments ? <TableSkeleton cols={7} /> : payments.length === 0 ? <EmptyRow cols={7} message="No payments recorded" /> : payments.map(p => (
                <tr key={p._id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-mono text-xs text-blue-400">#{p.booking_id?._id?.slice(-6).toUpperCase() || p.booking_id?.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-white">{p.booking_id?.user_id?.name || '—'}</p>
                    <p className="text-[11px] text-gray-600">{fmt(p.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white">Rs {p.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-gray-400 capitalize">{p.payment_method || '—'}</td>
                  <td className="px-6 py-4">
                    {p.payment_screenshot
                      ? <a href={p.payment_screenshot} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1"><Eye size={12}/>View</a>
                      : <span className="text-xs text-gray-700">None</span>
                    }
                  </td>
                  <td className="px-6 py-4"><Badge status={p.status} map={STATUS_PAYMENT} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {p.status === 'pending' && (
                        <>
                          <button onClick={() => handlePaymentAction(p._id, 'approve')} className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all" title="Approve"><CheckCircle2 size={14}/></button>
                          <button onClick={() => handlePaymentAction(p._id, 'reject')} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Reject"><XCircle size={14}/></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const DriversTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">Drivers <span className="text-[11px] text-gray-600 font-normal">({drivers.length})</span></h2>
        <button
          onClick={() => setModal({ type: 'driver', mode: 'add', data: null })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
        >
          <Plus size={15} /> Add Driver
        </button>
      </div>
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5">
              <tr className="text-[10px] uppercase text-gray-600 font-black tracking-widest">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">License</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading.drivers ? <TableSkeleton cols={6} /> : drivers.length === 0 ? <EmptyRow cols={6} message="No drivers registered" /> : drivers.map(d => (
                <tr key={d._id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/15 flex items-center justify-center font-bold text-sm text-blue-400 flex-shrink-0">
                        {d.name?.[0]?.toUpperCase()}
                      </div>
                      <p className="text-sm font-bold text-white">{d.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{d.phone}</td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">{d.license_number}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {d.location_id ? `${d.location_id.name || ''}${d.location_id.city ? `, ${d.location_id.city}` : ''}` : 'Unassigned'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      d.availability_status === 'available' ? 'bg-emerald-500/10 text-emerald-400' :
                      d.availability_status === 'busy'      ? 'bg-blue-500/10 text-blue-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>{d.availability_status?.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setModal({ type: 'driver', mode: 'edit', data: d })} className="p-2 hover:bg-blue-500/10 rounded-lg text-gray-500 hover:text-blue-400 transition-colors"><Edit2 size={14}/></button>
                      <button onClick={() => handleDeleteDriver(d._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const LocationsTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">Locations <span className="text-[11px] text-gray-600 font-normal">({locations.length})</span></h2>
        <button
          onClick={() => setModal({ type: 'location', mode: 'add', data: null })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
        >
          <Plus size={15} /> Add Location
        </button>
      </div>
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5">
              <tr className="text-[10px] uppercase text-gray-600 font-black tracking-widest">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Map</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading.locations ? <TableSkeleton cols={5} /> : locations.length === 0 ? <EmptyRow cols={5} message="No locations added" /> : locations.map(l => (
                <tr key={l._id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={14} className="text-emerald-400" />
                      </div>
                      <p className="text-sm font-bold text-white">{l.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{l.city}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      l.latitude && l.longitude
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {l.latitude && l.longitude ? 'Exact Pin' : 'Address'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600 max-w-[200px] truncate">{l.address || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setModal({ type: 'location', mode: 'edit', data: l })} className="p-2 hover:bg-blue-500/10 rounded-lg text-gray-500 hover:text-blue-400 transition-colors"><Edit2 size={14}/></button>
                      <button onClick={() => handleDeleteLocation(l._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const UsersTab = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-white">Users <span className="text-[11px] text-gray-600 font-normal">({users.length})</span></h2>
        <button onClick={fetchUsers} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"><RefreshCw size={15} /></button>
      </div>
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5">
              <tr className="text-[10px] uppercase text-gray-600 font-black tracking-widest">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading.users ? <TableSkeleton cols={6} /> : users.length === 0 ? <EmptyRow cols={6} message="No users found" /> : users.map(u => (
                <tr key={u._id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/15 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <p className="text-sm font-bold text-white">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{u.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[11px] text-gray-600 font-mono">{fmt(u.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button onClick={() => handleDeleteUser(u._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  // ── Booking Detail Modal ───────────────────────────────────────────────────

  const BookingDetailModal = ({ b }) => (
    <div className="space-y-4 text-sm">
      {[
        ['Reference',  `#${b._id.slice(-6).toUpperCase()}`],
        ['Customer',   b.user_id?.name || 'Guest'],
        ['Email',      b.user_id?.email || '—'],
        ['Vehicle',    `${b.car_id?.brand || ''} ${b.car_id?.model || ''}`],
        ['Start Date', fmt(b.start_date)],
        ['End Date',   fmt(b.end_date)],
        ['Total',      `Rs ${b.total_amount?.toLocaleString()}`],
        ['Status',     b.status],
        ['Booked On',  fmt(b.createdAt)],
      ].map(([label, val]) => (
        <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
          <span className="text-gray-600 text-xs uppercase font-bold tracking-wider">{label}</span>
          <span className="text-white font-bold">{val}</span>
        </div>
      ))}
      {b.status === 'payment_submitted' && (
        <div className="flex gap-3 pt-2">
          <button onClick={() => { handleBookingAction(b._id, 'confirmed'); closeModal(); }} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={14}/> Confirm
          </button>
          <button onClick={() => { handleBookingAction(b._id, 'cancelled'); closeModal(); }} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold flex items-center justify-center gap-2">
            <XCircle size={14}/> Cancel
          </button>
        </div>
      )}
      {b.status === 'confirmed' && (
        <div className="flex gap-3 pt-2">
          <button onClick={() => { handleBookingAction(b._id, 'completed'); closeModal(); }} className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold flex items-center justify-center gap-2">
            <Flag size={14}/> Mark Completed
          </button>
          <button onClick={() => { handleBookingAction(b._id, 'cancelled'); closeModal(); }} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold flex items-center justify-center gap-2">
            <XCircle size={14}/> Cancel
          </button>
        </div>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#09090b] px-3 pb-6 pt-24 font-sans text-white sm:px-5">
      <div className="mx-auto flex min-h-[calc(100vh-7.5rem)] max-w-[1680px] overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0d0d11] shadow-[0_26px_90px_rgba(0,0,0,0.42)]">

      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/[0.06] bg-[#101016] p-5 lg:flex">
        <div className="mb-7 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black shadow-blue-glow-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">{user?.name || 'Admin User'}</p>
              <p className="truncate text-[11px] text-gray-600">{user?.email || 'admin account'}</p>
            </div>
          </div>
          <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-400">
            Admin Account
          </span>
        </div>
        <nav className="flex-1 space-y-1">
          {MENU.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                tab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-gray-500 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <item.Icon size={16} /> {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold uppercase tracking-wider text-red-400 transition-all hover:bg-red-500/10"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-shrink-0 flex-col gap-4 border-b border-white/[0.06] bg-[#0d0d11]/95 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-400">Control Center</p>
              <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                {MENU.find(m => m.id === tab)?.label}
              </h1>
              <p className="mt-1 text-sm text-gray-600">Manage bookings, fleet operations, people, and locations.</p>
            </div>
            <button
              onClick={() => {
                fetchStats();
                if (tab === 'cars') fetchCars();
                if (tab === 'bookings') fetchBookings();
                if (tab === 'payments') fetchPayments();
                if (tab === 'drivers') fetchDrivers();
                if (tab === 'locations') fetchLocations();
                if (tab === 'users') fetchUsers();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-gray-300 transition hover:border-white/20 hover:text-white"
            >
              <RefreshCw size={14} className={loading.stats ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        <div className="border-b border-white/[0.06] bg-[#101016] px-3 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {MENU.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  tab === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-white/[0.04] text-gray-500 hover:text-white'
                }`}
              >
                <item.Icon size={14} /> {item.label}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-[#09090b] p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            {tab === 'analytics' && <AnalyticsTab  key="analytics"  />}
            {tab === 'cars'      && <CarsTab        key="cars"       />}
            {tab === 'bookings'  && <BookingsTab    key="bookings"   />}
            {tab === 'payments'  && <PaymentsTab    key="payments"   />}
            {tab === 'drivers'   && <DriversTab     key="drivers"    />}
            {tab === 'locations' && <LocationsTab   key="locations"  />}
            {tab === 'users'     && <UsersTab        key="users"      />}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      {modal?.type === 'car' && (
        <Modal
          title={modal.mode === 'add' ? 'Add New Vehicle' : 'Edit Vehicle'}
          onClose={closeModal}
        >
          <CarForm initial={modal.data} locations={locations} onSave={handleSaveCar} onClose={closeModal} saving={saving} />
        </Modal>
      )}

      {modal?.type === 'driver' && (
        <Modal
          title={modal.mode === 'add' ? 'Add New Driver' : 'Edit Driver'}
          onClose={closeModal}
        >
          <DriverForm initial={modal.data} locations={locations} onSave={handleSaveDriver} onClose={closeModal} saving={saving} />
        </Modal>
      )}

      {modal?.type === 'location' && (
        <Modal
          title={modal.mode === 'add' ? 'Add New Location' : 'Edit Location'}
          onClose={closeModal}
        >
          <LocationForm initial={modal.data} onSave={handleSaveLocation} onClose={closeModal} saving={saving} />
        </Modal>
      )}

      {modal?.type === 'booking' && modal.mode === 'view' && (
        <Modal title={`Booking #${modal.data._id.slice(-6).toUpperCase()}`} onClose={closeModal}>
          <BookingDetailModal b={modal.data} />
        </Modal>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
