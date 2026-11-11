import React from 'react';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { BookScene3D } from '../3d/BookScene3D';
import { Book } from '../../types/book';

interface HeroProps {
  featuredBook: Book;
  onExploreClick: () => void;
  onBestsellersClick: () => void;
  onSelectBook: (book: Book) => void;
  onOpen3DModal: (book: Book) => void;
}

export const Hero: React.FC<HeroProps> = ({
  featuredBook,
  onExploreClick,
  onBestsellersClick,
  onSelectBook,
  onOpen3DModal,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#F6F1E8] border-b border-[#20251F]/8 py-12 lg:py-20">
      {/* Background ambient texture / subtle gradient */}
      <div className="absolute inset-0 bg-radial from-stone-200/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Editorial Headline Column (Left 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Quiet text kicker (Zero-Pill discipline) */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#315C46] font-semibold mb-4">
              <span>PANDA STORE</span>
              <span aria-hidden="true">·</span>
              <span>BUY YOUR DESIRED BOOKS</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#20251F] leading-[1.08] text-balance">
              A world of stories, <br />
              <span className="italic font-normal">waiting to be opened.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#5C635B] max-w-xl leading-relaxed text-pretty">
              Find your next favourite. Explore books chosen for curious minds, open hearts, and endless imagination — bound in cloth, printed on archival paper, and delivered across India.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="bg-[#315C46] hover:bg-[#244434] text-white px-6 py-3.5 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                <span>Explore Books</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onBestsellersClick}
                className="bg-transparent hover:bg-stone-200/60 text-[#20251F] border border-[#20251F]/20 px-6 py-3.5 rounded-lg text-sm font-semibold transition-all"
              >
                Discover Bestsellers
              </button>
            </div>

            {/* Quiet Proof Adjacency */}
            <div className="mt-12 pt-8 border-t border-[#20251F]/10 flex flex-wrap items-center gap-6 text-xs text-[#5C635B]">
              <div className="flex items-center gap-2">
                <span className="font-editorial text-lg font-bold text-[#20251F]">2,400+</span>
                <span className="leading-tight">Curated<br />Titles</span>
              </div>
              <span className="w-px h-6 bg-stone-300" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <span className="font-editorial text-lg font-bold text-[#20251F]">100%</span>
                <span className="leading-tight">Archival Paper<br />& Bindings</span>
              </div>
              <span className="w-px h-6 bg-stone-300" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <span className="font-editorial text-lg font-bold text-[#20251F]">48h</span>
                <span className="leading-tight">Courier Dispatch<br />Across India</span>
              </div>
            </div>
          </div>

          {/* Interactive 3D Book Scene Column (Right 5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* The 3D Book Canvas */}
            <div className="w-full h-[420px] sm:h-[480px] relative">
              <BookScene3D
                title={featuredBook.title}
                subtitle={featuredBook.subtitle}
                author={featuredBook.author}
                coverBgColor={featuredBook.coverBgColor}
                coverTextColor={featuredBook.coverTextColor}
                accentColor={featuredBook.accentColor}
                spineColor={featuredBook.spineColor}
                className="w-full h-full"
              />
            </div>

            {/* Tactical 3D helper strip */}
            <div className="mt-2 flex items-center justify-between w-full max-w-sm px-4 py-2 bg-[#FAF7F2] border border-stone-200/80 rounded-lg shadow-xs text-xs">
              <div className="flex items-center gap-2 text-[#5C635B]">
                <span className="w-2 h-2 rounded-full bg-[#315C46]" />
                <span className="font-medium text-stone-900">{featuredBook.title}</span>
              </div>
              <button
                onClick={() => onOpen3DModal(featuredBook)}
                className="text-[#315C46] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Inspect in 3D</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
