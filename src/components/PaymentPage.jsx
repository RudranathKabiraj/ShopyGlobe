import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";

// ── Razorpay loader ─────────────────────────────────────────────────────────
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Payment method tabs ──────────────────────────────────────────────────────
const METHODS = [
  { id: "upi", label: "UPI", icon: "💳" },
  { id: "wallet", label: "Wallets", icon: "👜" },
  { id: "card", label: "Card / Net Banking", icon: "🏦" },
];

// ── UPI app logos (official SVG brand colours) ───────────────────────────────
const UPI_APPS = [
  {
    id: "gpay",
    name: "GPay",
    upiSuffix: "@okicici",
    logo: (
      <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#fff"/>
        <path d="M24 11c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13H24V11z" fill="#4285F4"/>
        <path d="M37 24c0-1.2-.16-2.36-.46-3.46H24v6.54h7.27A6.5 6.5 0 0124 30.5v3.5h4.1C31.18 31.5 37 28.2 37 24z" fill="#34A853"/>
        <path d="M24 37c3.24 0 5.96-1.07 7.94-2.9L28.1 30.6A7.95 7.95 0 0124 32a8 8 0 01-7.52-5.26H12.3v3.6A13 13 0 0024 37z" fill="#FBBC05"/>
        <path d="M16.48 26.74A7.9 7.9 0 0116 24c0-.95.16-1.87.44-2.74v-3.6H12.3A13 13 0 0011 24c0 2.1.5 4.08 1.3 5.86l5.18-3.12z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: "phonepe",
    name: "PhonePe",
    upiSuffix: "@ybl",
    logo: (
      <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#5F259F"/>
        <path d="M32.5 15.5h-5.8l-8.2 8.2v-8.2H14v17h4.5v-4.5l2-2 4.5 6.5H30l-6.2-9 8.7-7.5v-.5z" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: "paytm",
    name: "Paytm",
    upiSuffix: "@paytm",
    logo: (
      <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#00BAF2"/>
        <rect x="10" y="10" width="13" height="13" fill="#fff"/>
        <rect x="25" y="10" width="13" height="13" fill="#fff"/>
        <rect x="10" y="25" width="13" height="13" fill="#fff"/>
        <rect x="25" y="25" width="13" height="6" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: "bhim",
    name: "BHIM",
    upiSuffix: "@upi",
    logo: (
      <svg viewBox="0 0 48 48" width="36" height="36" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#00529C"/>
        <text x="24" y="30" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff" fontFamily="Arial">BHIM</text>
        <path d="M12 20h24v2H12z" fill="#FF9933"/>
        <path d="M12 26h24v2H12z" fill="#138808"/>
      </svg>
    ),
  },
];

// ── Wallet logos ─────────────────────────────────────────────────────────────
const WALLETS = [
  {
    id: "paytm",
    name: "Paytm",
    logo: (
      <svg viewBox="0 0 48 48" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="#00BAF2"/>
        <rect x="10" y="10" width="12" height="12" fill="#fff"/>
        <rect x="26" y="10" width="12" height="12" fill="#fff"/>
        <rect x="10" y="26" width="12" height="12" fill="#fff"/>
        <rect x="26" y="26" width="12" height="5" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: "phonepe",
    name: "PhonePe",
    logo: (
      <svg viewBox="0 0 48 48" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#5F259F"/>
        <path d="M32.5 15.5h-5.8l-8.2 8.2v-8.2H14v17h4.5v-4.5l2-2 4.5 6.5H30l-6.2-9 8.7-7.5v-.5z" fill="#fff"/>
      </svg>
    ),
  },
  {
    id: "amazonpay",
    name: "Amazon Pay",
    logo: (
      <svg viewBox="0 0 48 48" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="#FF9900"/>
        <text x="24" y="20" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff" fontFamily="Arial">amazon</text>
        <text x="24" y="32" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff" fontFamily="Arial">pay</text>
        <path d="M14 36 Q24 40 34 36" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "mobikwik",
    name: "MobiKwik",
    logo: (
      <svg viewBox="0 0 48 48" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#1B2559"/>
        <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#00C4E0" fontFamily="Arial">MK</text>
      </svg>
    ),
  },
  {
    id: "freecharge",
    name: "Freecharge",
    logo: (
      <svg viewBox="0 0 48 48" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#E53935"/>
        <text x="24" y="28" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fff" fontFamily="Arial">FC</text>
      </svg>
    ),
  },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // ✅ Read cart snapshot passed from Checkout (cart was NOT cleared)
  const {
    cartSnapshot: cartItems = [],
    total: passedTotal,
    orderId,
    name,
    email,
    tax,
  } = location.state || {};

  // ── derive order total from snapshot ────────────────────────────────────
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 0 ? (subtotal > 999 ? 0 : 49) : 0;
  const total = passedTotal ?? subtotal + shipping;

  // ── local state ─────────────────────────────────────────────────────────
  const [activeMethod, setActiveMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── validate before opening Razorpay ────────────────────────────────────
  function validate() {
    if (activeMethod === "upi") {
      if (!upiId.trim()) return "Please enter your UPI ID.";
      if (!/^[\w.\-]{2,}@[\w]{2,}$/.test(upiId.trim()))
        return "Enter a valid UPI ID (e.g. name@upi).";
    }
    if (activeMethod === "wallet" && !selectedWallet)
      return "Please select a wallet.";
    return "";
  }

  // ── open Razorpay checkout ───────────────────────────────────────────────
  async function handlePay() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);

    // ── Debug: log key values before opening Razorpay ──────────────────────
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const amountInPaise = Math.round(total * 100);
    console.log("🔑 Razorpay Key:", razorpayKey || "❌ MISSING — check .env");
    console.log("💰 Amount (paise):", amountInPaise, "| Total (₹):", total);
    console.log("🛒 Cart items:", cartItems);

    if (!razorpayKey) {
      setError("Payment key missing. Add VITE_RAZORPAY_KEY_ID to your .env file and restart the dev server.");
      setLoading(false);
      return;
    }
    if (!amountInPaise || amountInPaise <= 0) {
      setError(`Invalid amount: ₹${total}. Your cart may be empty or prices are missing.`);
      setLoading(false);
      return;
    }

    const ok = await loadRazorpay();
    if (!ok) {
      setError("Failed to load payment gateway. Check your internet connection.");
      setLoading(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: amountInPaise,
      currency: "INR",
      name: "ShopyGlobe",
      description: "Order Payment",
      prefill: {
        name: name || "",
        email: email || "",
        ...(activeMethod === "upi" && { vpa: upiId }),
      },
      method: {
        upi: activeMethod === "upi",
        wallet: activeMethod === "wallet" ? selectedWallet : false,
        card: activeMethod === "card",
        netbanking: activeMethod === "card",
        emi: false,
      },
      theme: { color: "#6366f1" },
      handler(response) {
        // ✅ Payment done — now safe to clear the cart
        dispatch(clearCart());
        navigate("/order-success", { state: { paymentId: response.razorpay_payment_id, orderId } });
      },
      modal: {
        ondismiss() {
          setLoading(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (res) => {
      console.error("❌ Razorpay payment failed:", res.error);
      setError(`Payment failed: ${res.error.description}`);
      setLoading(false);
    });
    try {
      rzp.open();
    } catch (err) {
      console.error("❌ rzp.open() threw:", err);
      setError("Could not open payment window: " + err.message);
      setLoading(false);
    }
    setLoading(false);
  }

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Left: Payment panel ─────────────────────────────────────── */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Checkout</h1>
          <p className="text-sm text-gray-500 mb-6">Choose how you'd like to pay</p>

          {/* Method tabs */}
          <div className="flex gap-2 mb-6">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => { setActiveMethod(m.id); setError(""); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  activeMethod === m.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                }`}
              >
                <span className="mr-1">{m.icon}</span> {m.label}
              </button>
            ))}
          </div>

          {/* ── UPI ── */}
          {activeMethod === "upi" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Select your UPI app or enter your UPI ID manually.
              </p>

              {/* Selectable UPI app buttons */}
              <div className="grid grid-cols-4 gap-3">
                {UPI_APPS.map((app) => {
                  const isSelected = selectedUpiApp === app.id;
                  return (
                    <button
                      key={app.id}
                      onClick={() => {
                        setSelectedUpiApp(app.id);
                        // auto-fill suffix hint into the input
                        const base = upiId.split("@")[0];
                        setUpiId(base ? `${base}${app.upiSuffix}` : "");
                        setError("");
                      }}
                      className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300"
                          : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-white"
                      }`}
                    >
                      {app.logo}
                      <span className="text-xs font-medium text-gray-600">{app.name}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  placeholder="yourname@okicici"
                  value={upiId}
                  onChange={(e) => { setUpiId(e.target.value); setSelectedUpiApp(""); }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* ── Wallets ── */}
          {activeMethod === "wallet" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Select your preferred wallet to continue.</p>
              <div className="grid grid-cols-2 gap-3">
                {WALLETS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => { setSelectedWallet(w.id); setError(""); }}
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm font-medium text-left transition-all ${
                      selectedWallet === w.id
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-300"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    {w.logo}
                    <span>{w.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Card / Net Banking ── */}
          {activeMethod === "card" && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                You'll be securely redirected to Razorpay to enter your card or net banking details.
              </p>
              <div className="border border-dashed border-gray-200 rounded-xl p-5 text-center text-gray-400 text-sm">
                🔒 Powered by Razorpay — 256-bit SSL encryption
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={loading || total === 0}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-sm"
          >
            {loading ? "Opening payment…" : `Pay ₹${total.toFixed(2)}`}
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            🔒 Secured by Razorpay. Your payment info is never stored on our servers.
          </p>
        </div>

        {/* ── Right: Order summary ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-400">Your cart is empty.</p>
          ) : (
            <ul className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <li key={item._id} className="flex items-center gap-3 text-sm text-gray-600">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                    />
                  )}
                  <span className="truncate flex-1">
                    {item.name} <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-800 flex-shrink-0">
                    ₹{((parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 text-base pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {subtotal > 0 && subtotal <= 999 && (
            <p className="mt-3 text-xs text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2">
              Add ₹{(1000 - subtotal).toFixed(2)} more for free shipping!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}