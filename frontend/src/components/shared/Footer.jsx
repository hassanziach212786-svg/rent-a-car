import { Link } from 'react-router-dom';
import { Car, MapPin, Phone } from './BootstrapIcons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Our Fleet', to: '/cars' },
        { label: 'Locations', to: '/locations' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'FAQs', to: '/faqs' },
      ],
    },
    {
      title: 'Social',
      links: [
        { label: 'Instagram', href: 'https://www.instagram.com' },
        { label: 'Facebook', href: 'https://www.facebook.com' },
        { label: 'X', href: 'https://www.x.com' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com' },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#0a0a0c] pb-10 pt-20">
      <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            <Link to="/" className="group flex w-fit items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 p-2 text-white">
                <Car size={18} />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight">
                Drive<span className="text-blue-500">Ease</span>
              </span>
            </Link>

            <p className="max-w-sm leading-relaxed text-gray-400">
              Experience premium car rentals across Pakistan, with polished vehicles,
              clear pricing, and smooth pickup from booking to return.
            </p>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-white">Stay Updated</span>
              <form
                onSubmit={(event) => event.preventDefault()}
                className="flex max-w-sm flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-1 transition-all focus-within:border-blue-500/50 min-[420px]:flex-row"
              >
                <input
                  type="email"
                  placeholder="Enter email"
                  aria-label="Email address"
                  className="w-full border-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600"
                />
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-500">
                  Join
                </button>
              </form>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="mb-6 font-bold text-white">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="text-sm text-gray-400 transition-colors duration-300 hover:text-blue-400">
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-gray-400 transition-colors duration-300 hover:text-blue-400"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} DriveEase (Pvt) Ltd. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-3 text-center text-sm text-gray-500 sm:flex-row sm:gap-6 sm:text-left">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> Lahore, Multan, Islamabad</span>
            <span className="flex items-center gap-1.5"><Phone size={14} /> +92 300 1234567</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
