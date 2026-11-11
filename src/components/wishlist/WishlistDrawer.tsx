import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Book } from '../../types/book';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onRemoveFromWishlist: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onSelectBook: (book: Book) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  books,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectBook,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-l border-stone-300">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-rose-600 fill-rose-600" />
            <h2 className="font-editorial text-xl font-bold text-[#20251F]">
              Saved Volumes
            </h2>
            <span className="text-xs font-mono bg-stone-200 px-2 py-0.5 rounded-full text-stone-700 font-bold">
              {books.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-200">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                <div
                  onClick={() => {
                    onSelectBook(book);
                    onClose();
                  }}
                  className="w-16 h-22 rounded shrink-0 p-1 flex items-center justify-center border border-stone-200 cursor-pointer book-shadow-sm"
                  style={{ backgroundColor: book.coverBgColor }}
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4
                        onClick={() => {
                          onSelectBook(book);
                          onClose();
                        }}
                        className="font-editorial text-sm font-bold text-[#20251F] leading-tight line-clamp-1 cursor-pointer hover:text-[#315C46]"
                      >
                        {book.title}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(book)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#5C635B] mt-0.5">By {book.author}</p>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {book.format}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-sm font-bold text-[#20251F]">
                      ₹{book.price.toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => onAddToCart(book)}
                      className="px-3 py-1 bg-[#315C46] hover:bg-[#244434] text-white text-xs font-semibold rounded flex items-center gap-1.5"
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-stone-400">
              <Heart size={36} className="mx-auto mb-3 opacity-40" />
              <p className="font-editorial text-lg font-bold text-stone-800">
                Your reading list is empty
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Save volumes to return to them later.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-stone-200 bg-[#FAF7F2]">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-100"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
