import React from "react";

export default function Checkout() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Checkout</h1>
      <p className="text-gray-700 text-lg">
        This is the checkout page. You can redirect to the payment page.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        (For demo purposes, no payment processing is implemented.)
      </p>
    </div>
  );
}
