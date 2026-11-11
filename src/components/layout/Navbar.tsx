import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ArrowRight } from 'lucide-react';
import { BookCategory } from '../../types/book';
import { PandaLogo } from '../ui/PandaLogo';

interface NavbarProps {
  activeView: string;
  activeCategory?: BookCategory | string;
  onNavigate: (view: string, categoryFilter?: BookCategory | 'Bestsellers') => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  activeCategory,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
}) => {
  const [showBanner, setShowBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomeActive = activeView === 'home';
  const isShopAllActive = activeView === 'catalog' && (!activeCategory || activeCategory === 'All');
  const isFictionActive = activeView === 'catalog' && activeCategory === 'Fiction';
  const isNonfictionActive = activeView === 'catalog' && activeCategory === 'Nonfiction';
  const isArtActive = activeView === 'catalog' && (activeCategory === 'Art & Architecture' || activeCategory === 'Architecture & Art');
  const isBestsellersActive = activeCategory === 'Bestsellers' || activeView === 'bestsellers';
  const isAboutActive = activeView === 'about';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#20251F]/8">
      {/* Announcement Strip */}
      {showBanner && (
        <div className="bg-[#20251F] text-[#F6F1E8] text-xs py-2 px-4 flex items-center justify-between text-center font-medium tracking-wide">
          <div className="mx-auto flex items-center gap-2">
            <span>Free express delivery across India on orders over ₹799</span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span className="hidden sm:inline opacity-80">Archival bindings & 14-day returns</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-[#F6F1E8]/70 hover:text-white text-xs p-1"
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Top Navigation (3-Zone Contract) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Caption */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 text-[#20251F] hover:text-[#315C46]"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          
          <button
            onClick={() => onNavigate('home')}
            className="text-left group transition-colors whitespace-nowrap shrink-0 flex items-center gap-3 cursor-pointer"
            title="PANDA STORE - Go to Home"
            aria-label="Panda Store - Go to Home"
            aria-current={isHomeActive ? 'page' : undefined}
          >
            <PandaLogo size={36} className="text-[#20251F] group-hover:scale-105 transition-transform shrink-0" />
            <div className="flex flex-col justify-center">
              <span className={`font-editorial text-2xl md:text-3xl font-bold tracking-tight transition-colors leading-none ${
                isHomeActive ? 'text-[#20251F]' : 'text-[#20251F] group-hover:text-[#315C46]'
              }`}>
                PANDA STORE
              </span>
              <span className="text-[10px] tracking-wider text-[#5C635B] font-medium uppercase mt-1">
                Buy your Desired Books
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-7 text-xs lg:text-sm font-medium text-[#5C635B]">
          <button
            onClick={() => onNavigate('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#20251F] cursor-pointer ${
              isShopAllActive ? 'text-[#20251F] font-semibold underline underline-offset-8 decoration-[#315C46] decoration-2' : ''
            }`}
          >
            Shop All Books
          </button>
          <button
            onClick={() => onNavigate('catalog', 'Fiction')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#20251F] cursor-pointer ${
              isFictionActive ? 'text-[#20251F] font-semibold underline underline-offset-8 decoration-[#315C46] decoration-2' : ''
            }`}
          >
            Fiction
          </button>
          <button
            onClick={() => onNavigate('catalog', 'Nonfiction')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#20251F] cursor-pointer ${
              isNonfictionActive ? 'text-[#20251F] font-semibold underline underline-offset-8 decoration-[#315C46] decoration-2' : ''
            }`}
          >
            Nonfiction
          </button>
          <button
            onClick={() => onNavigate('catalog', 'Art & Architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#20251F] cursor-pointer ${
              isArtActive ? 'text-[#20251F] font-semibold underline underline-offset-8 decoration-[#315C46] decoration-2' : ''
            }`}
          >
            Architecture & Art
          </button>
          <button
            onClick={() => onNavigate('bestsellers')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#20251F] cursor-pointer ${
              isBestsellersActive ? 'text-[#20251F] font-semibold underline underline-offset-8 decoration-[#315C46] decoration-2' : ''
            }`}
          >
            Bestsellers
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#20251F] cursor-pointer ${
              isAboutActive ? 'text-[#20251F] font-semibold underline underline-offset-8 decoration-[#315C46] decoration-2' : ''
            }`}
          >
            Our Story
          </button>
        </nav>

        {/* Zone 3: Utility Cluster */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 text-xs font-medium text-[#5C635B] hover:text-[#20251F] p-2 rounded-md hover:bg-stone-200/50 transition-colors"
            title="Search books (Ctrl+K)"
          >
            <Search size={18} />
            <span className="hidden lg:inline text-stone-400">Search books...</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-[#5C635B] hover:text-rose-600 transition-colors"
            aria-label="Wishlist"
            title="View wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-2 bg-[#20251F] hover:bg-[#315C46] text-[#F6F1E8] rounded-lg transition-colors shadow-xs"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={18} />
            <span className="text-xs font-semibold hidden sm:inline">Bag</span>
            <span className="bg-[#315C46] text-white text-xs font-mono px-1.5 py-0.2 rounded font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FAF7F2] p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-stone-200">
                <button
                  onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2.5 text-left group cursor-pointer"
                  title="PANDA STORE - Go to Home"
                  aria-label="Panda Store - Go to Home"
                >
                  <PandaLogo size={32} className="shrink-0 group-hover:scale-105 transition-transform" />
                  <div>
                    <span className="font-editorial text-xl font-bold text-[#20251F] group-hover:text-[#315C46] transition-colors block leading-none">
                      PANDA STORE
                    </span>
                    <span className="text-[10px] tracking-wider text-[#5C635B] font-medium uppercase mt-0.5 block">
                      Buy your Desired Books
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-500 hover:text-stone-900 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="mt-6 space-y-3">
                <button
                  onClick={() => { onNavigate('catalog'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2 text-base flex items-center justify-between ${
                    isShopAllActive ? 'text-[#315C46] font-bold' : 'font-medium text-stone-800 hover:text-[#315C46]'
                  }`}
                >
                  <span>Shop All Books</span>
                  <ArrowRight size={16} className={isShopAllActive ? 'text-[#315C46]' : 'text-stone-400'} />
                </button>
                <button
                  onClick={() => { onNavigate('catalog', 'Fiction'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2 text-base flex items-center justify-between ${
                    isFictionActive ? 'text-[#315C46] font-bold' : 'font-medium text-stone-800 hover:text-[#315C46]'
                  }`}
                >
                  <span>Fiction</span>
                  <ArrowRight size={16} className={isFictionActive ? 'text-[#315C46]' : 'text-stone-400'} />
                </button>
                <button
                  onClick={() => { onNavigate('catalog', 'Nonfiction'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2 text-base flex items-center justify-between ${
                    isNonfictionActive ? 'text-[#315C46] font-bold' : 'font-medium text-stone-800 hover:text-[#315C46]'
                  }`}
                >
                  <span>Nonfiction</span>
                  <ArrowRight size={16} className={isNonfictionActive ? 'text-[#315C46]' : 'text-stone-400'} />
                </button>
                <button
                  onClick={() => { onNavigate('catalog', 'Art & Architecture'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2 text-base flex items-center justify-between ${
                    isArtActive ? 'text-[#315C46] font-bold' : 'font-medium text-stone-800 hover:text-[#315C46]'
                  }`}
                >
                  <span>Architecture & Art</span>
                  <ArrowRight size={16} className={isArtActive ? 'text-[#315C46]' : 'text-stone-400'} />
                </button>
                <button
                  onClick={() => { onNavigate('bestsellers'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2 text-base flex items-center justify-between ${
                    isBestsellersActive ? 'text-[#315C46] font-bold' : 'font-medium text-stone-800 hover:text-[#315C46]'
                  }`}
                >
                  <span>Bestsellers</span>
                  <ArrowRight size={16} className={isBestsellersActive ? 'text-[#315C46]' : 'text-stone-400'} />
                </button>
                <button
                  onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
                  className={`w-full text-left py-2 text-base flex items-center justify-between ${
                    isAboutActive ? 'text-[#315C46] font-bold' : 'font-medium text-stone-800 hover:text-[#315C46]'
                  }`}
                >
                  <span>Our Story</span>
                  <ArrowRight size={16} className={isAboutActive ? 'text-[#315C46]' : 'text-stone-400'} />
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-stone-200">
              <p className="text-xs text-stone-500">
                Independent Booksellers · Established 2024
              </p>
              <p className="text-xs text-stone-400 mt-1">Delivery across India in 2–4 days</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
