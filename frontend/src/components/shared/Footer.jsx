// src/components/shared/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Our Fleet", "Locations", "Contact"]
    },
    {
      title: "Resources",
      links: [ "Privacy Policy", "Terms of Service", "FAQs"]
    },
    {
      title: "Social",
      links: ["Instagram", "Facebook", "Twitter", "LinkedIn"]
    }
  ];

  return (
    <footer className="relative bg-[#0a0a0c] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg text-white font-bold">
                🚗
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">
                Drive<span className="text-blue-500">Ease</span>
              </span>
            </Link>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Experience the pinnacle of luxury car rentals across Pakistan. 
              From Multan to Lahore, we provide premium vehicles for your every need.
            </p>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-white uppercase tracking-wider">Stay Updated</span>
              <div className="flex max-w-sm flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-1 transition-all focus-within:border-blue-500/50 min-[420px]:flex-row">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  className="bg-transparent border-none outline-none px-3 py-2 text-sm text-white w-full"
                />
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-500">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold mb-6">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © {currentYear} DriveEase (Pvt) Ltd. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-3 text-center text-sm text-gray-500 sm:flex-row sm:gap-6 sm:text-left">
            <span className="flex items-center gap-1.5">📍 Lahore • Multan • Islamabad</span>
            <span className="flex items-center gap-1.5">📞 +92 300 1234567</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
