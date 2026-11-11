import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../../types/book';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (bookId: string, format: string, newQty: number) => void;
  onRemoveItem: (bookId: string, format: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
  discount: number;
  promoCode: string;
  onApplyPromo: (code: string) => { success: boolean; message: string };
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
  discount,
  promoCode,
  onApplyPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  const freeShippingThreshold = 799;
  const isFreeShipping = subtotal >= freeShippingThreshold || items.length === 0;
  const shippingFee = isFreeShipping ? 0 : 49;
  const discountAmount = Math.round((subtotal * discount) / 100);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = onApplyPromo(promoInput);
    setPromoMessage({ success: res.success, text: res.message });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-l border-stone-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#315C46]" />
            <h2 className="font-editorial text-xl font-bold text-[#20251F]">
              Your Shopping Bag
            </h2>
            <span className="text-xs font-mono bg-stone-200 px-2 py-0.5 rounded-full text-stone-700 font-bold">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#ECE5D8] px-6 py-3 border-b border-stone-300/80">
          <div className="flex justify-between text-xs mb-1.5 font-medium text-[#20251F]">
            {isFreeShipping && subtotal > 0 ? (
              <span className="text-emerald-800 font-semibold flex items-center gap-1">
                ✓ Free courier delivery applied!
              </span>
            ) : (
              <span>Add ₹{amountNeededForFreeShipping} more for Free Shipping</span>
            )}
            <span className="font-mono text-[11px] text-stone-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-300 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#315C46] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-200">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={`${item.book.id}-${item.selectedFormat}`}
                className="py-4 first:pt-0 last:pb-0 flex gap-4"
              >
                {/* Book Thumbnail */}
                <div
                  className="w-16 h-22 rounded shrink-0 p-1 flex items-center justify-center border border-stone-200 book-shadow-sm"
                  style={{ backgroundColor: item.book.coverBgColor }}
                >
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xs"
                  />
                </div>

                {/* Info & Stepper */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-editorial text-sm font-bold text-[#20251F] leading-tight line-clamp-1">
                        {item.book.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.book.id, item.selectedFormat)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#5C635B] mt-0.5">By {item.book.author}</p>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {item.selectedFormat}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-300 rounded bg-white overflow-hidden text-xs">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.book.id, item.selectedFormat, item.quantity - 1)
                        }
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 font-mono font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.book.id, item.selectedFormat, item.quantity + 1)
                        }
                        className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-[#20251F]">
                      ₹{(item.selectedPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty Cart State
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-stone-200/80 mx-auto flex items-center justify-center text-stone-400 mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#20251F]">
                Your bag is empty
              </h3>
              <p className="text-xs text-[#5C635B] mt-1 max-w-xs mx-auto">
                No volumes have been selected yet. Explore our curated collections to find your next companion.
              </p>
              <button
                onClick={onContinueShopping}
                className="mt-6 px-5 py-2.5 bg-[#315C46] text-white text-xs font-semibold rounded-lg hover:bg-[#244434] transition-colors"
              >
                Browse All Books
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer & Order Summary */}
        {items.length > 0 && (
          <div className="p-6 bg-[#FAF7F2] border-t border-stone-200 space-y-4">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Discount code (try PANDA10)"
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs uppercase font-mono text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-[#315C46]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold"
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <p
                className={`text-[11px] ${
                  promoMessage.success ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {promoMessage.text}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5C635B]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 font-medium">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Promo Discount ({promoCode})</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-stone-900">
                  {shippingFee === 0 ? 'Free' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-[#20251F]">
                <span>Estimated Total</span>
                <span className="font-mono text-base">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-[#315C46] hover:bg-[#244434] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <p className="text-[11px] text-center text-stone-400">
              Tax calculated and included · Safe checkout with UPI & Cards
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
