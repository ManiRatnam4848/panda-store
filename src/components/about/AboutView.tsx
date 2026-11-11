import React from 'react';
import { ArrowLeft, BookOpen, Compass, ShieldCheck, Heart } from 'lucide-react';

interface AboutViewProps {
  onBack: () => void;
  onExplore: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBack, onExplore }) => {
  return (
    <div className="py-12 bg-[#F6F1E8] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C635B] hover:text-[#20251F] mb-8"
        >
          <ArrowLeft size={16} />
          <span>Back to Bookstore</span>
        </button>

        <div className="space-y-12">
          {/* Header */}
          <div>
            <span className="text-xs uppercase tracking-widest text-[#315C46] font-semibold block mb-2">
              ESTABLISHED 2024 · INDEPENDENT BOOKSELLERS
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-[#20251F] leading-tight">
              A considered sanctuary for the printed word.
            </h1>
            <p className="font-editorial text-xl italic text-[#5C635B] mt-4">
              "We still believe that opening a clothbound volume can quietly alter the weather of an entire room."
            </p>
          </div>

          {/* Manifesto Paragraphs */}
          <div className="space-y-6 text-sm text-[#5C635B] leading-relaxed">
            <p>
              PANDA STORE was founded with a singular conviction: to help every reader find and buy their desired books in premium clothbound and archival editions.
            </p>
            <p>
              Every title on our shelves is chosen by human editors who read the entire manuscript before we commit a single copy to inventory. We work directly with independent publishing houses, letterpress studios, and international monographs across London, Kyoto, Berlin, and Mumbai.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-stone-300">
            <div className="p-5 bg-[#FAF7F2] rounded-xl border border-stone-200">
              <BookOpen size={24} className="text-[#315C46] mb-3" />
              <h3 className="font-editorial text-lg font-bold text-[#20251F] mb-1">
                Linen Bindings
              </h3>
              <p className="text-xs text-[#5C635B] leading-relaxed">
                Selected for durability and tactile warmth. Smyth-sewn signatures that open completely flat without cracked spines.
              </p>
            </div>

            <div className="p-5 bg-[#FAF7F2] rounded-xl border border-stone-200">
              <Compass size={24} className="text-[#C66B48] mb-3" />
              <h3 className="font-editorial text-lg font-bold text-[#20251F] mb-1">
                Curated Alcoves
              </h3>
              <p className="text-xs text-[#5C635B] leading-relaxed">
                We favor overlooked classics, regional Indian translations, architectural treatises, and essays that reward slow second readings.
              </p>
            </div>

            <div className="p-5 bg-[#FAF7F2] rounded-xl border border-stone-200">
              <ShieldCheck size={24} className="text-[#20251F] mb-3" />
              <h3 className="font-editorial text-lg font-bold text-[#20251F] mb-1">
                Archival Care
              </h3>
              <p className="text-xs text-[#5C635B] leading-relaxed">
                Plastic-free packaging made from recycled corrugation and moisture-resistant wax linings for safe India-wide transit.
              </p>
            </div>
          </div>

          {/* Our Physical Sanctuaries */}
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#20251F] mb-6">
              Our Physical Bookshops
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#5C635B]">
              <div className="p-4 bg-[#FAF7F2] rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-900 text-sm mb-1">Kala Ghoda, Mumbai</h4>
                <p>14 Ropewalk Lane, Heritage District</p>
                <p className="mt-2 text-stone-400">Open Tue–Sun, 11am – 8pm</p>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-900 text-sm mb-1">Indiranagar, Bengaluru</h4>
                <p>100 Feet Road, Near Defence Colony</p>
                <p className="mt-2 text-stone-400">Open Tue–Sun, 10am – 9pm</p>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-lg border border-stone-200">
                <h4 className="font-semibold text-stone-900 text-sm mb-1">Sundar Nagar, New Delhi</h4>
                <p>Block 7, Heritage Market</p>
                <p className="mt-2 text-stone-400">Open Tue–Sun, 11am – 7pm</p>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center">
            <button
              onClick={onExplore}
              className="px-6 py-3 bg-[#315C46] hover:bg-[#244434] text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Explore Our Shelves
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
