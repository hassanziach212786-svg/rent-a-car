// src/components/shared/Display.jsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Fuel, Settings, Users, Star } from './BootstrapIcons';

export const CarCard = ({ car, searchDates }) => {
  const navigate = useNavigate();
  const handleOpen = () => {
    navigate(`/cars/${car._id}`, { state: searchDates || {} });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      viewport={{ once: true }}
      className="glass-card group overflow-hidden border-white/5 hover:border-blue-500/30 transition-all duration-500 cursor-pointer"
      onClick={handleOpen}
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={car.image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
          <span className="text-xs font-black text-blue-400 uppercase tracking-tighter">
            Rs {car.base_rent_per_day?.toLocaleString()}<span className="text-[10px] text-gray-400 font-medium lowercase">/day</span>
          </span>
        </div>
        {car.category && (
          <div className="absolute bottom-3 left-3 bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-widest">
            {car.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {car.brand} {car.model}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 mt-1">
            <MapPin size={12} className="text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Available Nationwide</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 border-y border-white/5 py-3">
          <div className="text-center">
            <Fuel size={14} className="mx-auto text-gray-600 mb-1" />
            <p className="text-[9px] font-bold text-gray-400 uppercase">{car.fuel_type || 'Petrol'}</p>
          </div>
          <div className="text-center border-x border-white/5">
            <Settings size={14} className="mx-auto text-gray-600 mb-1" />
            <p className="text-[9px] font-bold text-gray-400 uppercase">{car.transmission || 'Auto'}</p>
          </div>
          <div className="text-center">
            <Users size={14} className="mx-auto text-gray-600 mb-1" />
            <p className="text-[9px] font-bold text-gray-400 uppercase">{car.seats || 4} Seats</p>
          </div>
        </div>

        <button className="w-full py-3 bg-white/5 hover:bg-blue-600 transition-all rounded-xl text-xs font-bold border border-white/10 group-hover:border-blue-500">
          Experience Luxury
        </button>
      </div>
    </motion.div>
  );
};

export const ReviewCard = ({ review }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    className="glass-card p-6 border-white/5 space-y-4"
  >
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-blue-400 font-bold">
          {(review.user_id?.name || review.user || 'G')[0]}
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">{review.user_id?.name || review.user}</h4>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent Guest'}
          </p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={12} 
            fill={i < (review.rating || 5) ? "#facc15" : "none"} 
            className={i < (review.rating || 5) ? "text-yellow-400" : "text-white/10"} 
          />
        ))}
      </div>
    </div>
    
    <p className="text-gray-400 text-sm leading-relaxed italic">
      "{review.comment || "An exceptional rental experience from start to finish."}"
    </p>

    <div className="pt-4 border-t border-white/5 flex items-center gap-2">
      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
      <span className="text-[10px] font-bold text-gray-700 uppercase">Verified DriveEase Client</span>
    </div>
  </motion.div>
);
