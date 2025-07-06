import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { removeFromCart } from "../redux/cartSlice";

// Functional component that displays a single cart item
export default function CartItem({ item }) {
  const dispatch = useDispatch(); // Hook to dispatch Redux actions

  return (
    <div className="flex justify-between items-center p-4 border-b">
      {/* Product title and price */}
      <div>
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p className="text-sm text-gray-600">${item.price}</p>
      </div>

      {/* Button to remove item from cart */}
      <button
        onClick={() => dispatch(removeFromCart(item.id))}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Remove
      </button>
    </div>
  );
}

// Define expected prop types for validation
CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,     // Unique product ID
    title: PropTypes.string.isRequired,  // Product title
    price: PropTypes.number.isRequired,  // Product price
  }).isRequired,
};
