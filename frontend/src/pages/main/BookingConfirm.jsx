// src/pages/main/BookingConfirm.jsx
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';
import { calculateRentalHours, toDateTimeLocalValue } from '../../utils/dateTime';
import { OfficeMap } from '../../components/shared/OfficeMap';

const BookingConfirm = () => {
  const { id } = useParams(); // Using 'id' to match standard AppRouter params
  const location = useLocation();
  const navigate = useNavigate();

  // State passed from CarDetails, or re-fetch
  const passed = location.state || {};
  const [car, setCar] = useState(passed.car || null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(!passed.car);
  const [submitting, setSubmitting] = useState(false);

  const [startDate, setStartDate] = useState(passed.startDate || '');
  const [endDate, setEndDate] = useState(passed.endDate || '');
  const [pickupLocId, setPickupLocId] = useState('');
  const [driverOption, setDriverOption] = useState(passed.hasDriver ? 'driver' : 'self');

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch locations and car if not passed via state
        const [carRes, locRes] = await Promise.all([
          car ? Promise.resolve({ data: car }) : API.get(`/cars/${id}`),
          API.get('/locations'),
        ]);
        setCar(carRes.data);
        setLocations(locRes.data);
        
        // Auto-select first location if none selected
        if (locRes.data.length > 0 && !pickupLocId) {
          setPickupLocId(locRes.data[0]._id);
        }
      } catch {
        toast.error('Failed to load booking details');
        navigate('/cars');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [car, id, navigate, pickupLocId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) return null;

  const hasDriver = driverOption === 'driver';
  const rentalHours = calculateRentalHours(startDate, endDate);
  const billedDays = rentalHours / 24;

  // Logic calculation strictly following your business rules
  const baseRate = car.base_rent_per_day || 0;
  const driverFee = hasDriver ? 2500 * billedDays : 0;
  const dynamicAdj = billedDays >= 7 ? -500 : 0; // discount for weekly
  const serviceFee = rentalHours > 0 ? 500 : 0; // Updated to match CarDetails service fee
  const total = (billedDays * baseRate) + driverFee + dynamicAdj + serviceFee;

  const minDateTime = toDateTimeLocalValue();

  const handleConfirm = async () => {
    if (!startDate || !endDate) { toast.error('Please select pickup and return date/time'); return; }
    if (new Date(endDate) <= new Date(startDate)) { toast.error('Return date/time must be after pickup date/time'); return; }
    
    if (!pickupLocId) { toast.error('Please select a pickup location'); return; }

    setSubmitting(true);
    try {
      const bookingPayload = {
        car_id: car._id,
        pickup_location_id: pickupLocId,
        return_location_id: pickupLocId,
        start_date: startDate,
        end_date: endDate,
      };

      const { data } = await API.post('/bookings', bookingPayload);
      toast.success('Reservation request sent!');
      
      // Navigate to checkout/payment step
      navigate(`/checkout`, {
        state: { booking: data.booking || data, car, total: (data.booking || data).total_amount }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Connection to server failed');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedLoc = locations.find((l) => l._id === pickupLocId);

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to={`/cars/${car._id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to car
          </Link>
          <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Step 1 of 2 — Booking details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT: Booking form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Selected car */}
            <div className="glass-card p-5 border-white/10">
              <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-3">Selected Car</p>
              <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center">
                <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                  <img
                    src={car.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400'}
                    className="w-full h-full object-cover"
                    alt={`${car.brand} ${car.model}`}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold">{car.brand} {car.model}</h3>
                  <p className="text-gray-500 text-sm">{car.category} · {car.transmission} · {car.fuel_type}</p>
                  <p className="text-blue-400 text-sm font-semibold mt-1">Rs {baseRate.toLocaleString()}/day</p>
                </div>
              </div>
            </div>

            {/* Booking date and time */}
            <div className="glass-card p-6 border-white/10 space-y-5">
              <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Booking Date & Time</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">Pickup Date & Time</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    min={minDateTime}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 [color-scheme:dark] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">Return Date & Time</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    min={startDate || minDateTime}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 [color-scheme:dark] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Pickup location */}
            <div className="glass-card p-6 border-white/10 space-y-4">
              <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Pickup Location</p>
              <select
                value={pickupLocId}
                onChange={(e) => setPickupLocId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 transition-all appearance-none"
              >
                <option value="" disabled className="bg-[#16161a]">Select your hub</option>
                {locations.length > 0 ? locations.map((loc) => (
                  <option key={loc._id} value={loc._id} className="bg-[#16161a]">
                    {loc.name} — {loc.city}
                  </option>
                )) : (
                   <option className="bg-[#16161a]">Lahore Head Office</option>
                )}
              </select>
              {selectedLoc && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">City</p>
                      <p className="mt-1 text-sm font-bold text-white">{selectedLoc.city}</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Hours</p>
                      <p className="mt-1 text-sm font-bold text-white">{selectedLoc.hours || '24/7 Open'}</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Phone</p>
                      <p className="mt-1 text-sm font-bold text-white">{selectedLoc.phone || 'On request'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <MapPin size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{selectedLoc.address}</span>
                  </div>
                  <OfficeMap location={selectedLoc} />
                </div>
              )}
            </div>

            {/* Driver option */}
            <div className="glass-card p-6 border-white/10 space-y-4">
              <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Driver Option</p>
              <div className="space-y-3">
                {[
                  { val: 'self',   label: 'No driver (self-drive)',      sub: 'You drive the vehicle yourself' },
                  { val: 'driver', label: 'Professional driver',          sub: '+Rs 2,500/day — certified chauffeur' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setDriverOption(opt.val)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all ${
                      driverOption === opt.val
                        ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_0_1px_rgba(59,130,246,0.2)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      driverOption === opt.val ? 'border-blue-500 bg-blue-500' : 'border-gray-600'
                    }`}>
                      {driverOption === opt.val && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${driverOption === opt.val ? 'text-white' : 'text-gray-300'}`}>{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConfirm}
                disabled={submitting || !startDate || !endDate || rentalHours === 0}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
              >
                {submitting ? 'Creating Booking...' : 'Continue to Payment'}
              </button>
              <Link
                to={`/cars/${car._id}`}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-all text-sm text-center border border-white/10"
              >
                ← Back to car
              </Link>
            </div>
          </div>

          {/* RIGHT: Price summary */}
          <div className="lg:col-span-1">
            <div className="glass-card space-y-4 border-white/10 p-6 lg:sticky lg:top-28">
              <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Price Summary</p>

              {rentalHours > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base rate × {rentalHours} hour{rentalHours !== 1 ? 's' : ''}</span>
                    <span className="text-white">Rs {(baseRate * billedDays).toLocaleString()}</span>
                  </div>
                  {hasDriver && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Driver × {rentalHours} hour{rentalHours !== 1 ? 's' : ''}</span>
                      <span className="text-white">Rs {driverFee.toLocaleString()}</span>
                    </div>
                  )}
                  {dynamicAdj !== 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Weekly discount</span>
                      <span className="text-emerald-400">−Rs {Math.abs(dynamicAdj).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service fee</span>
                    <span className="text-white">Rs {serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-white/10">
                    <span className="text-white">Total amount</span>
                    <span className="text-blue-400">Rs {total.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Select dates to see price</p>
              )}

              <p className="text-[10px] text-gray-700 text-center pt-2">
                Payment check opens after creating the booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;
