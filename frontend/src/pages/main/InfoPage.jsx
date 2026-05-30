import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CarFront, MapPin, ShieldCheck, Star } from '../../components/shared/BootstrapIcons';

const pageContent = {
  about: {
    eyebrow: 'About DriveEase',
    title: 'Premium car rental built for confident travel.',
    intro:
      'DriveEase connects customers with well-maintained premium vehicles, transparent rental details, and a smoother booking experience across major Pakistani cities.',
    points: [
      'Verified cars checked before pickup',
      'Clear daily pricing with practical booking steps',
      'Support for city trips, events, airport runs, and business travel',
    ],
    icon: ShieldCheck,
  },
  locations: {
    eyebrow: 'Locations',
    title: 'Pickup hubs in key cities.',
    intro:
      'Start your booking from active city hubs, with clear pickup and return details shown during the rental flow.',
    points: ['Lahore', 'Multan', 'Islamabad'],
    icon: MapPin,
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Need help with a booking?',
    intro:
      'Our team can help with availability, pickup details, payment questions, and booking changes.',
    points: ['Phone: +92 300 1234567', 'Email: support@driveease.pk', 'Hours: 24/7 customer assistance'],
    icon: CarFront,
  },
  privacy: {
    eyebrow: 'Privacy Policy',
    title: 'Your rental information is handled with care.',
    intro:
      'We collect only the information needed to manage accounts, bookings, payments, and customer support.',
    points: [
      'Account and booking details are used to provide rental services',
      'Payment information is handled only for booking verification',
      'Customer data is not sold to third parties',
    ],
    icon: ShieldCheck,
  },
  terms: {
    eyebrow: 'Terms of Service',
    title: 'Simple rental terms for a clear experience.',
    intro:
      'By booking with DriveEase, customers agree to provide accurate details, follow rental conditions, and return vehicles on time.',
    points: [
      'Drivers must provide valid booking and contact details',
      'Vehicles should be returned in the agreed condition and time window',
      'Late returns, damage, or misuse may result in additional charges',
    ],
    icon: Star,
  },
  faqs: {
    eyebrow: 'FAQs',
    title: 'Answers before you book.',
    intro:
      'Here are the common questions customers ask before reserving a vehicle.',
    points: [
      'Can I book online? Yes, browse the fleet and start the booking flow from any available car.',
      'Can I choose a pickup city? Yes, available locations are shown during search and booking.',
      'Do I need an account? You need to sign in before confirming protected booking steps.',
    ],
    icon: CarFront,
  },
};

const InfoPage = ({ slug: routeSlug }) => {
  const params = useParams();
  const slug = routeSlug || params.slug;
  const content = pageContent[slug] || pageContent.about;
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-[#08090c] px-4 pb-20 pt-32 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.06] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-300">
          <Icon size={14} />
          {content.eyebrow}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              {content.intro}
            </p>
            <Link
              to="/cars"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-black uppercase tracking-[0.13em] text-white transition hover:bg-blue-500"
            >
              Explore Fleet
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur">
            <h2 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-gray-500">Details</h2>
            <div className="space-y-3">
              {content.points.map((point) => (
                <div key={point} className="rounded-2xl border border-white/[0.06] bg-[#111318] p-4 text-sm leading-7 text-gray-300">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
