import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { TrustStrip } from './components/home/TrustStrip';
import { CuratedCollections } from './components/home/CuratedCollections';
import { GenreDiscovery } from './components/home/GenreDiscovery';
import { FeaturedBookStory } from './components/home/FeaturedBookStory';
import { JournalSection } from './components/home/JournalSection';
import { CatalogView } from './components/catalog/CatalogView';
import { BookDetailView } from './components/book/BookDetailView';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessView } from './components/order/OrderSuccessView';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { SearchModal } from './components/search/SearchModal';
import { BookModal3D } from './components/3d/BookModal3D';
import { AboutView } from './components/about/AboutView';
import { BOOKS_DATA, FEATURED_BOOK } from './data/books';
import { Book, BookCategory, BookFormat, CartItem, Order } from './types/book';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'book-detail' | 'order-success' | 'about'>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'Bestsellers' | undefined>(undefined);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Cart State (with localStorage persistence)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('panda_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (with localStorage persistence)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('panda_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set(['ff-01', 'ff-03']);
    } catch {
      return new Set(['ff-01', 'ff-03']);
    }
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [modal3DBook, setModal3DBook] = useState<Book>(FEATURED_BOOK);

  // Promo Code State
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedPromo, setAppliedPromo] = useState<string>('');

  // Completed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('panda_cart', JSON.stringify(cartItems));
    } catch {
      // safe fallback
    }
  }, [cartItems]);

  // Sync Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('panda_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch {
      // safe fallback
    }
  }, [wishlistIds]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cart Handlers
  const handleAddToCart = (book: Book, format?: BookFormat, quantity: number = 1) => {
    const chosenFormat = format || book.format;
    const formatObj = book.formatsAvailable.find((f) => f.format === chosenFormat);
    const chosenPrice = formatObj ? formatObj.price : book.price;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.book.id === book.id && item.selectedFormat === chosenFormat
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            book,
            quantity,
            selectedFormat: chosenFormat,
            selectedPrice: chosenPrice,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (bookId: string, format: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(bookId, format);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.book.id === bookId && item.selectedFormat === format
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveItem = (bookId: string, format: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.book.id === bookId && item.selectedFormat === format)
      )
    );
  };

  // Wishlist Handlers
  const handleToggleWishlist = (book: Book) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(book.id)) {
        next.delete(book.id);
      } else {
        next.add(book.id);
      }
      return next;
    });
  };

  // Promo Handler
  const handleApplyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'PANDA10' || clean === 'FOLIO10') {
      setDiscountPercent(10);
      setAppliedPromo('PANDA10');
      return { success: true, message: 'PANDA10 applied: 10% off your desired books!' };
    }
    if (clean === 'DESIRED15' || clean === 'FIRST15') {
      setDiscountPercent(15);
      setAppliedPromo('DESIRED15');
      return { success: true, message: 'DESIRED15 applied: 15% collector discount!' };
    }
    return { success: false, message: 'Invalid promo code. Try PANDA10 or DESIRED15' };
  };

  // Navigation Handlers
  const handleNavigate = (view: string, category?: BookCategory | 'Bestsellers') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'home') {
      setCurrentView('home');
      setSelectedCategory(undefined);
      setSelectedBook(null);
    } else if (view === 'catalog') {
      setSelectedCategory(category);
      setSearchFilter('');
      setCurrentView('catalog');
      setSelectedBook(null);
    } else if (view === 'bestsellers') {
      setSelectedCategory('Bestsellers' as any);
      setSearchFilter('');
      setCurrentView('catalog');
      setSelectedBook(null);
    } else if (view === 'about') {
      setCurrentView('about');
      setSelectedCategory(undefined);
      setSelectedBook(null);
    }
  };

  const handleSelectBook = (book: Book) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedBook(book);
    setCurrentView('book-detail');
  };

  const handleOpen3DModal = (book: Book) => {
    setModal3DBook(book);
    setIs3DModalOpen(true);
  };

  const handleBuyNow = (book: Book, format?: BookFormat, quantity: number = 1) => {
    handleAddToCart(book, format, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCompleteOrder = (order: Order) => {
    setConfirmedOrder(order);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setCurrentView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wishlistedBooks = BOOKS_DATA.filter((b) => wishlistIds.has(b.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E8] text-[#20251F] overflow-x-hidden w-full max-w-full">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeView={currentView}
        activeCategory={selectedCategory}
        onNavigate={handleNavigate}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Cinematic 3D Hero */}
            <Hero
              featuredBook={FEATURED_BOOK}
              onExploreClick={() => handleNavigate('catalog')}
              onBestsellersClick={() => handleNavigate('catalog')}
              onSelectBook={handleSelectBook}
              onOpen3DModal={handleOpen3DModal}
            />

            {/* Trust Strip */}
            <TrustStrip />

            {/* Curated Shelves & Collections */}
            <CuratedCollections
              books={BOOKS_DATA}
              onSelectBook={handleSelectBook}
              onAddToCart={(b) => handleAddToCart(b)}
              onToggleWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              onOpen3DModal={handleOpen3DModal}
              onViewAll={() => handleNavigate('catalog')}
            />

            {/* Editorial Genre Discovery */}
            <GenreDiscovery
              onSelectGenre={(cat) => handleNavigate('catalog', cat)}
            />

            {/* Featured Book Monograph Story */}
            <FeaturedBookStory
              book={FEATURED_BOOK}
              onSelectBook={handleSelectBook}
              onAddToCart={(b) => handleAddToCart(b)}
              onOpen3DModal={handleOpen3DModal}
            />

            {/* The Folio Journal */}
            <JournalSection />
          </>
        )}

        {currentView === 'catalog' && (
          <CatalogView
            books={BOOKS_DATA}
            initialCategory={selectedCategory === 'Bestsellers' ? undefined : (selectedCategory as BookCategory | undefined)}
            initialSearch={searchFilter}
            onSelectBook={handleSelectBook}
            onAddToCart={(b) => handleAddToCart(b)}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onOpen3DModal={handleOpen3DModal}
            onCategoryChange={(cat) => setSelectedCategory(cat)}
          />
        )}

        {currentView === 'book-detail' && selectedBook && (
          <BookDetailView
            book={selectedBook}
            allBooks={BOOKS_DATA}
            onBack={() => setCurrentView('catalog')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.has(selectedBook.id)}
            onOpen3DModal={handleOpen3DModal}
            onSelectBook={handleSelectBook}
          />
        )}

        {currentView === 'order-success' && confirmedOrder && (
          <OrderSuccessView
            order={confirmedOrder}
            onContinueShopping={() => handleNavigate('home')}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            onBack={() => handleNavigate('home')}
            onExplore={() => handleNavigate('catalog')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => {
          setIsCartOpen(false);
          handleNavigate('catalog');
        }}
        discount={discountPercent}
        promoCode={appliedPromo}
        onApplyPromo={handleApplyPromo}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discount={discountPercent}
        promoCode={appliedPromo}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        books={wishlistedBooks}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(b) => {
          handleAddToCart(b);
          setIsWishlistOpen(false);
        }}
        onSelectBook={handleSelectBook}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        books={BOOKS_DATA}
        onSelectBook={handleSelectBook}
        onViewAllResults={(q) => {
          setSearchFilter(q);
          setSelectedCategory(undefined);
          setCurrentView('catalog');
        }}
      />

      {/* 3D Book Inspection Modal */}
      <BookModal3D
        book={modal3DBook}
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
        onAddToCart={(b) => handleAddToCart(b)}
      />
    </div>
  );
}
