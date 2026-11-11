import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, BookOpen } from 'lucide-react';
import { Book } from '../../types/book';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectBook: (book: Book) => void;
  onViewAllResults: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  books,
  onSelectBook,
  onViewAllResults,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? books.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase()) ||
          b.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="w-full max-w-xl bg-[#FAF7F2] rounded-2xl border border-stone-300 shadow-2xl overflow-hidden">
        {/* Search Header Input */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search size={20} className="text-[#315C46]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or alcove..."
            className="flex-1 bg-transparent text-sm text-[#20251F] placeholder:text-stone-400 focus:outline-hidden"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-stone-400 hover:text-stone-700">
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 px-2 py-1 bg-stone-200/60 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results or Quick Suggestions */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim() ? (
            results.length > 0 ? (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block px-2">
                  Matching Titles ({results.length})
                </span>
                {results.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => {
                      onSelectBook(book);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-stone-200/50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-14 rounded shrink-0 p-1 flex items-center justify-center border border-stone-200"
                        style={{ backgroundColor: book.coverBgColor }}
                      >
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-editorial text-sm font-bold text-[#20251F]">
                          {book.title}
                        </h4>
                        <p className="text-xs text-[#5C635B]">
                          By {book.author} · {book.category}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-xs font-bold text-stone-900">
                      ₹{book.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}

                <button
                  onClick={() => {
                    onViewAllResults(query);
                    onClose();
                  }}
                  className="w-full mt-3 py-2 text-center text-xs font-semibold text-[#315C46] hover:underline flex items-center justify-center gap-1"
                >
                  <span>View all results for "{query}"</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-stone-500">
                No titles found matching "{query}".
              </div>
            )
          ) : (
            <div className="space-y-4 py-2">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block mb-2 px-1">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Architecture', 'Fiction', 'Western Ghats', 'Gestalten', 'Philosophy', 'Rilke'].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1 bg-stone-200/70 hover:bg-stone-300 text-stone-800 text-xs rounded transition-colors"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
