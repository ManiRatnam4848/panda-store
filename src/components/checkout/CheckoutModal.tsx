import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, Truck, CreditCard, QrCode, 
  Building2, Banknote, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { CartItem, CustomerAddress, Order } from '../../types/book';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  promoCode: string;
  onCompleteOrder: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discount,
  promoCode,
  onCompleteOrder,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Method, 3: Payment
  const [isProcessing, setIsProcessing] = useState(false);

  // Address State
  const [address, setAddress] = useState<CustomerAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Netbanking' | 'Cash on Delivery'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8824',
    name: '',
    expiry: '08/28',
    cvv: '•••',
  });

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discount) / 100);
  const isFreeStandard = subtotal >= 799;
  const shippingCost = shippingMethod === 'express' ? 99 : (isFreeStandard ? 0 : 49);
  const tax = Math.round((subtotal - discountAmount) * 0.05); // 5% GST included
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const indianStates = [
    'Maharashtra', 'Karnataka', 'Delhi NCR', 'Tamil Nadu', 'West Bengal',
    'Telangana', 'Gujarat', 'Kerala', 'Rajasthan', 'Uttar Pradesh', 'Goa'
  ];

  const handlePincodeChange = (pin: string) => {
    setAddress({ ...address, pincode: pin });
    if (pin.startsWith('400')) setAddress((prev) => ({ ...prev, pincode: pin, city: 'Mumbai', state: 'Maharashtra' }));
    else if (pin.startsWith('560')) setAddress((prev) => ({ ...prev, pincode: pin, city: 'Bengaluru', state: 'Karnataka' }));
    else if (pin.startsWith('110')) setAddress((prev) => ({ ...prev, pincode: pin, city: 'New Delhi', state: 'Delhi NCR' }));
    else if (pin.startsWith('600')) setAddress((prev) => ({ ...prev, pincode: pin, city: 'Chennai', state: 'Tamil Nadu' }));
    else if (pin.startsWith('500')) setAddress((prev) => ({ ...prev, pincode: pin, city: 'Hyderabad', state: 'Telangana' }));
    else if (pin.startsWith('700')) setAddress((prev) => ({ ...prev, pincode: pin, city: 'Kolkata', state: 'West Bengal' }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.email || !address.phone || !address.addressLine1) return;
    setStep(2);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber: `PS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        items: [...items],
        customer: { ...address },
        subtotal,
        discount: discountAmount,
        shipping: shippingCost,
        tax,
        total,
        paymentMethod,
        paymentDetails:
          paymentMethod === 'UPI'
            ? `UPI (${upiId || 'Direct QR Instant'})`
            : paymentMethod === 'Card'
            ? 'Visa ending in 8824'
            : paymentMethod === 'Netbanking'
            ? `${selectedBank} Netbanking`
            : 'Cash on Delivery',
        status: 'Confirmed',
        estimatedDeliveryDate: new Date(
          Date.now() + (shippingMethod === 'express' ? 2 : 4) * 86400000
        ).toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      };

      setIsProcessing(false);
      onCompleteOrder(generatedOrder);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] border border-stone-300 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Checkout Header */}
        <div className="px-6 py-4 bg-[#F6F1E8] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <span className="font-editorial text-xl font-bold text-[#20251F] leading-none block">
                PANDA STORE
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#5C635B] font-medium block">
                Buy your Desired Books
              </span>
            </div>
            <span className="text-stone-300">|</span>
            <span className="text-xs uppercase font-semibold text-[#315C46] tracking-wider">
              {step === 1 && '1. Contact & Shipping Address'}
              {step === 2 && '2. Delivery Speed'}
              {step === 3 && '3. Payment & Review'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-500 hover:text-stone-900"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-3 bg-stone-200/60 text-xs font-semibold text-center border-b border-stone-200">
          <div className={`py-2 ${step >= 1 ? 'bg-[#315C46] text-white' : 'text-stone-500'}`}>
            1. Shipping
          </div>
          <div className={`py-2 ${step >= 2 ? 'bg-[#315C46] text-white' : 'text-stone-500'}`}>
            2. Delivery
          </div>
          <div className={`py-2 ${step === 3 ? 'bg-[#315C46] text-white' : 'text-stone-500'}`}>
            3. Payment
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <h3 className="font-editorial text-lg font-bold text-[#20251F]">
                Where should we send your books?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#315C46]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    placeholder="radhika@example.com"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#315C46]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Mobile Phone (for delivery SMS) *</label>
                <div className="flex">
                  <span className="bg-stone-200 border border-stone-300 border-r-0 rounded-l-lg px-3 py-2 text-xs font-mono text-stone-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-white border border-stone-300 rounded-r-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-hidden focus:border-[#315C46]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Address (House, Street, Apartment) *</label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  placeholder="Flat 4B, Gulmohar Enclave, Linking Road"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#315C46]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="400001"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 focus:outline-hidden focus:border-[#315C46]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Mumbai"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#315C46]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">State *</label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-[#315C46]"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#315C46] hover:bg-[#244434] text-white rounded-lg text-xs font-semibold flex items-center gap-2"
                >
                  <span>Continue to Delivery</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-editorial text-lg font-bold text-[#20251F]">
                Select Delivery Speed
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-[#315C46] bg-emerald-50/40 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="mt-1 accent-[#315C46]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Standard India Surface Courier
                      </p>
                      <p className="text-xs text-[#5C635B] mt-0.5">
                        Delivered in 3–4 business days via Bluedart / Delhivery.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-stone-900">
                    {isFreeStandard ? 'Free' : '₹49'}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('express')}
                  className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-[#315C46] bg-emerald-50/40 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="mt-1 accent-[#315C46]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        Express Air Dispatch (Priority)
                      </p>
                      <p className="text-xs text-[#5C635B] mt-0.5">
                        Guaranteed 24–48 hour delivery with live GPS tracking.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-stone-900">
                    ₹99
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-[#315C46] hover:bg-[#244434] text-white rounded-lg text-xs font-semibold flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-editorial text-lg font-bold text-[#20251F]">
                Payment Method & Review
              </h3>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: <QrCode size={16} /> },
                  { id: 'Card', label: 'Cards', icon: <CreditCard size={16} /> },
                  { id: 'Netbanking', label: 'Netbanking', icon: <Building2 size={16} /> },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: <Banknote size={16} /> },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 border transition-all ${
                      paymentMethod === m.id
                        ? 'border-[#315C46] bg-[#315C46] text-white shadow-xs'
                        : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300'
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment Details Container */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs">
                {paymentMethod === 'UPI' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">
                        Scan with Google Pay, PhonePe, Paytm, or BHIM
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                        Instant 0% Fee
                      </span>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      {/* Stylized QR Code Graphic */}
                      <div className="w-24 h-24 bg-stone-100 border border-stone-300 rounded p-2 flex flex-col items-center justify-center">
                        <QrCode size={64} className="text-[#20251F]" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <p className="text-[11px] text-stone-500">
                          Scan the QR above, or enter your virtual UPI handle:
                        </p>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full bg-stone-50 border border-stone-300 rounded px-2.5 py-1.5 text-xs font-mono text-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-stone-900">
                        Credit / Debit Card (Visa, Mastercard, RuPay)
                      </span>
                      <span className="text-stone-400 font-mono text-[11px]">256-bit SSL</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        readOnly
                        value={cardDetails.number}
                        className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 font-mono text-xs text-stone-900"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          readOnly
                          value="Expires: 08/28"
                          className="bg-stone-50 border border-stone-300 rounded px-3 py-2 font-mono text-xs text-stone-600"
                        />
                        <input
                          type="text"
                          readOnly
                          value="CVV: 392"
                          className="bg-stone-50 border border-stone-300 rounded px-3 py-2 font-mono text-xs text-stone-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Netbanking' && (
                  <div className="space-y-2">
                    <span className="font-semibold text-stone-900 block">
                      Select Your Bank:
                    </span>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded px-3 py-2 text-xs text-stone-900"
                    >
                      <option>HDFC Bank</option>
                      <option>State Bank of India</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'Cash on Delivery' && (
                  <div className="text-stone-600 space-y-1">
                    <p className="font-semibold text-stone-900">
                      Cash / UPI on Delivery
                    </p>
                    <p className="text-[11px]">
                      Please keep exact change or UPI ready at the time of delivery to your doorstep.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary & Final Total */}
              <div className="p-4 bg-[#F6F1E8] rounded-xl border border-stone-300/80 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Items Subtotal ({items.length} titles)</span>
                  <span className="font-mono text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Discount ({promoCode})</span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping ({shippingMethod})</span>
                  <span className="font-mono text-stone-900">
                    {shippingCost === 0 ? 'Free' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>GST (Included)</span>
                  <span className="font-mono text-stone-900">₹{tax}</span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between text-base font-bold text-[#20251F]">
                  <span>Total Payable</span>
                  <span className="font-mono text-lg text-[#315C46]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-[#315C46] hover:bg-[#244434] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
                >
                  {isProcessing ? (
                    <span>Confirming with Gateway...</span>
                  ) : (
                    <span>Place Order · ₹{total.toLocaleString('en-IN')}</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
