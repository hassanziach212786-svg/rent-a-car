import { motion } from 'framer-motion';

export const StatsCard = ({ title, value, icon, trend, trendValue, color = "blue" }) => {
  // Mapping colors for variety (e.g., revenue in emerald, users in blue)
  const colorMap = {
    blue: "text-blue-500 bg-blue-600/10 border-blue-500/20",
    emerald: "text-emerald-500 bg-emerald-600/10 border-emerald-500/20",
    purple: "text-purple-500 bg-purple-600/10 border-purple-500/20",
    amber: "text-amber-500 bg-amber-600/10 border-amber-500/20",
  };

  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card p-6 border border-white/5 relative overflow-hidden group cursor-default"
    >
      {/* Ghost Icon Background */}
      <div className="absolute -right-4 -top-4 text-7xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">
        {icon}
      </div>
      
      <div className="flex justify-between items-start mb-6">
        {/* Active Icon Icon */}
        <div className={`p-3 rounded-2xl text-2xl border ${colorMap[color] || colorMap.blue}`}>
          {icon}
        </div>

        {/* Dynamic Trend Badge */}
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
            trend === 'up' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            <span>{trend === 'up' ? '▲' : '▼'}</span>
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-white tabular-nums tracking-tight">
          {value}
        </h3>
      </div>

      {/* Decorative Progress bar - subtle touch */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/[0.02]">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full opacity-30 ${
            color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
          }`}
        />
      </div>
    </motion.div>
  );
};