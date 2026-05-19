import { ExternalLink, MapPin } from 'lucide-react';

const getMapQuery = (location) => {
  if (!location) return '';

  const hasCoords = Number.isFinite(Number(location.latitude)) && Number.isFinite(Number(location.longitude));

  if (hasCoords) {
    return `${location.latitude},${location.longitude}`;
  }

  return [location.address, location.city].filter(Boolean).join(', ');
};

export const getOfficeMapUrls = (location) => {
  const query = getMapQuery(location);
  const encoded = encodeURIComponent(query || 'Pakistan');

  return {
    embedUrl: `https://maps.google.com/maps?q=${encoded}&z=15&output=embed`,
    openUrl: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
  };
};

export const OfficeMap = ({ location, className = '', compact = false }) => {
  if (!location) return null;

  const { embedUrl, openUrl } = getOfficeMapUrls(location);

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0f1117] ${className}`}>
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-4 py-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#c9a96e]">
            <MapPin size={12} /> Office Location
          </p>
          <h3 className="mt-1 truncate text-sm font-bold text-white">{location.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{location.address}</p>
        </div>
        <a
          href={openUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 transition-colors hover:border-[#c9a96e]/50 hover:text-white"
        >
          <ExternalLink size={11} /> Open
        </a>
      </div>
      <div className={compact ? 'h-48' : 'h-72'}>
        <iframe
          title={`${location.name} map`}
          src={embedUrl}
          className="h-full w-full border-0 grayscale-[0.2] invert-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};
