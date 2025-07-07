import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';
import { useState } from 'react';
import PropTypes from 'prop-types';

// Format USD to INR
const formatPrice = (priceInUSD) => {
  const priceInINR = parseFloat((priceInUSD * 83).toFixed(2));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInINR);
};


export default function ProductItem({ product }) {
  const dispatch = useDispatch();
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1500);
  };

  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 p-4">
      <Link to={`/product/${product.id}`} className="block group">
        <img
          src={product.thumbnail || '/assets/placeholder.jpg'}
          alt={product.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/placeholder.jpg';
          }}
          className="w-full h-48 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-200"
        />
        <h2 className="text-lg font-semibold text-gray-800 truncate">{product.title}</h2>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <p className="mt-2 text-green-600 font-bold">{formatPrice(product.price)}</p>
      </Link>

      <button
        onClick={handleAddToCart}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
      >
        Add to Cart
      </button>

      {showAdded && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow animate-none">
          Added to Cart
        </div>
      )}
    </div>
  );
}

// PropTypes validation
ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
  }).isRequired,
};
