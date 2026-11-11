import React, { useState } from 'react';
import { ArrowRight, Check, BookOpen, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { BookCategory } from '../../types/book';

interface FooterProps {
  onNavigate: (view: string, category?: BookCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-[#20251F] text-[#F6F1E8] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Manifesto Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-stone-800">
          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-widest text-[#C66B48] font-semibold block mb-2">
              The Panda Dispatch
            </span>
            <h3 className="font-editorial text-2xl md:text-3xl font-bold leading-snug">
              Stories worth keeping close, delivered to your letterbox.
            </h3>
            <p className="mt-3 text-sm text-stone-400 max-w-md leading-relaxed">
              Bi-weekly reading recommendations, essays on bookmaking and typography, and first invitations to signed first editions.
            </p>

            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:outline-hidden focus:border-[#C66B48]"
                disabled={subscribed}
              />
              <button
                type="submit"
                disabled={subscribed}
                className="bg-[#315C46] hover:bg-[#3D7357] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                {subscribed ? (
                  <>
                    <Check size={16} />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
            {error && <p className="text-xs text-rose-400 mt-2">{error}</p>}
            {subscribed && (
              <p className="text-xs text-emerald-400 mt-2">
                Welcome to our circle of readers. Check your inbox shortly.
              </p>
            )}
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Curated Collections */}
            <div>
              <h4 className="text-xs uppercase font-semibold tracking-wider text-stone-300 mb-4">
                Collections
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-400">
                <li>
                  <button onClick={() => onNavigate('catalog', 'Fiction')} className="hover:text-white transition-colors">
                    Literary Fiction
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('catalog', 'Nonfiction')} className="hover:text-white transition-colors">
                    Memoirs & Essays
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('catalog', 'Art & Architecture')} className="hover:text-white transition-colors">
                    Art & Monoliths
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('catalog', 'Philosophy')} className="hover:text-white transition-colors">
                    Philosophy & Living
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('catalog', 'Science & Nature')} className="hover:text-white transition-colors">
                    Natural History
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('catalog', 'Children & Young Adult')} className="hover:text-white transition-colors">
                    Children's Classics
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Reader Services */}
            <div>
              <h4 className="text-xs uppercase font-semibold tracking-wider text-stone-300 mb-4">
                Services
              </h4>
              <ul className="space-y-2.5 text-sm text-stone-400">
                <li>
                  <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                    Our Bookshops
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('shipping')} className="hover:text-white transition-colors">
                    India Delivery (2–4 Days)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('returns')} className="hover:text-white transition-colors">
                    14-Day Reading Returns
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('gift')} className="hover:text-white transition-colors">
                    Linen Gift Wrapping
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('corporate')} className="hover:text-white transition-colors">
                    Library Curation
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: The Bookshops */}
            <div>
              <h4 className="text-xs uppercase font-semibold tracking-wider text-stone-300 mb-4">
                Bookshops
              </h4>
              <div className="space-y-3 text-xs text-stone-400">
                <div>
                  <p className="font-semibold text-stone-200">Kala Ghoda, Mumbai</p>
                  <p>14 Ropewalk Lane, Fort</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-200">Indiranagar, Bengaluru</p>
                  <p>100 Feet Road, HAL II Stage</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-200">Sundar Nagar, New Delhi</p>
                  <p>Block 7, Heritage Market</p>
                </div>
                <div className="pt-2 text-stone-300">
                  <span className="text-[11px] font-mono">hello@pandastore.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Currency */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div className="flex items-center gap-2">
            <span>© 2026 PANDA STORE. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Buy your Desired Books</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-mono text-stone-300 bg-stone-900 px-2.5 py-1 rounded border border-stone-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Currency: INR (₹)
            </span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
