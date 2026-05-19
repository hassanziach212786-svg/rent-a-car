import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CarCard } from '../../components/shared/Display';
import { SkeletonCard } from '../../components/skeletons/Loaders';
import { SlidersHorizontal, Info, X, MapPin, Calendar } from 'lucide-react';
import API from '../../api/axios';
import { formatDateTime } from '../../utils/dateTime';

const CATEGORIES = ['All', 'Luxury', 'SUV', 'Sedan', 'Sports'];

const getCarCategory = (car) => {
  if (car.category) return car.category;

  const text = `${car.brand || ''} ${car.model || ''}`.toLowerCase();
  const matches = (words) => words.some((word) => text.includes(word));

  if (matches(['suv', 'range rover', 'land cruiser', 'fortuner', 'prado', 'crossover'])) return 'SUV';
  if (matches(['sports', 'mustang', 'camaro', 'corvette', 'porsche', 'ferrari', 'lamborghini', 'coupe'])) return 'Sports';
  if (matches(['mercedes', 'bmw', 'audi', 'lexus', 'bentley', 'rolls', 'jaguar'])) return 'Luxury';
  if (matches(['sedan', 'civic', 'corolla', 'accord', 'camry', 'elantra', 'sonata', 'city'])) return 'Sedan';

  return 'Luxury';
};

const matchesSearch = (car, searchTerm) => {
  if (!searchTerm) return true;

  const searchable = [
    car.brand,
    car.model,
    car.year,
    car.status,
    car.location_id?.name,
    car.location_id?.city,
    getCarCategory(car),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchable.includes(searchTerm.toLowerCase());
};

const Fleet = () => {
  const navigate = useNavigate();
  const { state, search } = useLocation(); // Read filters from SearchPanel state and URL params
  const urlFilters = useMemo(() => {
    const params = new URLSearchParams(search);

    return {
      city: params.get('city') || '',
      startDate: params.get('startDate') || '',
      endDate: params.get('endDate') || '',
      search: params.get('search') || '',
    };
  }, [search]);
  const passedFilters = state?.filters || {};

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Active search filters (city + dates from SearchPanel)
  const [activeFilters, setActiveFilters] = useState({
    city: urlFilters.city || passedFilters.city || '',
    startDate: urlFilters.startDate || passedFilters.startDate || '',
    endDate: urlFilters.endDate || passedFilters.endDate || '',
    search: urlFilters.search || passedFilters.search || '',
  });

  // Build query string and fetch — city is sent to backend as query param
  const fetchCars = useCallback(async (filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city && filters.city !== 'Select City') {
        params.append('city', filters.city);
      }
      // status=available ensures we only show bookable cars
      params.append('status', 'available');
      if (filters.startDate && filters.endDate) {
        params.append('startDate', filters.startDate);
        params.append('endDate', filters.endDate);
      }

      const res = await API.get(`/cars?${params.toString()}`);
      setCars(res.data);
    } catch (err) {
      console.error('Error fetching fleet', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load (and whenever activeFilters change from a new search)
  useEffect(() => {
    fetchCars(activeFilters);
  }, [activeFilters, fetchCars]);

  useEffect(() => {
    setActiveFilters({
      city: urlFilters.city || passedFilters.city || '',
      startDate: urlFilters.startDate || passedFilters.startDate || '',
      endDate: urlFilters.endDate || passedFilters.endDate || '',
      search: urlFilters.search || passedFilters.search || '',
    });
  }, [urlFilters, passedFilters.city, passedFilters.endDate, passedFilters.search, passedFilters.startDate]);

  const clearFilters = () => {
    setActiveFilters({ city: '', startDate: '', endDate: '', search: '' });
    setCategoryFilter('All');
    navigate('/cars', { replace: true });
  };

  // Client-side category filter on top of API results
  const filteredCars = cars.filter(
    (car) =>
      (categoryFilter === 'All' || getCarCategory(car).toLowerCase() === categoryFilter.toLowerCase()) &&
      matchesSearch(car, activeFilters.search)
  );

  const hasActiveSearchFilters =
    activeFilters.city || activeFilters.startDate || activeFilters.endDate || activeFilters.search;

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-32 pb-20 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-[2px] bg-blue-600" />
            <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px]">
              Premium Collection
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Explore Our{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                  Fleet
                </span>
              </h1>
              <p className="text-gray-500 max-w-xl leading-relaxed">
                Experience the pinnacle of automotive excellence. From executive sedans to
                high-performance sports cars, find the perfect match for your journey.
              </p>
            </motion.div>

            {/* Category filter pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex w-full items-center gap-2 overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.03] p-1.5 backdrop-blur-md lg:w-auto"
            >
              <div className="px-3 text-gray-500 border-r border-white/10 hidden sm:block">
                <SlidersHorizontal size={16} />
              </div>
              <div className="flex min-w-max gap-1 sm:min-w-0 sm:flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 sm:px-6 ${
                      categoryFilter === cat
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Active Search Filter Badge ── */}
        <AnimatePresence>
          {hasActiveSearchFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 flex flex-wrap items-center gap-3"
            >
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                Showing results for:
              </span>

              {activeFilters.city && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  <MapPin size={11} /> {activeFilters.city}
                </span>
              )}

              {activeFilters.search && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  <SlidersHorizontal size={11} /> {activeFilters.search}
                </span>
              )}

              {activeFilters.startDate && activeFilters.endDate && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                  <Calendar size={11} />
                  {formatDateTime(activeFilters.startDate)} → {formatDateTime(activeFilters.endDate)}
                </span>
              )}

              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-colors"
              >
                <X size={11} /> Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Car Grid ── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={`skeleton-${i}`}>
                  <SkeletonCard />
                </div>
              ))
            ) : filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <motion.div
                  key={car._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Pass dates so BookingConfirm can pre-fill them */}
                  <CarCard
                    car={car}
                    searchDates={{
                      startDate: activeFilters.startDate,
                      endDate: activeFilters.endDate,
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Info className="text-blue-500" size={32} />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">No Vehicles Found</h3>
                <p className="mx-auto max-w-md px-4 text-gray-500">
                  {hasActiveSearchFilters
                    ? `No ${categoryFilter === 'All' ? '' : categoryFilter + ' '}cars available in ${activeFilters.city || 'the selected area'} for those dates.`
                    : `We couldn't find any ${categoryFilter} cars in our fleet right now.`}
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 text-blue-500 font-bold text-sm hover:underline"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Fleet;
