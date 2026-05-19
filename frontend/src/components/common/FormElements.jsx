export const Input = ({ label, error, ...props }) => (
  <div className="w-full space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>}
    <div className="relative">
      <input
        className={`w-full bg-[#16161a] border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-gray-600`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
  </div>
);