import React, { useEffect } from 'react';
import { CheckCircle2, PackageCheck, Printer, ArrowRight, Truck, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../../types/book';

interface OrderSuccessViewProps {
  order: Order;
  onContinueShopping: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  onContinueShopping,
}) => {
  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#315C46', '#C66B48', '#20251F', '#FAF7F2'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 bg-[#F6F1E8] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-xs uppercase font-semibold text-[#315C46] tracking-widest block mb-1">
            ORDER CONFIRMED
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#20251F]">
            Thank you for your order
          </h1>
          <p className="text-sm text-[#5C635B] mt-2 max-w-md mx-auto">
            We have reserved your volumes and are preparing them in archival packaging. A confirmation has been logged for <span className="font-semibold text-stone-900">{order.customer.email}</span>.
          </p>
        </div>

        {/* Invoice Card */}
        <div className="bg-[#FAF7F2] rounded-2xl border border-stone-300 p-6 sm:p-8 shadow-sm">
          {/* Order Header Meta */}
          <div className="flex flex-wrap items-center justify-between pb-6 border-b border-stone-200 gap-4">
            <div>
              <span className="text-xs text-stone-400 block">Order Number</span>
              <span className="font-mono text-lg font-bold text-[#20251F]">
                {order.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-xs text-stone-400 block">Order Date</span>
              <span className="text-xs font-semibold text-stone-800">{order.date}</span>
            </div>
            <div>
              <span className="text-xs text-stone-400 block">Estimated Arrival</span>
              <span className="text-xs font-semibold text-[#315C46]">
                {order.estimatedDeliveryDate}
              </span>
            </div>
            <button
              onClick={handlePrint}
              className="p-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5"
            >
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
          </div>

          {/* Delivery Tracking Bar */}
          <div className="py-6 border-b border-stone-200">
            <span className="text-xs uppercase font-semibold text-stone-500 tracking-wider block mb-3">
              Fulfillment Status
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#315C46] text-white flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <span className="font-semibold text-stone-900 mt-1">Confirmed</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#315C46] text-white flex items-center justify-center font-bold text-[10px]">
                  2
                </div>
                <span className="font-semibold text-[#315C46] mt-1">Packaging</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center font-bold text-[10px]">
                  3
                </div>
                <span className="text-stone-400 mt-1">Dispatched</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center font-bold text-[10px]">
                  4
                </div>
                <span className="text-stone-400 mt-1">Delivered</span>
              </div>
            </div>
          </div>

          {/* Ordered Books Table */}
          <div className="py-6 border-b border-stone-200">
            <h3 className="text-xs uppercase font-semibold text-stone-500 tracking-wider mb-4">
              Volumes Selected
            </h3>
            <div className="divide-y divide-stone-200/60">
              {order.items.map((item) => (
                <div key={item.book.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-14 rounded p-1 flex items-center justify-center border border-stone-200"
                      style={{ backgroundColor: item.book.coverBgColor }}
                    >
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-editorial text-sm font-bold text-[#20251F]">
                        {item.book.title}
                      </h4>
                      <p className="text-xs text-[#5C635B]">
                        {item.selectedFormat} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#20251F]">
                    ₹{(item.selectedPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address & Payment Info */}
          <div className="py-6 border-b border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <h4 className="uppercase font-semibold text-stone-400 mb-2">Delivery Address</h4>
              <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
              <p className="text-stone-600">{order.customer.addressLine1}</p>
              <p className="text-stone-600">
                {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              </p>
              <p className="text-stone-600 mt-1 font-mono">+91 {order.customer.phone}</p>
            </div>

            <div>
              <h4 className="uppercase font-semibold text-stone-400 mb-2">Payment Details</h4>
              <p className="font-semibold text-stone-900">Paid via {order.paymentMethod}</p>
              <p className="text-stone-600">{order.paymentDetails}</p>
              <p className="text-emerald-700 font-semibold mt-1">Transaction Verified</p>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="pt-6 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono text-stone-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Discount</span>
                <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span className="font-mono text-stone-900">
                {order.shipping === 0 ? 'Free' : `₹${order.shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>GST (Included)</span>
              <span className="font-mono text-stone-900">₹{order.tax}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-[#20251F]">
              <span>Amount Paid</span>
              <span className="font-mono text-lg text-[#315C46]">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Continue Shopping CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 bg-[#315C46] hover:bg-[#244434] text-white rounded-lg text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
          >
            <span>Continue Exploring the Bookstore</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
