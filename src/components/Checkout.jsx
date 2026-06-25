import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatPrice } from "../utils/priceFormatter";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_ba0bz6o";
const EMAILJS_TEMPLATE_ID = "template_oihp9op";
const EMAILJS_PUBLIC_KEY = "U33ReL9aJ-NMXJXh2";

export default function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) || 0) * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";
    if (!form.address.trim()) errs.address = "Shipping address is required";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (cartItems.length === 0) { alert("Your cart is empty!"); return; }
    setSending(true);

    const orders = cartItems.map((item) => ({
      name: item.name,
      units: item.quantity,
      price: ((parseFloat(item.price) || 0) * item.quantity).toFixed(2),
      image_url: item.thumbnail || "",
    }));

    const templateParams = {
      to_name: form.name,
      email: form.email,
      order_id: orderId,
      orders,
      cost: { shipping: "0.00", tax: tax.toFixed(2), total: total.toFixed(2) },
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      setSent(true);

      // ✅ Pass a snapshot of cartItems to PaymentPage via router state
      // ✅ clearCart() is called inside PaymentPage AFTER successful payment
      setTimeout(() => navigate("/payment", {
        state: {
          orderId,
          name: form.name,
          email: form.email,
          total,
          cartSnapshot: cartItems,   // ← full cart passed here
          tax,
        }
      }), 1500);
    } catch (err) {
      console.error("Email failed:", err);
      alert("Failed to send confirmation email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      className="bg-gradient-to-br from-gray-50 to-blue-50 px-4">

      {/* Header */}
      <div className="text-center py-5 shrink-0">
        <h1 className="text-3xl font-extrabold text-gray-800">Checkout</h1>
        <p className="text-gray-500 text-sm mt-1">Complete your order below</p>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, minHeight: 0 }}
        className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">

        {/* Billing Form */}
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2 shrink-0">
            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
            Billing Information
          </h2>

          <form onSubmit={handleProceed} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Rudranath Kabiraj"
                className={`w-full border ${errors.name ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Shipping Address</label>
              <textarea name="address" value={form.address} onChange={handleChange}
                rows="3" placeholder="123 Main Street, Kolkata, West Bengal"
                className={`w-full border ${errors.address ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <button type="submit" disabled={sending || sent || cartItems.length === 0}
              style={{ marginTop: 'auto' }}
              className={`w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 ${
                sent ? 'bg-green-500'
                : sending ? 'bg-blue-400 cursor-wait'
                : cartItems.length === 0 ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}>
              {sent ? '✓ Email Sent! Redirecting...' : sending ? 'Sending confirmation...' : 'Proceed to Payment →'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}
          className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2 shrink-0">
            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <div style={{ flex: 1 }} className="flex items-center justify-center">
              <p className="text-gray-400 text-sm">Your cart is empty.</p>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="space-y-3 pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3 border-b pb-3">
                  <img src={item.thumbnail} alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg border shrink-0"
                    onError={(e) => { e.target.src = '/assets/placeholder.jpg'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-green-600 whitespace-nowrap">
                    {formatPrice((parseFloat(item.price) || 0) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="shrink-0 mt-4 border-t pt-3 space-y-1.5 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Tax (5%)</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 font-medium">Free</span></div>
            <div className="flex justify-between font-bold text-base text-gray-800 border-t pt-2 mt-1">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="shrink-0 mt-3 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>🔒 Secure</span>
            <span>📦 Free Shipping</span>
            <span>✅ Email Confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
}