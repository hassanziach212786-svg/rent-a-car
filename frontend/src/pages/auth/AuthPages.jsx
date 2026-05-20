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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9]{11}$/;

const validateAuthForm = (form, isLogin) => {
  const nextErrors = {};
  const email = form.email.trim();
  const password = form.password;

  if (!email) {
    nextErrors.email = 'Email is required';
  } else if (!emailPattern.test(email)) {
    nextErrors.email = 'Enter a valid email address';
  }

  if (!password) {
    nextErrors.password = 'Password is required';
  }

  if (!isLogin) {
    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name) {
      nextErrors.name = 'Full name is required';
    } else if (name.length < 2) {
      nextErrors.name = 'Name must be at least 2 characters';
    } else if (name.length > 80) {
      nextErrors.name = 'Name must be 80 characters or less';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
      nextErrors.name = 'Name can only include letters, spaces, apostrophes, dots, and hyphens';
    }

    if (!phone) {
      nextErrors.phone = 'Phone number is required';
    } else if (!phonePattern.test(phone)) {
      nextErrors.phone = 'Phone number must be exactly 11 digits';
    }

    if (!password) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    } else if (password.length > 72) {
      nextErrors.password = 'Password must be 72 characters or less';
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      nextErrors.password = 'Password must include letters and numbers';
    }

    if (!form.confirm) {
      nextErrors.confirm = 'Please confirm your password';
    } else if (password !== form.confirm) {
      nextErrors.confirm = 'Passwords do not match';
    }
  }

  return nextErrors;
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
  error,
  onBlur,
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
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        className={`glass-input w-full pl-11 pr-10 text-sm ${
          error ? 'border-red-500/60 focus:border-red-400' : ''
        }`}
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
    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
  </div>
);

const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const nextForm = { ...prev, [key]: value };
      if (touched[key] || errors[key]) {
        setErrors(validateAuthForm(nextForm, isLogin));
      }
      return nextForm;
    });
  };
  const markTouched = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validateAuthForm(form, isLogin));
  };
  const strength = getStrength(form.password);

  const handle = async (e) => {
    e.preventDefault();

    const nextErrors = validateAuthForm(form, isLogin);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, phone: true, password: true, confirm: true });

    if (Object.keys(nextErrors).length > 0) {
      const firstError = Object.values(nextErrors)[0];
      toast.error(firstError);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const result = await login({ email: form.email.trim(), password: form.password });
        if (result.success) {
          toast.success('Welcome back!');
          navigate(result.role === 'admin' ? '/admin' : '/dashboard');
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await register({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
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
    setErrors({});
    setTouched({});
    setShowPw(false);
  };

  const bullets = isLogin
    ? ['Track all your rentals', 'Instant booking confirmation', 'Manage payments easily']
    : ['500+ verified vehicles', 'Book in under 2 minutes', 'Cancel anytime - no penalty'];

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] pt-24 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="relative hidden w-[42%] flex-col justify-between overflow-hidden border-r border-white/[0.05] bg-[#101017] p-14 pt-32 lg:flex"
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

        <p className="relative text-xs text-gray-700">&copy; {new Date().getFullYear()} DriveEase</p>
      </motion.div>

      <div className="flex flex-1 items-start justify-center overflow-y-auto px-5 pb-12 pt-6 sm:px-6 lg:items-center lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="w-full max-w-[460px] rounded-3xl border border-white/[0.06] bg-white/[0.025] p-6 shadow-[0_22px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
        >
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
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
              <h2 className="font-display mb-1 text-3xl font-bold text-white">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="mb-7 text-sm text-gray-500">
                {isLogin ? 'Sign in to access your dashboard' : 'Join DriveEase and start renting'}
              </p>

              <form onSubmit={handle} className="space-y-4">
                {!isLogin && (
                  <>
                    <Field label="Full Name" icon={User} placeholder="Ahmad Raza" value={form.name} onChange={set('name')} onBlur={markTouched('name')} error={errors.name} />
                    <Field label="Phone Number" icon={Phone} placeholder="03001234567" value={form.phone} onChange={set('phone')} onBlur={markTouched('phone')} error={errors.phone} type="tel" />
                  </>
                )}

                <Field label="Email Address" icon={Mail} placeholder="you@example.com" value={form.email} onChange={set('email')} onBlur={markTouched('email')} error={errors.email} type="email" />

                <div>
                  <Field
                    label="Password"
                    icon={Lock}
                    placeholder={isLogin ? 'Password' : 'Min 6 characters'}
                    value={form.password}
                    onChange={set('password')}
                    onBlur={markTouched('password')}
                    error={errors.password}
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
                    onBlur={markTouched('confirm')}
                    error={errors.confirm}
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

                <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }} className="btn-primary group mt-3 w-full py-4 text-base">
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
