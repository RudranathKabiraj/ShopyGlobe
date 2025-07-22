import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  setCartItems,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";
import { Link } from "react-router-dom";
import axios from "axios";

// Cart component that displays items added to the cart
export default function Cart() {
  const dispatch = useDispatch();

  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // useEffect to load cart items from backend when component mounts
  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Send GET request to fetch cart data from backend
        const res = await axios.get("/api/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // send token for auth
          },
        });

        // Format the received cart items to match frontend structure
        const items = res.data.items.map((item) => ({
          _id: item._id, // cart item ID
          productId: item.product._id, // product ID
          name: item.product.name, // product name
          thumbnail: item.product.image || item.product.thumbnail, // image or fallback
          price: item.product.price, // product price
          quantity: item.quantity, // quantity selected
        }));

        // Set formatted items in Redux store
        dispatch(setCartItems(items));
      } catch (err) {
        console.error("Error fetching cart:", err.message);
      }
    };

    fetchCart();
  }, [dispatch]);

  // Calculate total price of all items in cart
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Helper function to format number as Indian Rupee
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {/* If no items in cart, show empty message */}
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 border border-dashed p-8 rounded">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Loop through each cart item and display it */}
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 bg-white rounded shadow"
            >
              {/* Left side - Product info and quantity controls */}
              <div className="flex items-center gap-4">
                {/* Product image with fallback */}
                <img
                  src={item.thumbnail || "/assets/placeholder.jpg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/placeholder.jpg";
                  }}
                />

                <div>
                  <h2 className="font-semibold">{item.name}</h2>

                  {/* Quantity increase/decrease buttons */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => dispatch(decreaseQuantity(item._id))}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => dispatch(increaseQuantity(item._id))}
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Show unit price */}
                  <p className="text-sm text-gray-500 mt-1">
                    Unit Price: {formatPrice(item.price)}
                  </p>
                </div>
              </div>

              {/* Right side - total price of item and remove button */}
              <div className="flex items-center gap-4">
                <p className="font-bold text-green-600">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => dispatch(removeFromCart(item._id))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Show total amount and checkout button */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total: {formatPrice(total)}</p>
            <Link
              to="/checkout"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
