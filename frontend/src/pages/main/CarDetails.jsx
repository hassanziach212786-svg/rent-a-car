import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { MapPin, Star, ChevronLeft } from '../../components/shared/BootstrapIcons';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { calculateRentalHours, toDateTimeLocalValue } from '../../utils/dateTime';

const BookingSidebar = ({ car, startDate, endDate, setStartDate, setEndDate, hasDriver, setHasDriver }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const rentalHours = calculateRentalHours(startDate, endDate);
  const billedDays = rentalHours / 24;

  const baseRate = car?.base_rent_per_day || 0;
  const driverFee = hasDriver ? 2500 : 0;
  const serviceFee = rentalHours > 0 ? 200 : 0;
  const total = (billedDays * baseRate) + (driverFee * billedDays) + serviceFee;
  const minDateTime = toDateTimeLocalValue();

  const handleBook = () => {
    if (!user) {
      toast.error('Please sign in to book');
      navigate('/login', { state: { from: `/cars/${car._id}` } });
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Please select pickup and return date/time');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      toast.error('Return date/time must be after pickup date/time');
      return;
    }

    navigate(`/booking/${car._id}/confirm`, {
      state: { car, startDate, endDate, hasDriver, rentalHours, billedDays, total },
    });
  };

  return (
    <div className="space-y-4 lg:sticky lg:top-28">
      <div className="glass-card p-6 border-white/10 space-y-5 shadow-2xl">
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold text-white sm:text-3xl">Rs {baseRate.toLocaleString()}</span>
            <span className="text-gray-500 text-sm">/day</span>
          </div>
          {car?.status && (
            <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              car.status === 'available'
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
            }`}
            >
              {car.status === 'available' ? 'Available' : car.status}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Pickup Date & Time</label>
            <input
              type="datetime-local"
              value={startDate}
              min={minDateTime}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 [color-scheme:dark] transition-all"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Return Date & Time</label>
            <input
              type="datetime-local"
              value={endDate}
              min={startDate || minDateTime}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500/50 [color-scheme:dark] transition-all"
            />
          </div>
        </div>

        {car?.location_id && (
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{car.location_id.city || 'Location'}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{car.location_id.address}</p>
              </div>
            </div>
          </div>
        )}

          <div className="flex flex-col gap-3 rounded-xl border border-blue-500/10 bg-blue-600/[0.05] p-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
          <div>
            <p className="text-xs font-bold text-white">Professional Driver</p>
            <p className="text-[11px] text-gray-500 mt-0.5">+Rs 2,500/day</p>
          </div>
          <button
            type="button"
            onClick={() => setHasDriver(!hasDriver)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              hasDriver
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
            }`}
          >
            {hasDriver ? 'Added' : '+ Add'}
          </button>
        </div>

        {rentalHours > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2 pt-2 border-t border-white/5"
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Rental Fee ({rentalHours} hour{rentalHours !== 1 ? 's' : ''})</span>
              <span className="text-white">Rs {(baseRate * billedDays).toLocaleString()}</span>
            </div>
            {hasDriver && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Driver Fee</span>
                <span className="text-white">Rs {(driverFee * billedDays).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Service fee</span>
              <span className="text-white">Rs {serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/5">
              <span className="text-white">Estimated total</span>
              <span className="text-blue-400 text-lg">Rs {total.toLocaleString()}</span>
            </div>
          </motion.div>
        )}

        <button
          type="button"
          onClick={handleBook}
          disabled={car?.status !== 'available'}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
        >
          {car?.status === 'available' ? 'Confirm Booking' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
};

const StarRating = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-sm ${star <= value ? 'text-yellow-400' : 'text-white/10'}`}>
        *
      </span>
    ))}
  </div>
);

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchDates = location.state || {};
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({ averageRating: 0, numReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [hasDriver, setHasDriver] = useState(false);
  const [startDate, setStartDate] = useState(searchDates.startDate || '');
  const [endDate, setEndDate] = useState(searchDates.endDate || '');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAll = async () => {
      try {
        const [carRes, revRes] = await Promise.all([
          API.get(`/cars/${id}`),
          API.get(`/reviews/car/${id}`).catch(() => ({ data: { reviews: [] } })),
        ]);

        setCar(carRes.data);
        const reviewData = Array.isArray(revRes.data) ? { reviews: revRes.data } : revRes.data;
        setReviews(reviewData.reviews || []);
        setReviewSummary({
          averageRating: reviewData.averageRating || 0,
          numReviews: reviewData.numReviews || reviewData.reviews?.length || 0,
        });
      } catch {
        toast.error('Failed to load car details');
        navigate('/cars');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!car) return null;

  const images = car.images?.length ? car.images : [car.image].filter(Boolean);
  const avgRating = reviewSummary.averageRating
    ? reviewSummary.averageRating.toFixed(1)
    : reviews.length
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : null;

  const specs = [
    { label: 'Engine', val: car.engine || 'V8 Twin Turbo' },
    { label: 'Transmission', val: car.transmission || 'Automatic' },
    { label: 'Fuel', val: car.fuel_type || 'Premium' },
    { label: 'Seats', val: car.seating_capacity || car.seats || '2' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <Link to="/cars" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <div className="relative h-[260px] overflow-hidden rounded-2xl border border-white/5 bg-white/5 min-[420px]:h-[320px] md:h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={images[activeImg]}
                    className="w-full h-full object-cover"
                    alt={`${car.brand} ${car.model}`}
                  />
                </AnimatePresence>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    type="button"
                    key={img || index}
                    onClick={() => setActiveImg(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === index ? 'border-blue-500' : 'border-white/10 opacity-50'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`${car.brand} ${car.model} thumbnail`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">{car.brand} {car.model}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-4">
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star size={14} fill="currentColor" /> {avgRating || 'New'}
                  </span>
                  <span className="text-gray-500">-</span>
                  <span className="text-gray-400">{car.year} Model</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-4 md:gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="glass-card p-4 border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">{spec.label}</p>
                    <p className="text-white text-sm font-medium mt-1">{spec.val}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">About this vehicle</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {car.description || 'Experience luxury and performance with this premium vehicle. Meticulously maintained and ready for your next journey.'}
                </p>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">Guest Reviews</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {reviewSummary.numReviews || reviews.length} review{(reviewSummary.numReviews || reviews.length) === 1 ? '' : 's'}
                      {avgRating ? ` - ${avgRating} average rating` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        toast.error('Please sign in to write a review');
                        navigate('/login', { state: { from: `/cars/${id}` } });
                        return;
                      }
                      navigate(`/review/${id}`);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-400 transition-colors hover:bg-blue-500/20"
                  >
                    <Star size={13} />
                    Write Review
                  </button>
                </div>
                <div className="grid gap-4">
                  {reviews.length > 0 ? reviews.map((review) => (
                    <div key={review._id} className="glass-card border-white/5 p-4 sm:p-5">
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <span className="text-white font-bold text-sm">{review.user_id?.name || 'Verified User'}</span>
                        <StarRating value={review.rating} />
                      </div>
                      <p className="text-gray-400 text-sm italic">"{review.comment}"</p>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-sm">No reviews yet for this vehicle.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingSidebar
              car={car}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              hasDriver={hasDriver}
              setHasDriver={setHasDriver}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
