const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
);

export const SkeletonCard = () => (
  <div className="glass-card p-4 space-y-4 overflow-hidden relative">
    <div className="h-48 w-full bg-white/5 rounded-xl" />
    <div className="h-6 w-3/4 bg-white/5 rounded-md" />
    <div className="flex justify-between">
      <div className="h-4 w-1/4 bg-white/5 rounded-md" />
      <div className="h-4 w-1/4 bg-white/5 rounded-md" />
    </div>
    <Shimmer />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="w-full space-y-4 relative overflow-hidden">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-12 w-full bg-white/5 rounded-lg border border-white/5" />
    ))}
    <Shimmer />
  </div>
);

// Add this to your Loaders.jsx
export const PageLoader = () => (
  <div className="fixed inset-0 bg-[#0a0a0c] flex flex-col items-center justify-center z-[100]">
    {/* A premium spinning loader */}
    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
    <p className="text-blue-500 font-bold tracking-widest text-xs uppercase animate-pulse">
      Securing Connection...
    </p>
    <Shimmer />
  </div>
);