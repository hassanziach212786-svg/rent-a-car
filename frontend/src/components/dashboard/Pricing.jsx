export const BookingSummary = ({ days, hasDriver, basePrice }) => {
  const serviceFee = 200;
  const driverFee = hasDriver ? 1500 * days : 0;
  const total = (basePrice * days) + serviceFee + driverFee;

  return (
    <div className="glass-card p-6 border-white/10 sticky top-32">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>Receipt</span>
        <div className="h-px flex-1 bg-white/10" />
      </h3>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">${basePrice} x {days} days</span>
          <span className="text-white font-medium">${basePrice * days}</span>
        </div>
        
        {hasDriver && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Professional Driver</span>
            <span className="text-white font-medium">${driverFee}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Service Fee</span>
          <span className="text-white font-medium">${serviceFee}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-between items-end mb-8">
        <div>
          <p className="text-[10px] uppercase font-bold text-blue-500">Total Amount</p>
          <h2 className="text-3xl font-bold text-white">${total}</h2>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
        Confirm & Pay Now
      </button>
    </div>
  );
};
