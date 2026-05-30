import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Search, X } from './BootstrapIcons';
import API from '../../api/axios';
import { toDateTimeLocalValue } from '../../utils/dateTime';

const FALLBACK_CITIES = ['Lahore', 'Islamabad', 'Karachi', 'Multan'];

export const SearchPanel = ({ onSearch }) => {
  const minDateTime = toDateTimeLocalValue();

  const [searchData, setSearchData] = useState({
    city: '',
    startDate: '',
    endDate: '',
  });
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await API.get('/locations');
        const uniqueCities = [...new Set(res.data.map((loc) => loc.city).filter(Boolean))].sort();

        if (uniqueCities.length) {
          setCities(uniqueCities);
        }
      } catch (err) {
        console.error('Error fetching search cities', err);
      }
    };

    fetchCities();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!searchData.city) newErrors.city = 'Select a city';
    if (!searchData.startDate) newErrors.startDate = 'Pick pickup time';
    if (!searchData.endDate) newErrors.endDate = 'Pick return time';
    if (
      searchData.startDate &&
      searchData.endDate &&
      new Date(searchData.endDate) <= new Date(searchData.startDate)
    ) {
      newErrors.endDate = 'Must be after pickup';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (validate()) onSearch(searchData);
  };

  const handleClear = () => {
    setSearchData({ city: '', startDate: '', endDate: '' });
    setErrors({});
  };

  const hasValues = searchData.city || searchData.startDate || searchData.endDate;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative z-20 mx-auto -mt-10 w-full max-w-7xl px-3 sm:-mt-16 sm:px-6"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0d12]/95 shadow-[0_28px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:rounded-[1.75rem]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/70 to-transparent" />
        {/* Top bar label */}
        <div className="flex flex-col gap-3 px-4 pb-3 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#c9a96e] sm:tracking-[0.32em]">
              Find Your Ride
            </span>
            <p className="mt-1 text-sm text-gray-500">Choose your city and rental window.</p>
          </div>
          {hasValues && (
            <button
              onClick={handleClear}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 transition-colors hover:border-white/20 hover:text-white"
            >
              <X size={10} /> Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 px-3 pb-4 sm:px-6 sm:pb-6 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr_0.8fr] lg:gap-2">

          {/* City */}
          <div className="flex min-h-[76px] flex-col justify-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 transition-colors focus-within:border-[#c9a96e]/50 focus-within:bg-white/[0.055] sm:min-h-[86px]">
            <span
              className={`text-[9px] uppercase font-bold tracking-[0.18em] flex items-center gap-1.5 ${
                errors.city ? 'text-red-400' : 'text-[#c9a96e]'
              }`}
            >
              <MapPin size={9} /> {errors.city || 'Pick-up City'}
            </span>
            <select
              className="min-h-8 w-full min-w-0 cursor-pointer bg-transparent text-base font-semibold text-white outline-none"
              value={searchData.city}
              onChange={(e) => {
                setSearchData({ ...searchData, city: e.target.value });
                setErrors((p) => ({ ...p, city: undefined }));
              }}
            >
              <option className="bg-[#16161a]" value="">Select City</option>
              {cities.map((c) => (
                <option key={c} className="bg-[#16161a]" value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Start Date & Time */}
          <div className="flex min-h-[76px] flex-col justify-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 transition-colors focus-within:border-[#c9a96e]/50 focus-within:bg-white/[0.055] sm:min-h-[86px]">
            <span
              className={`text-[9px] uppercase font-bold tracking-[0.18em] flex items-center gap-1.5 ${
                errors.startDate ? 'text-red-400' : 'text-[#c9a96e]'
              }`}
            >
              <Calendar size={9} /> {errors.startDate || 'Pickup Date & Time'}
            </span>
            <input
              type="datetime-local"
              min={minDateTime}
              className="min-h-8 w-full min-w-0 bg-transparent text-sm font-semibold text-white outline-none [color-scheme:dark]"
              value={searchData.startDate}
              onChange={(e) => {
                const val = e.target.value;
                // Auto-clear endDate if it becomes invalid
                const newEnd =
                  searchData.endDate && new Date(searchData.endDate) <= new Date(val)
                    ? ''
                    : searchData.endDate;
                setSearchData({ ...searchData, startDate: val, endDate: newEnd });
                setErrors((p) => ({ ...p, startDate: undefined, endDate: undefined }));
              }}
            />
          </div>

          {/* End Date & Time */}
          <div className="flex min-h-[76px] flex-col justify-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-4 py-3 transition-colors focus-within:border-[#c9a96e]/50 focus-within:bg-white/[0.055] sm:min-h-[86px]">
            <span
              className={`text-[9px] uppercase font-bold tracking-[0.18em] flex items-center gap-1.5 ${
                errors.endDate ? 'text-red-400' : 'text-[#c9a96e]'
              }`}
            >
              <Calendar size={9} /> {errors.endDate || 'Return Date & Time'}
            </span>
            <input
              type="datetime-local"
              min={searchData.startDate || minDateTime}
              className="min-h-8 w-full min-w-0 bg-transparent text-sm font-semibold text-white outline-none [color-scheme:dark]"
              value={searchData.endDate}
              onChange={(e) => {
                setSearchData({ ...searchData, endDate: e.target.value });
                setErrors((p) => ({ ...p, endDate: undefined }));
              }}
            />
          </div>

          {/* Search Button */}
          <div className="flex items-stretch">
            <button
              onClick={handleSearch}
              className="group flex min-h-[58px] w-full items-center justify-center gap-2 rounded-2xl bg-[#c9a96e] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#08090c] shadow-[0_18px_45px_rgba(201,169,110,0.22)] transition-all hover:bg-[#d8bb83] active:scale-[0.98] sm:min-h-[86px] sm:tracking-[0.16em]"
            >
              <Search size={15} className="group-hover:scale-110 transition-transform" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
