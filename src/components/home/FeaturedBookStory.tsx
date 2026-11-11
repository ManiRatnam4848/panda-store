import React from 'react';
import { ArrowRight, ShoppingBag, Box, Quote } from 'lucide-react';
import { Book } from '../../types/book';

interface FeaturedBookStoryProps {
  book: Book;
  onSelectBook: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onOpen3DModal: (book: Book) => void;
}

export const FeaturedBookStory: React.FC<FeaturedBookStoryProps> = ({
  book,
  onSelectBook,
  onAddToCart,
  onOpen3DModal,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-[#F6F1E8] border-b border-[#20251F]/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Large Book Cover with Realistic Perspective & Shadow */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group cursor-pointer" onClick={() => onSelectBook(book)}>
              {/* Backing paper frame */}
              <div
                className="w-72 sm:w-80 h-[430px] sm:h-[480px] rounded-lg p-6 flex flex-col justify-between book-shadow-lg transition-transform duration-500 group-hover:scale-102"
                style={{ backgroundColor: book.coverBgColor, color: book.coverTextColor }}
              >
                <div className="border border-stone-300/60 p-5 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] tracking-widest uppercase font-semibold text-[#C66B48]">
                      <span>PANDA STORE MONOGRAPH</span>
                      <span>VOL. 01</span>
                    </div>
                    <div className="w-10 h-0.5 bg-[#C66B48] my-3" />
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-xs italic opacity-75 mt-2">{book.subtitle}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider">{book.author}</p>
                    <div className="mt-3 flex items-center justify-between text-[10px] opacity-75 pt-3 border-t border-current/20">
                      <span>Linen Clothbound</span>
                      <span>320 Munken Pages</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spine edge illusion */}
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/20 to-transparent pointer-events-none rounded-l-lg" />

              {/* 3D Inspect Floater */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen3DModal(book);
                }}
                className="absolute -bottom-4 right-4 bg-[#20251F] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:bg-[#315C46] flex items-center gap-1.5 transition-colors"
              >
                <Box size={14} />
                <span>Inspect in 3D</span>
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Essay & Purchase Info */}
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-widest text-[#315C46] font-semibold block mb-3">
              VOLUME OF THE MONTH
            </span>

            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#20251F] leading-tight">
              {book.title}
            </h2>

            <p className="font-editorial text-xl italic text-[#5C635B] mt-2">
              By {book.author}
            </p>

            {/* Editorial quote */}
            <div className="my-6 p-6 bg-[#FAF7F2] border-l-2 border-[#315C46] rounded-r-lg">
              <Quote size={20} className="text-[#315C46] mb-2 opacity-60" />
              <p className="font-editorial text-base sm:text-lg italic text-[#20251F] leading-relaxed">
                "{book.excerpt}"
              </p>
            </div>

            <p className="text-sm text-[#5C635B] leading-relaxed">
              {book.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-8 py-4 border-y border-[#20251F]/10 text-xs">
              <div>
                <span className="text-[#878E86] block">Binding</span>
                <span className="font-medium text-[#20251F]">Clothbound Hardcover</span>
              </div>
              <div>
                <span className="text-[#878E86] block">Paper Stock</span>
                <span className="font-medium text-[#20251F]">140gsm Munken Pure</span>
              </div>
              <div>
                <span className="text-[#878E86] block">Origin</span>
                <span className="font-medium text-[#20251F]">Berlin & London</span>
              </div>
              <div>
                <span className="text-[#878E86] block">Price</span>
                <span className="font-mono text-base font-bold text-[#20251F]">
                  ₹{book.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onAddToCart(book)}
                className="bg-[#315C46] hover:bg-[#244434] text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                <ShoppingBag size={16} />
                <span>Add to Bag · ₹{book.price.toLocaleString('en-IN')}</span>
              </button>

              <button
                onClick={() => onSelectBook(book)}
                className="border border-[#20251F]/20 text-[#20251F] hover:bg-stone-200/50 px-6 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <span>Read Full Description</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
