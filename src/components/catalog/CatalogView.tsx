import React, { useState, useMemo } from 'react';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';
import { Book, BookCategory, BookFormat } from '../../types/book';
import { BookCard } from './BookCard';

interface CatalogViewProps {
  books: Book[];
  initialCategory?: BookCategory;
  initialSearch?: string;
  onSelectBook: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleWishlist: (book: Book) => void;
  wishlistIds: Set<string>;
  onOpen3DModal: (book: Book) => void;
  onCategoryChange?: (category?: BookCategory) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  books,
  initialCategory,
  initialSearch = '',
  onSelectBook,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onOpen3DModal,
  onCategoryChange,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Update when initialCategory changes from outside
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    } else {
      setSelectedCategory('All');
    }
  }, [initialCategory]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    onCategoryChange?.(cat === 'All' ? undefined : (cat as BookCategory));
  };

  React.useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const categories: (BookCategory | 'All')[] = [
    'All',
    'Fiction',
    'Nonfiction',
    'Art & Architecture',
    'Philosophy',
    'Science & Nature',
    'Poetry & Essays',
    'Children & Young Adult',
  ];

  const formats: (BookFormat | 'All')[] = ['All', 'Hardcover', 'Paperback', 'Collector\'s Edition'];

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchDesc = book.description.toLowerCase().includes(q);
          const matchIsbn = book.isbn.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchDesc && !matchIsbn) return false;
        }

        // Category
        if (selectedCategory !== 'All' && book.category !== selectedCategory) {
          return false;
        }

        // Format
        if (selectedFormat !== 'All' && book.format !== selectedFormat) {
          return false;
        }

        // Max price
        if (book.price > maxPrice) {
          return false;
        }

        // Min rating
        if (minRating > 0 && book.rating < minRating) {
          return false;
        }

        // In stock
        if (inStockOnly && !book.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.publishedYear - a.publishedYear;
          case 'featured':
          default:
            return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
        }
      });
  }, [books, searchQuery, selectedCategory, selectedFormat, maxPrice, minRating, inStockOnly, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedFormat !== 'All' ||
    maxPrice < 3000 ||
    minRating > 0 ||
    inStockOnly ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    handleCategorySelect('All');
    setSelectedFormat('All');
    setMaxPrice(3000);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="py-10 bg-[#F6F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#5C635B] mb-2">
            <span>Home</span>
            <span aria-hidden="true">/</span>
            <span>Books</span>
            {selectedCategory !== 'All' && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#20251F] font-medium">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#20251F]">
            The Catalogue
          </h1>
          <p className="text-sm text-[#5C635B] mt-1">
            Browse our full collection of {books.length} curated literary and art editions.
          </p>
        </div>

        {/* Search & Utility Bar */}
        <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#20251F]/8 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="w-full bg-white border border-stone-200 rounded-lg pl-10 pr-10 py-2.5 text-sm text-[#20251F] placeholder:text-stone-400 focus:outline-hidden focus:border-[#315C46]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-[#20251F]"
            >
              <Filter size={15} />
              <span>Filters {hasActiveFilters && '●'}</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5C635B] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort books catalogue"
                className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-[#20251F] focus:outline-hidden focus:border-[#315C46]"
              >
                <option value="featured">Featured / Bestsellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Releases</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[#5C635B]">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => handleCategorySelect('All')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 hover:bg-stone-300 text-stone-800 rounded text-xs transition-colors"
              >
                <span>Category: {selectedCategory}</span>
                <X size={12} />
              </button>
            )}
            {selectedFormat !== 'All' && (
              <button
                onClick={() => setSelectedFormat('All')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 hover:bg-stone-300 text-stone-800 rounded text-xs transition-colors"
              >
                <span>Format: {selectedFormat}</span>
                <X size={12} />
              </button>
            )}
            {maxPrice < 3000 && (
              <button
                onClick={() => setMaxPrice(3000)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 hover:bg-stone-300 text-stone-800 rounded text-xs transition-colors"
              >
                <span>Under ₹{maxPrice}</span>
                <X size={12} />
              </button>
            )}
            {minRating > 0 && (
              <button
                onClick={() => setMinRating(0)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 hover:bg-stone-300 text-stone-800 rounded text-xs transition-colors"
              >
                <span>Rating ≥ {minRating}★</span>
                <X size={12} />
              </button>
            )}
            {inStockOnly && (
              <button
                onClick={() => setInStockOnly(false)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 hover:bg-stone-300 text-stone-800 rounded text-xs transition-colors"
              >
                <span>In Stock Only</span>
                <X size={12} />
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 hover:bg-stone-300 text-stone-800 rounded text-xs transition-colors"
              >
                <span>"{searchQuery}"</span>
                <X size={12} />
              </button>
            )}
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#C66B48] font-semibold hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Layout: Desktop Sidebar (3 cols) + Product Grid (9 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block md:col-span-3 space-y-6 bg-[#FAF7F2] p-5 rounded-xl border border-[#20251F]/8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="font-semibold text-sm text-[#20251F]">Filter Books</span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#C66B48] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category / Alcove */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-stone-500 tracking-wider mb-2.5">
                Category
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-[#315C46] text-white font-medium'
                        : 'text-stone-700 hover:bg-stone-200/50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-70">
                      {cat === 'All'
                        ? books.length
                        : books.filter((b) => b.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Filter */}
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-xs uppercase font-semibold text-stone-500 tracking-wider mb-2.5">
                Binding Format
              </h4>
              <div className="space-y-1">
                {formats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                      selectedFormat === fmt
                        ? 'bg-[#20251F] text-white font-medium'
                        : 'text-stone-700 hover:bg-stone-200/50'
                    }`}
                  >
                    <span>{fmt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <h4 className="uppercase font-semibold text-stone-500 tracking-wider">
                  Max Price
                </h4>
                <span className="font-mono font-bold text-stone-800">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="350"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#315C46] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                <span>₹350</span>
                <span>₹3,000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-xs uppercase font-semibold text-stone-500 tracking-wider mb-2">
                Minimum Rating
              </h4>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {[0, 4.7, 4.9].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMinRating(rate)}
                    className={`py-1.5 px-2 rounded text-center transition-colors ${
                      minRating === rate
                        ? 'bg-[#315C46] text-white font-semibold'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {rate === 0 ? 'All' : `${rate}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs text-stone-700">In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-[#315C46] w-4 h-4 cursor-pointer"
              />
            </div>
          </aside>

          {/* Product Grid Area (9 cols) */}
          <main className="md:col-span-9">
            <div className="flex items-center justify-between text-xs text-[#5C635B] mb-4">
              <span>
                Showing <strong className="text-stone-900">{filteredBooks.length}</strong> of {books.length} titles
              </span>
            </div>

            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            ) : (
              // Empty State
              <div className="text-center py-20 bg-[#FAF7F2] rounded-xl border border-dashed border-stone-300 p-8">
                <RotateCcw size={32} className="mx-auto text-stone-400 mb-3" />
                <h3 className="font-editorial text-xl font-bold text-[#20251F]">
                  No matching titles found
                </h3>
                <p className="text-xs text-[#5C635B] mt-1 max-w-sm mx-auto">
                  Try adjusting your filters, clearing your search keywords, or selecting a different category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-4 py-2 bg-[#315C46] text-white text-xs font-semibold rounded-lg hover:bg-[#244434] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden">
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-[#FAF7F2] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <span className="font-editorial text-lg font-bold text-[#20251F]">Filter Books</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-stone-500 mb-2">Category</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCategorySelect(c)}
                      className={`p-2 rounded text-xs text-left ${
                        selectedCategory === c
                          ? 'bg-[#315C46] text-white font-medium'
                          : 'bg-white border border-stone-200 text-stone-800'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-stone-500 mb-2">Format</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {formats.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFormat(f)}
                      className={`p-2 rounded text-xs text-left ${
                        selectedFormat === f
                          ? 'bg-[#20251F] text-white font-medium'
                          : 'bg-white border border-stone-200 text-stone-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-500">Max Price</span>
                  <span className="font-mono font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="350"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#315C46]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#315C46] text-white rounded-lg text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
