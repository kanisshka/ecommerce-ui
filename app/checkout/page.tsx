// app/checkout/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Tag,
  CheckCircle,
  Lock,
  ArrowLeft,
  X,
  Package,
  Truck,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import { carts } from "@/lib/store";

// Types
interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CheckoutFormData {
  // Personal Info
  fullName: string;
  email: string;
  phone: string;

  // Shipping Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Payment
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;

  // Discount
  discountCode: string;
}

// Success Modal Component
const OrderSuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  total: number;
}> = ({ isOpen, onClose, orderNumber, total }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
            <div className="relative bg-green-500 rounded-full p-6">
              <CheckCircle size={64} className="text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Order Successful!
          </h2>
          <p className="text-gray-600 text-lg">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Order Number</span>
            <span className="text-gray-900 font-black font-mono">
              #{orderNumber}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Confetti Effect */}
        <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Checkout Page
export default function CheckoutPage() {
  const userId = "u1"; // use logged-in user
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);
  console.log(cartItems, carts[userId], "carts");
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    discountCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal - discountAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   const handlePlaceOrder = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsProcessing(true);

  //     // Simulate API call
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     // Generate order number
  //     const orderNum = `NV${Date.now().toString().slice(-8)}`;
  //     setOrderNumber(orderNum);

  //     setIsProcessing(false);
  //     setShowSuccessModal(true);
  //   };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (formData.phone.length < 8)
      newErrors.phone = "Invalid phone number";

    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    if (!formData.cardNumber.trim())
      newErrors.cardNumber = "Card number required";
    else if (formData.cardNumber.replace(/\s/g, "").length < 16)
      newErrors.cardNumber = "Invalid card";

    if (!formData.cardName.trim())
      newErrors.cardName = "Cardholder name required";

    if (!formData.expiryDate.trim()) newErrors.expiryDate = "Expiry required";
    else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate))
      newErrors.expiryDate = "Format MM/YY";

    if (!formData.cvv.trim()) newErrors.cvv = "CVV required";
    else if (formData.cvv.length < 3) newErrors.cvv = "Invalid CVV";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    setIsProcessing(true);

    const payload = {
      userId: "u1",
      couponCode: appliedCoupon,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(data, "checkout data");

      toast.success(`Order placed! Final amount: ₹${data.finalAmount}`);

      if (data.newCoupon) {
        toast.success(`🎉 New coupon: ${data.newCoupon}`);
      }

      // 🧹 Clear cart + coupon states
      carts["u1"] = [];
      setCartItems([]);

      setCouponCode("");
      setAppliedCoupon("");
      setDiscountAmount(0);
      setCouponError("");

      // 🎯 Show success modal
      const orderNum = `NV${Date.now().toString().slice(-8)}`;
      setOrderNumber(orderNum);
      setShowSuccessModal(true);
    } catch (error) {
      toast.error("Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setAppliedCoupon("");
    setDiscountAmount(0);
    setCouponCode("");
    setCouponError("");
    carts[userId] = []; // clears backend store
    setCartItems([]); // clears checkout UI

    // Redirect to home or orders page
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black border-b-2 border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="text-white" size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white">Checkout</h1>
              <p className="text-gray-400 text-sm">Complete your purchase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        orderNumber={orderNumber}
        total={total}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-black p-2 rounded-lg">
                    <User className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900">
                    Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                    {errors.phone && (
  <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
)}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-black p-2 rounded-lg">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="123 Main Street"
                    />
                    {errors.address && (
  <p className="text-xs text-red-600 mt-1">{errors.address}</p>
)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="New York"
                    />
                    {errors.city && (
  <p className="text-xs text-red-600 mt-1">{errors.city}</p>
)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="NY"
                    />
                    {errors.state && (
  <p className="text-xs text-red-600 mt-1">{errors.state}</p>
)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="10001"
                    />
                    {errors.zipCode && (
  <p className="text-xs text-red-600 mt-1">{errors.zipCode}</p>
)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="United States"
                    />
                    {errors.country && (
  <p className="text-xs text-red-600 mt-1">{errors.country}</p>
)}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-black p-2 rounded-lg">
                    <CreditCard className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-black text-gray-900">
                    Payment Information
                  </h2>
                  <Lock className="text-gray-400 ml-auto" size={18} />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={19}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors font-mono"
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
  <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>
)}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors"
                      placeholder="JOHN DOE"
                    />
                    {errors.cardName && (
  <p className="text-xs text-red-600 mt-1">{errors.cardName}</p>
)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        maxLength={5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors font-mono"
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && (
  <p className="text-xs text-red-600 mt-1">{errors.expiryDate}</p>
)}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        maxLength={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-black transition-colors font-mono"
                        placeholder="123"
                      />
                      {errors.cvv && (
  <p className="text-xs text-red-600 mt-1">{errors.cvv}</p>
)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg sticky top-6">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingCart className="text-black" size={24} />
                  <h2 className="text-xl font-black text-gray-900">
                    Order Summary
                  </h2>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 pb-6 border-b-2 border-gray-200">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3"
                    >
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-black text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                {/* <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="discountCode"
                        value={formData.discountCode}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                        placeholder="Enter code"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {discountApplied && (
                    <p className="text-green-600 text-xs font-semibold mt-2 flex items-center gap-1">
                      <CheckCircle size={14} />
                      Discount applied!
                    </p>
                  )}
                </div> */}
                {/* Discount Code */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Code
                  </label>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={16}
                      />

                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors text-sm text-black"
                        placeholder="Enter code"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        setCouponError("");

                        try {
                          const res = await fetch("/api/validate-coupon", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ couponCode }),
                          });

                          const data = await res.json();

                          if (data.valid) {
                            setAppliedCoupon(couponCode);
                            setDiscountAmount(subtotal * 0.1);
                            toast.success("Coupon applied successfully!");
                          } else {
                            setAppliedCoupon("");
                            setDiscountAmount(0);
                            setCouponError("Coupon is invalid or already used");
                            toast.error("Invalid coupon");
                          }
                        } catch {
                          setCouponError("Something went wrong. Try again.");
                        }
                      }}
                      className="px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-black transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-xs text-red-600 mt-2 font-medium">
                      {couponError}
                    </p>
                  )}

                  {appliedCoupon && (
                    <p className="text-xs text-green-600 mt-2 font-semibold">
                      🎉 Coupon "{appliedCoupon}" applied — 10% saved!
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span className="font-semibold">
                        -${discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-black text-gray-900">
                    Total
                  </span>
                  <span className="text-3xl font-black text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold text-base hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
