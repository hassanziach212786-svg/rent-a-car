import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/common/Buttons';
import API from '../../api/axios';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, car, total } = location.state || {};

  const [step, setStep] = useState('payment');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [screenshot, setScreenshot] = useState(null);

  const payableAmount = total || booking?.total_amount || 0;
  const requiresScreenshot = paymentMethod !== 'Cash';

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!booking?._id) {
      toast.error('Please create a booking before submitting payment');
      navigate('/cars');
      return;
    }

    if (requiresScreenshot && !screenshot) {
      toast.error('Please upload your payment screenshot');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('booking_id', booking._id);
      formData.append('payment_method', paymentMethod);
      formData.append('amount', payableAmount);
      if (screenshot) {
        formData.append('payment_screenshot', screenshot);
      }

      await API.post('/payments/submit', formData);
      toast.success('Payment submitted for admin approval');
      setStep('success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {step === 'payment' ? (
            <motion.div
              key="pay"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-2 space-y-8">
                <div className="glass-card border-white/10 p-5 sm:p-8">
                  <h2 className="mb-6 flex flex-wrap items-center gap-3 text-xl font-bold sm:mb-8 sm:text-2xl">
                    <span className="text-blue-500">01</span> Payment Check
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Cash', 'JazzCash', 'Easypaisa'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-xl border px-4 py-4 text-left transition-all ${
                          paymentMethod === method
                            ? 'border-blue-500/50 bg-blue-600/10 text-white'
                            : 'border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <span className="block text-sm font-bold">{method}</span>
                        <span className="mt-1 block text-[11px] text-gray-500">
                          {method === 'Cash' ? 'Pay at pickup' : 'Upload transfer proof'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card border-white/10 p-5 sm:p-8">
                  <h2 className="mb-6 flex flex-wrap items-center gap-3 text-xl font-bold sm:mb-8 sm:text-2xl">
                    <span className="text-blue-500">02</span> Payment Proof
                  </h2>
                  <form onSubmit={handlePayment} className="space-y-6">
                    {requiresScreenshot ? (
                      <label className="block rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 cursor-pointer hover:border-blue-500/40 transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                          className="sr-only"
                        />
                        <div className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center">
                          <div className="h-12 w-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                            <UploadCloud size={22} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white">
                              {screenshot ? screenshot.name : 'Upload payment screenshot'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              JPG or PNG transfer proof for {paymentMethod}.
                            </p>
                          </div>
                        </div>
                      </label>
                    ) : (
                      <div className="p-5 bg-amber-500/5 rounded-xl border border-amber-500/20">
                        <p className="text-sm font-bold text-white">Cash payment selected</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Your booking will be sent for approval. No screenshot is required for cash.
                        </p>
                      </div>
                    )}

                    <div className="p-4 bg-blue-600/5 rounded-xl border border-blue-500/20">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-400">Amount to verify</p>
                      <p className="mt-1 text-2xl font-bold text-white">Rs {payableAmount.toLocaleString()}</p>
                    </div>

                    <Button className="w-full py-4" disabled={loading}>
                      {loading ? 'Submitting Payment...' : 'Submit Payment Check'}
                    </Button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="glass-card space-y-4 border-white/10 p-5 sm:p-6 lg:sticky lg:top-28">
                  <p className="text-[10px] uppercase font-bold text-gray-600 tracking-widest">Booking Summary</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Booking Ref</span>
                      <span className="text-white font-mono">#{booking?._id?.slice(-6).toUpperCase() || 'NEW'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Vehicle</span>
                      <span className="text-white text-right">{car ? `${car.brand} ${car.model}` : 'Selected vehicle'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Status</span>
                      <span className="text-amber-400 font-bold">Pending Payment</span>
                    </div>
                    <div className="flex justify-between gap-4 pt-3 border-t border-white/10 text-base font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-blue-400">Rs {payableAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center py-20"
            >
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                OK
              </div>
              <h1 className="mb-4 font-display text-3xl font-bold text-white sm:text-4xl">Payment Submitted</h1>
              <p className="text-gray-400 mb-10">
                Your booking is waiting for admin approval. You can track the status from your dashboard.
              </p>

              <div className="glass-card p-6 border-white/10 mb-10 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Booking Ref:</span>
                  <span className="text-white font-mono">#{booking?._id?.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Vehicle:</span>
                  <span className="text-white">{car ? `${car.brand} ${car.model}` : 'Selected vehicle'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="text-amber-400 font-bold">Payment Submitted</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard" className="flex-1">
                  <Button variant="primary" className="w-full">Go to Dashboard</Button>
                </Link>
                <Link to="/cars" className="flex-1">
                  <Button variant="outline" className="w-full">Browse Cars</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;
