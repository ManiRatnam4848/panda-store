import React, { useState } from 'react';
import { 
  ArrowLeft, Heart, ShoppingBag, Box, Star, Truck, ShieldCheck, 
  RefreshCw, Check, MapPin, ChevronRight, MessageSquare, BookOpen, X
} from 'lucide-react';
import { Book, BookFormat, BookReview } from '../../types/book';
import { BookCard } from '../catalog/BookCard';

interface BookDetailViewProps {
  book: Book;
  allBooks: Book[];
  onBack: () => void;
  onAddToCart: (book: Book, format?: BookFormat, quantity?: number) => void;
  onBuyNow: (book: Book, format?: BookFormat, quantity?: number) => void;
  onToggleWishlist: (book: Book) => void;
  isWishlisted: boolean;
  onOpen3DModal: (book: Book) => void;
  onSelectBook: (book: Book) => void;
}

export const BookDetailView: React.FC<BookDetailViewProps> = ({
  book,
  allBooks,
  onBack,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onOpen3DModal,
  onSelectBook,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<BookFormat>(book.format);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'author' | 'reviews'>('overview');
  const [showExcerptModal, setShowExcerptModal] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewsList, setReviewsList] = useState<BookReview[]>(book.reviews);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  const currentPrice = React.useMemo(() => {
    const f = book.formatsAvailable.find((item) => item.format === selectedFormat);
    return f ? f.price : book.price;
  }, [book, selectedFormat]);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus(`Standard courier delivery to ${pincode} by ${new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleAdd = () => {
    onAddToCart(book, selectedFormat, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDirectBuy = () => {
    onBuyNow(book, selectedFormat, quantity);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newRev: BookReview = {
      id: `rev-${Date.now()}`,
      reviewer: newReviewName,
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle || 'Reader note',
      comment: newReviewComment,
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setShowReviewModal(false);
    setNewReviewName('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  // Related books from same category
  const relatedBooks = allBooks
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 3);

  return (
    <div className="py-8 bg-[#F6F1E8] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C635B] hover:text-[#20251F] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Books</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#5C635B] hidden sm:flex">
            <span>Books</span>
            <span>/</span>
            <span>{book.category}</span>
            <span>/</span>
            <span className="text-[#20251F] font-medium truncate max-w-xs">{book.title}</span>
          </div>
        </div>

        {/* Product Details Section (Split Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Visual Gallery & 3D Interactive trigger (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div
              className="relative w-full max-w-md aspect-3/4 rounded-2xl p-8 flex flex-col justify-center items-center overflow-hidden border border-[#20251F]/8"
              style={{ backgroundColor: book.coverBgColor }}
            >
              {/* Backing gradient */}
              <div className="absolute inset-0 bg-radial from-white/10 to-black/15 pointer-events-none" />

              {/* Central Dimensional Book Preview */}
              <div className="relative w-56 sm:w-64 h-80 sm:h-92 book-shadow-lg transition-transform duration-500 hover:scale-102">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-r-sm rounded-l-[1px]"
                />
                {/* Spine crease shadow */}
                <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Actions below cover: 3D inspect & Look Inside */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => onOpen3DModal(book)}
                  className="bg-[#20251F] hover:bg-[#315C46] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                >
                  <Box size={15} />
                  <span>Inspect in 3D</span>
                </button>

                <button
                  onClick={() => setShowExcerptModal(true)}
                  className="bg-white hover:bg-stone-100 text-[#20251F] border border-stone-300 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all hover:scale-105"
                >
                  <BookOpen size={15} className="text-[#315C46]" />
                  <span>Look Inside Excerpt</span>
                </button>
              </div>
            </div>

            {/* Micro specs under cover */}
            <div className="w-full max-w-md mt-6 grid grid-cols-3 gap-2 text-center text-xs text-[#5C635B] bg-[#FAF7F2] p-3 rounded-lg border border-stone-200/80">
              <div>
                <span className="block text-stone-400 text-[10px] uppercase">Format</span>
                <span className="font-semibold text-stone-800">{selectedFormat}</span>
              </div>
              <div className="border-x border-stone-200">
                <span className="block text-stone-400 text-[10px] uppercase">Pages</span>
                <span className="font-mono font-semibold text-stone-800">{book.pages}</span>
              </div>
              <div>
                <span className="block text-stone-400 text-[10px] uppercase">Weight</span>
                <span className="font-semibold text-stone-800">{book.weight}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Editorial Specs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-widest text-[#315C46] font-semibold">
                  {book.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-[#5C635B]">
                  <div className="flex items-center text-amber-600">
                    <Star size={14} fill="currentColor" />
                  </div>
                  <span className="font-semibold text-stone-900">{book.rating.toFixed(1)}</span>
                  <span>({reviewsList.length} verified reviews)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#20251F] mt-2 leading-tight">
                {book.title}
              </h1>

              {book.subtitle && (
                <p className="font-editorial text-lg italic text-[#5C635B] mt-1">
                  {book.subtitle}
                </p>
              )}

              <p className="text-sm font-medium text-[#20251F] mt-3">
                By <span className="underline decoration-stone-300">{book.author}</span>
              </p>

              {/* Price Block */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-mono text-3xl font-bold text-[#20251F]">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {book.originalPrice && book.originalPrice > currentPrice && (
                  <span className="font-mono text-base text-stone-400 line-through">
                    ₹{book.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded font-medium">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Format Selector */}
              <div className="mt-6">
                <span className="text-xs font-semibold text-stone-700 block mb-2">
                  Select Edition Format:
                </span>
                <div className="flex flex-wrap gap-2">
                  {book.formatsAvailable.map((fmt) => (
                    <button
                      key={fmt.format}
                      onClick={() => setSelectedFormat(fmt.format)}
                      className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                        selectedFormat === fmt.format
                          ? 'bg-[#20251F] text-white border-[#20251F] shadow-xs'
                          : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <span>{fmt.format}</span>
                      <span className="font-mono ml-2 opacity-80">
                        ₹{fmt.price.toLocaleString('en-IN')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Stock status */}
              <div className="mt-6 flex items-center gap-6">
                <div>
                  <span className="text-xs font-semibold text-stone-700 block mb-2">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 font-bold"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-mono text-xs font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(book.stockCount, quantity + 1))}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-stone-400 block mb-1">Availability</span>
                  {book.inStock ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      In Stock ({book.stockCount} copies left)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">Out of stock</span>
                  )}
                </div>
              </div>

              {/* Purchase Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAdd}
                  disabled={!book.inStock}
                  className={`flex-1 py-3.5 px-6 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#315C46] hover:bg-[#244434] text-white hover:shadow-md'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDirectBuy}
                  disabled={!book.inStock}
                  className="flex-1 py-3.5 px-6 rounded-lg text-sm font-semibold bg-[#20251F] hover:bg-stone-800 text-white transition-all shadow-sm"
                >
                  Buy Now with 1-Click
                </button>

                <button
                  onClick={() => onToggleWishlist(book)}
                  className={`p-3.5 rounded-lg border transition-colors flex items-center justify-center ${
                    isWishlisted
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-stone-300 bg-white text-stone-700 hover:text-rose-600'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* India Delivery Estimator */}
              <div className="mt-8 p-4 bg-[#FAF7F2] rounded-xl border border-stone-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#20251F] mb-2">
                  <MapPin size={15} className="text-[#315C46]" />
                  <span>Check Courier Delivery Estimate</span>
                </div>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit Pincode (e.g. 400001)"
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-hidden focus:border-[#315C46]"
                  />
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-semibold"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-xs text-[#315C46] mt-2 font-medium">{pincodeStatus}</p>
                )}
              </div>
            </div>

            {/* Store Guarantee Strip */}
            <div className="mt-8 pt-6 border-t border-stone-200/80 grid grid-cols-2 gap-4 text-xs text-[#5C635B]">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#315C46] shrink-0" />
                <span>Free dispatch across India over ₹799</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#315C46] shrink-0" />
                <span>Archival linen & certified paper</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Tabs: Description / Author / Reviews */}
        <div className="mt-16 pt-10 border-t border-stone-300">
          <div className="flex border-b border-stone-200 gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-[#315C46] text-[#20251F]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Overview & Specifications
            </button>
            <button
              onClick={() => setActiveTab('author')}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'author'
                  ? 'border-b-2 border-[#315C46] text-[#20251F]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              About the Author
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-[#315C46] text-[#20251F]'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Reader Reviews ({reviewsList.length})
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-7 space-y-4 text-sm text-[#5C635B] leading-relaxed">
                  <p>{book.description}</p>
                  <blockquote className="my-4 p-4 border-l-2 border-[#C66B48] bg-[#FAF7F2] font-editorial text-base italic text-[#20251F]">
                    "{book.excerpt}"
                  </blockquote>
                </div>

                <div className="md:col-span-5 bg-[#FAF7F2] p-6 rounded-xl border border-stone-200">
                  <h4 className="text-xs uppercase font-semibold text-stone-500 mb-4 tracking-wider">
                    Volume Specifications
                  </h4>
                  <dl className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">ISBN-13</dt>
                      <dd className="font-mono text-stone-900">{book.isbn}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Publisher</dt>
                      <dd className="font-medium text-stone-900">{book.publisher}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Language</dt>
                      <dd className="font-medium text-stone-900">{book.language}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Dimensions</dt>
                      <dd className="font-medium text-stone-900">{book.dimensions}</dd>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <dt className="text-stone-500">Publication Year</dt>
                      <dd className="font-mono text-stone-900">{book.publishedYear}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'author' && (
              <div className="max-w-2xl text-sm text-[#5C635B] space-y-3 leading-relaxed">
                <h3 className="font-editorial text-2xl font-bold text-[#20251F]">
                  {book.author}
                </h3>
                <p>{book.authorBio}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[#20251F]">
                      Reader Notes & Impressions
                    </h3>
                    <p className="text-xs text-[#5C635B]">
                      Average rating: {book.rating.toFixed(1)} out of 5 stars
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-4 py-2 bg-[#315C46] text-white text-xs font-semibold rounded-lg hover:bg-[#244434] transition-colors"
                  >
                    Write a Review
                  </button>
                </div>

                {reviewsList.length > 0 ? (
                  <div className="space-y-4">
                    {reviewsList.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 bg-[#FAF7F2] rounded-xl border border-stone-200"
                      >
                        <div className="flex items-center justify-between text-xs text-[#5C635B] mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900">{rev.reviewer}</span>
                            {rev.verified && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                                Verified Reader
                              </span>
                            )}
                          </div>
                          <span>{rev.date}</span>
                        </div>
                        <div className="flex text-amber-600 mb-2">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                        <h4 className="text-sm font-semibold text-stone-900">{rev.title}</h4>
                        <p className="text-xs text-[#5C635B] mt-1 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 py-6">
                    No reader notes submitted yet. Be the first to share your impressions!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Books Shelf */}
        {relatedBooks.length > 0 && (
          <div className="mt-20 pt-12 border-t border-stone-300">
            <h3 className="font-editorial text-2xl font-bold text-[#20251F] mb-6">
              You may also appreciate
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedBooks.map((rel) => (
                <BookCard
                  key={rel.id}
                  book={rel}
                  onSelectBook={onSelectBook}
                  onAddToCart={(b) => onAddToCart(b)}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={false}
                  onOpen3DModal={onOpen3DModal}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] p-6 rounded-xl border border-stone-300 max-w-md w-full shadow-2xl">
            <h3 className="font-editorial text-xl font-bold text-[#20251F] mb-1">
              Write a Reader Note
            </h3>
            <p className="text-xs text-[#5C635B] mb-4">
              Share your thoughts on {book.title}
            </p>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="e.g. Meera S."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#315C46]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className={`p-2 rounded text-xs font-bold ${
                        newReviewRating >= star ? 'text-amber-600 bg-amber-50' : 'text-stone-300'
                      }`}
                    >
                      <Star size={16} fill={newReviewRating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Exceptional binding and prose"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#315C46]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Comments</label>
                <textarea
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Write your review here..."
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-[#315C46]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2 text-xs border border-stone-300 rounded-lg font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs bg-[#315C46] text-white rounded-lg font-semibold hover:bg-[#244434]"
                >
                  Submit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Look Inside Excerpt Modal */}
      {showExcerptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF7F2] border border-stone-300 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-[#F6F1E8] border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#315C46] tracking-widest block">
                  PANDA STORE · FIRST CHAPTER PREVIEW
                </span>
                <h3 className="font-editorial text-lg font-bold text-[#20251F]">
                  {book.title}
                </h3>
              </div>
              <button
                onClick={() => setShowExcerptModal(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 sm:p-12 overflow-y-auto bg-[#FFFDF9] space-y-6">
              <div className="text-center pb-6 border-b border-stone-200">
                <span className="text-xs uppercase font-serif tracking-widest text-stone-500 block mb-1">
                  CHAPTER ONE
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#20251F]">
                  On the Threshold of Light
                </h2>
                <div className="w-12 h-0.5 bg-[#C66B48] mx-auto mt-3" />
              </div>

              <div className="font-editorial text-base sm:text-lg text-[#20251F] leading-relaxed space-y-4">
                <p>
                  <span className="float-left text-5xl font-editorial font-bold text-[#315C46] leading-none pr-3 pt-1">
                    {book.excerpt.charAt(0)}
                  </span>
                  {book.excerpt.slice(1)}
                </p>
                <p className="text-stone-600">
                  {book.description}
                </p>
                <p className="text-stone-600 italic border-l-2 border-[#315C46] pl-4 py-1">
                  "Every book holds its breath until opened. Its typography was set in metal before it ever met your eye, pressed into Munken cream sheets with archival vegetable ink."
                </p>
              </div>

              <div className="pt-8 border-t border-stone-200 flex items-center justify-between text-xs text-stone-400">
                <span>Page 1 of {book.pages}</span>
                <span>Typeset in Cormorant & Caslon · Panda Store Editions</span>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-stone-200 flex justify-between items-center">
              <span className="font-mono text-xs font-semibold text-stone-800">
                ₹{currentPrice.toLocaleString('en-IN')} ({selectedFormat})
              </span>
              <button
                onClick={() => {
                  setShowExcerptModal(false);
                  handleAdd();
                }}
                className="px-5 py-2 bg-[#315C46] hover:bg-[#244434] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <ShoppingBag size={14} />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
