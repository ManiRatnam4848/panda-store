import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { BookCard } from '../catalog/BookCard';
import { Book } from '../../types/book';

interface CuratedCollectionsProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleWishlist: (book: Book) => void;
  wishlistIds: Set<string>;
  onOpen3DModal: (book: Book) => void;
  onViewAll: () => void;
}

type TabKey = 'bestsellers' | 'new-arrivals' | 'favourites' | 'under-499';

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({
  books,
  onSelectBook,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onOpen3DModal,
  onViewAll,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('bestsellers');

  const filteredBooks = React.useMemo(() => {
    switch (activeTab) {
      case 'bestsellers':
        return books.filter((b) => b.bestseller).slice(0, 8);
      case 'new-arrivals':
        return books.filter((b) => b.newArrival).slice(0, 8);
      case 'favourites':
        return books.filter((b) => b.readersFavourite || b.rating >= 4.8).slice(0, 8);
      case 'under-499':
        return books.filter((b) => b.price <= 499).slice(0, 8);
      default:
        return books.slice(0, 8);
    }
  }, [books, activeTab]);

  return (
    <section className="py-16 md:py-24 bg-[#F6F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#20251F]/8">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#315C46] font-semibold block mb-2">
              THE CURRENT SHELF
            </span>
            <h2 className="font-editorial text-3xl md:text-4xl font-bold text-[#20251F]">
              Books to begin with
            </h2>
          </div>

          {/* Interactive Collection Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/60 rounded-lg">
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'bestsellers'
                  ? 'bg-white text-[#20251F] shadow-xs'
                  : 'text-[#5C635B] hover:text-[#20251F]'
              }`}
            >
              Bestsellers
            </button>
            <button
              onClick={() => setActiveTab('new-arrivals')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'new-arrivals'
                  ? 'bg-white text-[#20251F] shadow-xs'
                  : 'text-[#5C635B] hover:text-[#20251F]'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('favourites')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'favourites'
                  ? 'bg-white text-[#20251F] shadow-xs'
                  : 'text-[#5C635B] hover:text-[#20251F]'
              }`}
            >
              Readers' Favourites
            </button>
            <button
              onClick={() => setActiveTab('under-499')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'under-499'
                  ? 'bg-white text-[#20251F] shadow-xs'
                  : 'text-[#5C635B] hover:text-[#20251F]'
              }`}
            >
              Under ₹499
            </button>
          </div>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-10">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelectBook={onSelectBook}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.has(book.id)}
              onOpen3DModal={onOpen3DModal}
            />
          ))}
        </div>

        {/* View All Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#20251F]/20 text-sm font-semibold text-[#20251F] hover:bg-stone-200/60 transition-colors"
          >
            <span>Browse All {books.length} Titles</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
