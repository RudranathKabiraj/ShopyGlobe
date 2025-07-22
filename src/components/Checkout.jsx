import React from "react";
import { useSelector } from "react-redux";
import { formatPrice } from "../utils/priceFormatter";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  // Total price in INR
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal * 1.05;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    navigate("/payment");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Billing Information */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Billing Information
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Shipping Address
              </label>
              <textarea
                rows="3"
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main Street, Kolkata"
              ></textarea>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow p-6 w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Order Summary
          </h2>

          <div className="max-h-64 overflow-y-auto space-y-4 pr-1">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="text-sm text-gray-700">
                      Qty {item.quantity} –{" "}
                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                    </p>
                  </div>
                  <p className="text-green-600 font-semibold text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 border-t pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-3">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Proceed to Payment Button */}
          <button
            onClick={handleProceedToPayment}
            className="mt-6 w-full bg-yellow-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
