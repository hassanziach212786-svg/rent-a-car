import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck,
  CarFront,
  CreditCard,
  Gauge,
  Headphones,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
} from '../../components/shared/BootstrapIcons';
import { SearchPanel } from '../../components/shared/SearchPanel';
import { CarCard } from '../../components/shared/Display';
import { SkeletonCard } from '../../components/skeletons/Loaders';
import heroSportsCar from '../../assets/hero/sports-car.png';
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

const stats = [
  { label: 'Bookings handled', value: '10K+' },
  { label: 'Cars in fleet', value: '500+' },
  { label: 'City hubs', value: '15+' },
  { label: 'Support access', value: '24/7' },
];

const typewriterPhrases = [
  'Drive the classic standard.',
  'Arrive in premium style.',
  'Book luxury without delay.',
];

const ClassicHero = ({ onRent, onFleet }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const carX = useTransform(mouseX, [-1, 1], [-8, 14]);
  const carY = useTransform(mouseY, [-1, 1], [5, -7]);
  const glowX = useTransform(mouseX, [-1, 1], [-22, 22]);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    mouseY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const resetPointer = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const phrase = typewriterPhrases[phraseIndex];
    const isComplete = typedText === phrase;
    const isEmpty = typedText === '';
    const delay = isComplete && !isDeleting ? 1300 : isDeleting ? 34 : 58;

    const timer = setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % typewriterPhrases.length);
        return;
      }

      const nextLength = typedText.length + (isDeleting ? -1 : 1);
      setTypedText(phrase.slice(0, nextLength));
    }, delay);

    return () => clearTimeout(timer);
  }, [isDeleting, phraseIndex, typedText]);

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="relative min-h-screen overflow-hidden bg-[#080807] px-4 pb-28 pt-24 text-white sm:px-6 sm:pt-28 lg:pb-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_36%,rgba(216,184,117,0.22),transparent_31%),radial-gradient(circle_at_8%_76%,rgba(85,72,49,0.18),transparent_28%),linear-gradient(120deg,#12110f_0%,#090909_46%,#050505_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:88px_88px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8b875]/55 to-transparent" />
      <motion.div
        style={{ x: glowX }}
        className="absolute left-[70%] top-[22%] h-72 w-[58rem] -translate-x-1/2 rounded-full bg-[#d8b875]/14 blur-[105px]"
      />
      <div className="absolute bottom-0 left-1/2 h-44 w-[90%] -translate-x-1/2 rounded-full bg-black/85 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-7xl items-center gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="relative z-30 max-w-2xl text-center lg:text-left">
          <motion.div
            {...fadeUp(0)}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8b875]/28 bg-white/[0.045] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#d8b875] shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:text-xs"
          >
            <Sparkles size={14} />
            Classic premium rental
          </motion.div>

          <motion.div {...fadeUp(0.08)}>
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.28em] text-white/42">
              Luxury on demand
            </p>
            <div className="relative min-h-[14.5rem] min-[420px]:min-h-[16.5rem] sm:min-h-[19rem] lg:min-h-[21rem] xl:min-h-[22rem]">
              <h1 className="font-display text-5xl font-bold leading-[0.9] tracking-normal text-white drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] min-[420px]:text-6xl sm:text-7xl lg:text-[6.2rem]">
                {typedText}
                <motion.span
                  className="ml-1 inline-block h-[0.8em] w-[0.06em] translate-y-[0.08em] rounded-full bg-[#d8b875]"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                />
              </h1>
            </div>
          </motion.div>

          <motion.p
            {...fadeUp(0.72)}
            className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/66 sm:text-lg lg:mx-0"
          >
            Premium cars, clear availability, and a calm booking experience built
            for weddings, business trips, and city escapes.
          </motion.p>

          <motion.div {...fadeUp(0.9)} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center lg:max-w-[470px]">
            <button
              onClick={onRent}
              className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#d8b875] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-[#070707] shadow-[0_18px_55px_rgba(216,184,117,0.25)] transition hover:bg-[#efd28f] active:scale-[0.98]"
            >
              Rent Now
              <ArrowRight size={15} />
            </button>
            <button
              onClick={onFleet}
              className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full border border-white/14 bg-white/[0.055] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white backdrop-blur-xl transition hover:bg-white/10 active:scale-[0.98]"
            >
              View Fleet
            </button>
          </motion.div>
        </div>

        <motion.div style={{ x: carX, y: carY }} className="relative z-20 w-full will-change-transform">
          <div className="absolute left-[16%] right-[-4%] top-[49%] h-36 rounded-full bg-[#d8b875]/18 blur-[82px]" />
          <div className="absolute left-[26%] right-[4%] top-[73%] h-20 rounded-full bg-black/85 blur-3xl" />
          <motion.div
            className="group relative z-10 ml-auto aspect-[3/2] w-full max-w-[850px] drop-shadow-[0_48px_100px_rgba(0,0,0,0.76)] lg:scale-110"
            initial={{ opacity: 0, x: 80, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src={heroSportsCar}
              alt="Luxury sports car"
              className="relative z-10 h-full w-full object-contain"
            />
            <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute left-[2.5%] top-[55%] h-[7%] w-[10%] rotate-[25deg] rounded-full bg-white/95 blur-[3px] shadow-[0_0_18px_rgba(255,255,255,0.95),0_0_42px_rgba(216,184,117,0.82)]" />
              <div className="absolute left-[47.5%] top-[55%] h-[8%] w-[21%] -rotate-[8deg] rounded-full bg-white/95 blur-[4px] shadow-[0_0_22px_rgba(255,255,255,0.98),0_0_58px_rgba(216,184,117,0.88)]" />
              <div className="absolute left-[-3%] top-[51%] h-[18%] w-[28%] rotate-[10deg] rounded-full bg-[radial-gradient(ellipse_at_left,rgba(255,255,255,0.5),rgba(216,184,117,0.24)_38%,transparent_72%)] blur-xl" />
              <div className="absolute left-[45%] top-[49%] h-[18%] w-[36%] -rotate-[5deg] rounded-full bg-[radial-gradient(ellipse_at_left,rgba(255,255,255,0.58),rgba(216,184,117,0.28)_42%,transparent_76%)] blur-xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[8%] left-1/2 z-20 grid w-[92%] max-w-xl -translate-x-1/2 grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-[#11100d]/78 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.44)] backdrop-blur-2xl sm:p-3 lg:left-[48%]"
          >
            {[
              ['Fleet', '500+'],
              ['Pickup', '15 cities'],
              ['Booking', 'Instant'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.045] px-3 py-3 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#d8b875] sm:text-[10px]">{label}</p>
                <p className="mt-1 text-sm font-black text-white sm:text-lg">{value}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

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
      <ClassicHero onRent={() => navigate('/signup')} onFleet={() => navigate('/cars')} />

      <div className="relative z-20 -mt-10">
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
              onClick={() => navigate('/signup')}
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
