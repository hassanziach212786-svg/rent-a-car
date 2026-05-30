import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, CheckCircle2, MessageSquare, Send, Star } from '../../components/shared/BootstrapIcons';
import { toast } from 'react-hot-toast';
import API from '../../api/axios';

const ratingLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent',
};

const ReviewPage = () => {
  const { carId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await API.get(`/cars/${carId}`);
        setCar(data);
      } catch {
        toast.error('Unable to load car for review');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error('Please write a short review');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Review should be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      await API.post('/reviews', {
        car_id: carId,
        rating,
        comment: comment.trim(),
      });

      toast.success('Review submitted successfully');
      navigate(`/cars/${carId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] pt-32 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-28 pb-20">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden border-white/10"
          >
            <div className="relative h-72 bg-surface-2">
              <img
                src={car?.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000'}
                alt={`${car?.brand || 'Rental'} ${car?.model || 'car'}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
            </div>
            <div className="p-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                <Car size={12} />
                Completed trip
              </div>
              <h1 className="text-3xl font-bold text-white">
                Review {car?.brand} {car?.model}
              </h1>
              <p className="mt-3 text-sm leading-7 text-gray-500">
                Share how the car felt, how clean it was, and whether the handoff experience met your expectations.
              </p>
              {state?.bookingId && (
                <p className="mt-4 text-[11px] text-gray-700">
                  Booking reference: <span className="text-gray-500">{state.bookingId}</span>
                </p>
              )}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            onSubmit={handleSubmit}
            className="glass-card border-white/10 p-6 md:p-8"
          >
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2 text-blue-400">
                <MessageSquare size={17} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Your review</span>
              </div>
              <h2 className="text-2xl font-bold text-white">How was your rental?</h2>
              <p className="mt-2 text-sm text-gray-500">
                Reviews help other customers choose the right car with confidence.
              </p>
            </div>

            <div className="mb-7">
              <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-gray-600">
                Rating
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="rounded-xl p-1 text-yellow-400 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400/30"
                        aria-label={`${star} star rating`}
                      >
                        <Star size={30} fill={active ? 'currentColor' : 'none'} className={active ? 'text-yellow-400' : 'text-white/15'} />
                      </button>
                    );
                  })}
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-300">
                  {ratingLabels[hoverRating || rating]}
                </span>
              </div>
            </div>

            <div className="mb-7">
              <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-gray-600">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={7}
                maxLength={600}
                placeholder="Tell others about the car condition, comfort, pickup, and overall experience..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#111115] px-4 py-4 text-sm leading-7 text-white outline-none transition-all placeholder:text-gray-700 focus:border-blue-500/45 focus:ring-4 focus:ring-blue-500/10"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-700">
                <span>Minimum 10 characters</span>
                <span>{comment.length}/600</span>
              </div>
            </div>

            <div className="mb-7 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.06] p-4">
              <div className="flex gap-3">
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-emerald-400" />
                <p className="text-sm leading-7 text-gray-400">
                  Only completed bookings can be reviewed, and each customer can review a car once.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-blue-glow-sm transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
