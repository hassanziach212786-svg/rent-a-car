import { useEffect, useState } from 'react';
import { ReviewCard } from '../../components/shared/Display';
import { OfficeMap } from '../../components/shared/OfficeMap';
import API from '../../api/axios';

const Community = () => {
  const [activeView, setActiveView] = useState('reviews');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await API.get('/locations');
        setLocations(res.data);
      } catch (err) {
        console.error('Failed to load locations', err);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex gap-4 mb-12 border-b border-white/5 pb-4">
          <button onClick={() => setActiveView('reviews')} className={`text-xl font-bold transition-all ${activeView === 'reviews' ? 'text-blue-500' : 'text-gray-500'}`}>Guest Reviews</button>
          <button onClick={() => setActiveView('locations')} className={`text-xl font-bold transition-all ${activeView === 'locations' ? 'text-blue-500' : 'text-gray-500'}`}>Our Hubs</button>
        </div>

        {activeView === 'reviews' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ReviewCard review={{ user: 'Ahmed Ali', rating: 5, comment: 'The G-Wagon was in pristine condition. Excellent service in Lahore!', date: '2 days ago' }} />
            <ReviewCard review={{ user: 'Sara Khan', rating: 4, comment: 'Great experience, though the pickup at Karachi airport took 10 mins longer than expected.', date: '1 week ago' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {locations.map((loc) => (
              <div key={loc._id} className="glass-card overflow-hidden border-white/10 hover:border-blue-500/30 transition-all group">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#c9a96e]">{loc.city}</p>
                      <h3 className="mt-1 text-2xl font-bold text-white">{loc.name}</h3>
                    </div>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase text-emerald-400">
                      {loc.hours || '24/7 Open'}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-400 text-sm">{loc.address}</p>
                  <div className="mt-5 border-t border-white/5 pt-4">
                    <p className="text-xs font-mono text-blue-400">{loc.phone || 'Contact support for direct office phone'}</p>
                  </div>
                </div>
                <OfficeMap location={loc} compact className="rounded-none border-x-0 border-b-0" />
              </div>
            ))}
            {locations.length === 0 && (
              <div className="col-span-full rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-gray-500">
                No office locations have been added yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
