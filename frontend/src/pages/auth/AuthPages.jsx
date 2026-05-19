import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Eye, EyeOff, Car } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const getStrength = (pw) => {
  if (!pw) return null;

  let score = 0;
  if (pw.length >= 6) score += 1;
  if (pw.length >= 10) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^a-zA-Z0-9]/.test(pw)) score += 1;

  const levels = [
    null,
    { label: 'Weak', className: 'bg-red-500', bars: 1 },
    { label: 'Fair', className: 'bg-amber-500', bars: 2 },
    { label: 'Good', className: 'bg-yellow-400', bars: 3 },
    { label: 'Strong', className: 'bg-emerald-500', bars: 4 },
    { label: 'Very Strong', className: 'bg-emerald-400', bars: 5 },
  ];

  return levels[score];
};

const Field = ({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  showEye,
  eyeOpen,
  onToggleEye,
}) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-2">
      {label}
    </label>
    <div className="relative group">
      <Icon
        size={15}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-blue-400 transition-colors"
      />
      <input
        type={showEye ? (eyeOpen ? 'text' : 'password') : type}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        className="glass-input w-full pl-11 pr-10 text-sm"
      />
      {showEye && (
        <button
          type="button"
          onClick={onToggleEye}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-300 transition-colors"
        >
          {eyeOpen ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  </div>
);

const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const strength = getStrength(form.password);

  const handle = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
      if (form.password !== form.confirm) return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      if (isLogin) {
        const result = await login({ email: form.email, password: form.password });
        if (result.success) {
          toast.success('Welcome back!');
          navigate(result.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });

        if (result.success) {
          toast.success('Account created! Welcome');
          navigate('/dashboard');
        } else {
          toast.error(result.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin((prev) => !prev);
    setForm({ name: '', email: '', phone: '', password: '', confirm: '' });
    setShowPw(false);
  };

  const bullets = isLogin
    ? ['Track all your rentals', 'Instant booking confirmation', 'Manage payments easily']
    : ['500+ verified vehicles', 'Book in under 2 minutes', 'Cancel anytime - no penalty'];

  return (
    <div className="min-h-screen flex bg-[#0a0a0c]">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="hidden lg:flex flex-col justify-between w-[42%] bg-surface-1 border-r border-white/[0.04] p-14 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/6 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-blue-500/15 to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-blue-glow-sm">
            <Car size={17} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">
            Drive<span className="text-gradient">Ease</span>
          </span>
        </div>

        <div className="relative space-y-8">
          <div>
            <div className="w-10 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-5" />
            <h2 className="font-display font-bold text-4xl text-white leading-snug whitespace-pre-line">
              {isLogin ? 'Good to have\nyou back.' : 'Start your\npremium journey.'}
            </h2>
          </div>

          <div className="space-y-4">
            {bullets.map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-600/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <span className="text-gray-500 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-gray-800 text-xs">&copy; {new Date().getFullYear()} DriveEase</p>
      </motion.div>

      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="w-full max-w-md py-8"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Car size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              Drive<span className="text-gradient">Ease</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: isLogin ? -12 : 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 12 : -12 }}
              transition={{ duration: 0.22 }}
            >
              <h2 className="font-display font-bold text-3xl text-white mb-1">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-gray-600 text-sm mb-8">
                {isLogin ? 'Sign in to access your dashboard' : 'Join DriveEase and start renting'}
              </p>

              <form onSubmit={handle} className="space-y-4">
                {!isLogin && (
                  <>
                    <Field label="Full Name" icon={User} placeholder="Ahmad Raza" value={form.name} onChange={set('name')} />
                    <Field label="Phone Number" icon={Phone} placeholder="+92 3XX XXXXXXX" value={form.phone} onChange={set('phone')} type="tel" />
                  </>
                )}

                <Field label="Email Address" icon={Mail} placeholder="you@example.com" value={form.email} onChange={set('email')} type="email" />

                <div>
                  <Field
                    label="Password"
                    icon={Lock}
                    placeholder={isLogin ? 'Password' : 'Min 6 characters'}
                    value={form.password}
                    onChange={set('password')}
                    showEye
                    eyeOpen={showPw}
                    onToggleEye={() => setShowPw((prev) => !prev)}
                  />
                  {!isLogin && form.password && strength && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-0.5 flex-1 rounded-full transition-all ${
                              i <= strength.bars ? strength.className : 'bg-surface-4'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">{strength.label}</p>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <Field
                    label="Confirm Password"
                    icon={Lock}
                    placeholder="Repeat password"
                    value={form.confirm}
                    onChange={set('confirm')}
                    showEye
                    eyeOpen={showPw}
                    onToggleEye={() => setShowPw((prev) => !prev)}
                  />
                )}

                {isLogin && (
                  <div className="text-right -mt-1">
                    <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }} className="btn-primary w-full py-4 mt-2 group text-base">
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              {!isLogin && (
                <p className="text-center text-xs text-gray-700 mt-4">
                  By registering you agree to our{' '}
                  <a href="#" className="text-blue-400 hover:underline">Terms</a> and{' '}
                  <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                </p>
              )}

              <div className="divider-label mt-7">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </div>

              <button onClick={switchMode} className="btn-outline w-full py-3.5 text-sm">
                {isLogin ? 'Create an account' : 'Sign in instead'}
              </button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPages;
