import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";

export default function Cart() {
  //Geting cart items from Redux store
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  //Calculate the total cost of items in cart
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // convert price from USD to INR and format it
const formatPrice = (priceInUSD) => {
  const priceInINR = parseFloat((priceInUSD * 83).toFixed(2));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInINR);
};


  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* page title */}
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {/* show empty message if cart is empty */}
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 border border-dashed p-8 rounded">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {/* display each item in the cart */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-white rounded shadow"
            >
              {/* item info section: image, title, price x quantity */}
              <div className="flex items-center gap-4">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-500">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
              </div>

              {/* Remove button and total price for item */}
              <div className="flex items-center gap-4">
                <p className="font-bold text-green-600">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* total price and Checkout button */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">
              Total: {formatPrice(total)}
            </p>
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
