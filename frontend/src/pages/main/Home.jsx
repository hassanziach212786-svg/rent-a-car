import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck,
  CarFront,
  CheckCircle,
  Clock,
  CreditCard,
  Gauge,
  Headphones,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { SearchPanel } from '../../components/shared/SearchPanel';
import { CarCard } from '../../components/shared/Display';
import { SkeletonCard } from '../../components/skeletons/Loaders';
import api from '../../api/axios';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

const fadeUpView = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const rentalSteps = [
  {
    icon: <MapPin size={19} />,
    title: 'Choose a location',
    text: 'Pick from active city hubs with clear pickup and return details.',
  },
  {
    icon: <CalendarCheck size={19} />,
    title: 'Reserve your dates',
    text: 'Set your rental window and see available cars before you commit.',
  },
  {
    icon: <CarFront size={19} />,
    title: 'Drive comfortably',
    text: 'Collect your car clean, checked, fueled, and ready for the route.',
  },
];

const categories = [
  {
    title: 'Business',
    subtitle: 'Quiet sedans for meetings and airport runs.',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=900',
  },
  {
    title: 'Family',
    subtitle: 'Roomy SUVs with luggage space and easy comfort.',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=900',
  },
  {
    title: 'Premium',
    subtitle: 'Polished cars for weddings, dinners, and special days.',
    image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=900',
  },
];

const perks = [
  { icon: <ShieldCheck size={18} />, title: 'Verified cars', text: 'Every listing is checked before it reaches customers.' },
  { icon: <CreditCard size={18} />, title: 'Simple pricing', text: 'Daily rates are easy to compare with no visual clutter.' },
  { icon: <Headphones size={18} />, title: 'Helpful support', text: 'Friendly assistance for bookings, changes, and pickup questions.' },
  { icon: <Gauge size={18} />, title: 'Ready to move', text: 'Clean interiors, maintained engines, and practical travel comfort.' },
];

const stats = [
  { label: 'Bookings handled', value: '10K+' },
  { label: 'Cars in fleet', value: '500+' },
  { label: 'City hubs', value: '15+' },
  { label: 'Support access', value: '24/7' },
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/cars?status=available');
        setFeaturedCars(res.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home fleet', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearch = (filters) => {
    const params = new URLSearchParams();

    if (filters.city) params.set('city', filters.city);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);

    navigate(`/cars?${params.toString()}`, { state: { filters } });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#08090c] text-white">
      <section className="relative min-h-[94vh] overflow-hidden bg-[#090a0d]">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#08090c_0%,#101116_45%,#1c1711_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8b875]/45 to-transparent" />
        <div className="absolute left-0 top-20 h-[32rem] w-[32rem] rounded-full bg-[#d8b875]/10 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[34rem] rounded-full bg-[#64748b]/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="container relative z-10 mx-auto grid min-h-[94vh] items-center gap-12 px-4 pb-24 pt-28 sm:px-6 sm:pb-28 sm:pt-32 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-3xl">
            <motion.div
              {...fadeUp(0)}
              className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-[#d8b875]/28 bg-white/[0.06] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#d8b875] backdrop-blur-md sm:text-[11px] sm:tracking-[0.18em]"
            >
              <Sparkles size={13} />
              Classic premium car rental
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="max-w-3xl font-display text-5xl font-bold leading-[0.98] text-white min-[380px]:text-6xl sm:text-7xl lg:text-8xl"
            >
              Rent the right car for every journey.
            </motion.h1>

            <motion.p
              {...fadeUp(0.18)}
              className="mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg"
            >
              Book polished sedans, roomy SUVs, and premium rides with clear
              availability, simple pricing, and a smooth pickup experience.
            </motion.p>

            <motion.div {...fadeUp(0.28)} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate('/cars')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d8b875] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.13em] text-[#08090c] shadow-[0_18px_50px_rgba(216,184,117,0.22)] transition hover:bg-[#ecd08f] active:scale-[0.98]"
              >
                Browse cars
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/16 bg-white/[0.06] px-7 py-4 text-sm font-bold uppercase tracking-[0.13em] text-white backdrop-blur-md transition hover:bg-white/[0.1] active:scale-[0.98]"
              >
                Start booking
              </button>
            </motion.div>

            <motion.div {...fadeUp(0.38)} className="mt-10 flex flex-wrap gap-3 text-sm text-white/82">
              {['Instant availability', 'Insured rentals', 'Flexible city pickup'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/28 px-4 py-2 backdrop-blur-md">
                  <CheckCircle size={14} className="text-[#d8b875]" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 28, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden min-h-[560px] lg:block"
          >
            <div className="absolute left-[8%] top-[9%] h-[390px] w-[390px] rounded-full border border-[#d8b875]/18" />
            <div className="absolute right-[4%] top-[3%] h-[460px] w-[460px] rounded-full border border-white/[0.07]" />
            <div className="absolute left-[8%] right-[2%] top-[22%] h-[310px] -skew-y-6 rounded-[2rem] border border-white/[0.08] bg-white/[0.035] shadow-[0_40px_120px_rgba(0,0,0,0.38)] backdrop-blur-md" />
            <motion.div
              animate={{ backgroundPosition: ['0px 0px', '-180px 0px'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-[15%] left-[17%] right-[5%] h-24 -skew-y-3 rounded-full opacity-45 blur-[1px] [background-image:repeating-linear-gradient(90deg,transparent_0_34px,rgba(216,184,117,.34)_34px_72px,transparent_72px_118px)]"
            />
            <div className="absolute bottom-[11%] left-[12%] right-[8%] h-20 rounded-full bg-black/70 blur-3xl" />

            <motion.img
              animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              src="https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&q=88&w=1400"
              alt="Premium rental car"
              className="absolute right-[-4%] top-[18%] h-[360px] w-[88%] rounded-[1.75rem] object-cover shadow-[0_44px_90px_rgba(0,0,0,0.55)] [transform:perspective(1200px)_rotateY(-10deg)_rotateX(4deg)]"
            />
            <motion.div
              animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-[-4%] top-[18%] h-[360px] w-[88%] rounded-[1.75rem] bg-gradient-to-tr from-black/55 via-transparent to-[#d8b875]/12 [transform:perspective(1200px)_rotateY(-10deg)_rotateX(4deg)]"
            />

            <div className="absolute left-0 top-[18%] w-44 rounded-2xl border border-white/10 bg-[#0c0d11]/86 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8b875]/14 text-[#d8b875]">
                <ShieldCheck size={18} />
              </div>
              <p className="text-sm font-extrabold text-white">Verified fleet</p>
              <p className="mt-1 text-xs leading-5 text-white/55">Clean, checked, and ready before pickup.</p>
            </div>

            <div className="absolute bottom-[14%] right-[1%] w-56 rounded-2xl border border-white/10 bg-[#0c0d11]/88 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.36)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d8b875]">Today</p>
                  <p className="mt-1 text-lg font-black text-white">Ready to book</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-[#d8b875]">
                  <CarFront size={20} />
                </div>
              </div>
            </div>

            <div className="absolute bottom-[3%] left-[9%] grid w-[60%] grid-cols-3 gap-3">
              {['Sedan', 'SUV', 'Premium'].map((type) => (
                <div key={type} className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-center backdrop-blur">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/78">{type}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative z-20 -mt-20">
        <SearchPanel onSearch={handleSearch} />
      </div>

      <section className="bg-[#08090c] px-4 pb-10 pt-16 sm:px-6">
        <div className="container mx-auto grid grid-cols-1 gap-3 rounded-3xl border border-white/[0.07] bg-white/[0.035] p-3 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur min-[420px]:grid-cols-2 sm:gap-4 sm:rounded-[2rem] sm:p-4 md:grid-cols-4">
          {stats.map((stat) => (
            <motion.div key={stat.label} {...fadeUpView} className="rounded-[1.35rem] border border-white/[0.06] bg-[#111318] p-5 text-center">
              <p className="text-2xl font-black text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#c9a96e]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#08090c] px-4 py-16 sm:px-6 sm:py-20">
        <div className="container mx-auto grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <motion.span {...fadeUpView} className="mb-4 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a96e]">
              <Route size={14} />
              How it works
            </motion.span>
            <motion.h2 {...fadeUpView} className="max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
              A smoother way to book your next drive.
            </motion.h2>
            <motion.p {...fadeUpView} className="mt-5 max-w-lg text-base leading-8 text-white/58">
              Search first, compare clearly, and move into booking with a layout that feels
              premium, practical, and easy to trust.
            </motion.p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {rentalSteps.map((step, index) => (
              <motion.div
                key={step.title}
                {...fadeUpView}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[1.5rem] border border-white/[0.07] bg-[#111318] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.22)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c9a96e]/12 text-[#c9a96e]">
                  {step.icon}
                </div>
                <p className="text-lg font-extrabold text-white">{step.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/52">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d0f14] px-4 py-16 text-white sm:px-6 sm:py-24">
        <div className="container mx-auto">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <motion.span {...fadeUpView} className="mb-4 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a96e]">
                <Star size={14} />
                Featured fleet
              </motion.span>
              <motion.h2 {...fadeUpView} className="text-3xl font-black sm:text-4xl md:text-5xl">
                Popular cars ready to rent.
              </motion.h2>
              <motion.p {...fadeUpView} className="mt-4 max-w-xl leading-8 text-white/65">
                A selected preview of available cars in a darker, cleaner section that matches
                the rest of the rental experience.
              </motion.p>
            </div>

            <motion.button
              {...fadeUpView}
              onClick={() => navigate('/cars')}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c9a96e] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.13em] text-[#08090c] transition hover:bg-white sm:w-fit"
            >
              View all
              <ArrowRight size={15} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
              : featuredCars.map((car, i) => (
                  <motion.div
                    key={car._id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <CarCard car={car} />
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      <section className="bg-[#08090c] px-4 py-16 sm:px-6 sm:py-24">
        <div className="container mx-auto">
          <div className="mb-12 max-w-2xl">
            <motion.span {...fadeUpView} className="mb-4 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#c9a96e]">
              <CarFront size={14} />
              Find your style
            </motion.span>
            <motion.h2 {...fadeUpView} className="text-3xl font-black text-white sm:text-4xl md:text-5xl">
              Pick a car by occasion.
            </motion.h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.title}
                {...fadeUpView}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => navigate('/cars')}
                className="group relative min-h-[340px] overflow-hidden rounded-[1.75rem] border border-white/[0.07] text-left shadow-[0_24px_70px_rgba(0,0,0,0.3)]"
              >
                <img
                  src={category.image}
                  alt={`${category.title} rental car`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/92 via-[#050608]/34 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="text-2xl font-black text-white">{category.title}</p>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/72">{category.subtitle}</p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#c9a96e] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#08090c]">
                    Explore
                    <ArrowRight size={13} />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-[#08090c] px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          {...fadeUpView}
          className="container mx-auto overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#151820] via-[#101218] to-[#08090c] px-4 py-10 text-center text-white shadow-[0_28px_90px_rgba(0,0,0,0.36)] sm:px-7 sm:py-12 md:rounded-[2rem] md:px-16 md:py-16"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#c9a96e]">Ready when you are</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Choose your city, dates, and car in a few calm clicks.
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('/cars')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a96e] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.13em] text-[#08090c] transition hover:bg-white active:scale-[0.98]"
            >
              Explore fleet
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/18 px-7 py-4 text-sm font-bold uppercase tracking-[0.13em] text-white transition hover:bg-white/10 active:scale-[0.98]"
            >
              Create account
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
