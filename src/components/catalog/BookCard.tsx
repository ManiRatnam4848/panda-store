import React, { useState } from 'react';
import { Heart, ShoppingBag, Box, Star, Check } from 'lucide-react';
import { Book } from '../../types/book';

interface BookCardProps {
  book: Book;
  onSelectBook: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleWishlist: (book: Book) => void;
  isWishlisted: boolean;
  onOpen3DModal: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelectBook,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onOpen3DModal,
}) => {
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(book);
  };

  const handle3D = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen3DModal(book);
  };

  return (
    <div
      onClick={() => onSelectBook(book)}
      className="group relative flex flex-col bg-[#FAF7F2] rounded-lg border border-[#20251F]/8 hover:border-[#20251F]/20 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Cover Image Presentation Container */}
      <div
        className="relative h-72 md:h-80 w-full overflow-hidden flex items-center justify-center p-6 transition-colors duration-300"
        style={{ backgroundColor: book.coverBgColor }}
      >
        {/* Subtle vignette/lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />

        {/* 3D Perspective Book Cover Graphic */}
        <div className="relative w-44 h-60 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-1 book-shadow">
          {!imageError ? (
            <img
              src={book.coverImage}
              alt={book.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-r-sm rounded-l-[1px]"
              loading="lazy"
            />
          ) : (
            // Styled Resilient Fallback Cover
            <div
              className="w-full h-full p-4 flex flex-col justify-between border border-white/20 rounded-r-sm"
              style={{ backgroundColor: book.coverBgColor, color: book.coverTextColor }}
            >
              <div className="text-center">
                <span className="text-[9px] uppercase tracking-widest block font-medium opacity-80">
                  {book.category}
                </span>
                <div className="w-8 h-px bg-current mx-auto my-2 opacity-40" />
                <h4 className="font-editorial text-sm font-bold leading-tight">{book.title}</h4>
              </div>
              <p className="text-[10px] text-center font-medium uppercase tracking-wider opacity-90">
                {book.author}
              </p>
            </div>
          )}

          {/* Book Spine crease effect */}
          <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />
        </div>

        {/* Top Badges / Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {book.bestseller ? (
            <span className="text-[11px] font-medium text-stone-800 bg-[#FAF7F2]/90 backdrop-blur-sm px-2.5 py-0.5 rounded shadow-xs">
              Bestseller
            </span>
          ) : book.newArrival ? (
            <span className="text-[11px] font-medium text-[#315C46] bg-[#FAF7F2]/90 backdrop-blur-sm px-2.5 py-0.5 rounded shadow-xs">
              New Arrival
            </span>
          ) : <div />}

          <div className="flex items-center gap-1.5">
            {/* 3D Inspect Action */}
            <button
              onClick={handle3D}
              aria-label="Inspect in 3D"
              className="p-1.5 rounded-full bg-[#FAF7F2]/90 text-stone-700 hover:text-[#315C46] hover:bg-[#FAF7F2] transition-colors shadow-xs"
              title="Inspect 3D Hardcover"
            >
              <Box size={15} />
            </button>

            {/* Wishlist Action */}
            <button
              onClick={handleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`p-1.5 rounded-full backdrop-blur-sm transition-colors shadow-xs ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-[#FAF7F2]/90 text-stone-700 hover:text-rose-600 hover:bg-[#FAF7F2]'
              }`}
            >
              <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-[#FAF7F2]">
        <div>
          {/* Metadata line with typographic separators (Zero-Pill discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-[#5C635B] mb-1">
            <span>{book.category}</span>
            <span aria-hidden="true">·</span>
            <span>{book.format}</span>
          </div>

          <h3 className="font-editorial text-lg font-bold text-[#20251F] leading-snug line-clamp-1 group-hover:text-[#315C46] transition-colors">
            {book.title}
          </h3>

          <p className="text-xs text-[#5C635B] mt-0.5">By {book.author}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-[#5C635B]">
            <div className="flex items-center text-amber-600">
              <Star size={13} fill="currentColor" />
            </div>
            <span className="font-medium text-stone-900">{book.rating.toFixed(1)}</span>
            <span className="text-stone-400">({book.reviewCount})</span>
          </div>
        </div>

        {/* Price & Buy Action */}
        <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-base font-bold text-[#20251F]">
              ₹{book.price.toLocaleString('en-IN')}
            </span>
            {book.originalPrice && (
              <span className="font-mono text-xs text-stone-400 line-through">
                ₹{book.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!book.inStock}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
              added
                ? 'bg-emerald-700 text-white'
                : 'bg-[#20251F] hover:bg-[#315C46] text-white shadow-xs'
            }`}
          >
            {added ? (
              <>
                <Check size={13} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
