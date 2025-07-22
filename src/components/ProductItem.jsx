import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../redux/cartSlice';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../utils/priceFormatter';

export default function ProductItem({ product }) {
  const dispatch = useDispatch();
  const [showAdded, setShowAdded] = useState(false);
  const [stock, setStock] = useState(product.stock ?? 0);

  const handleAddToCart = () => {
    if (stock > 0) {
      dispatch(
        addToCart({
          _id: product._id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        })
      );
      setShowAdded(true);
      setStock((prev) => prev - 1);
      setTimeout(() => setShowAdded(false), 1500);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 p-4 flex flex-col h-full">
      <Link to={`/product/${product._id}`} className="block group flex-grow">
        <img
          src={product.thumbnail || '/assets/placeholder.jpg'}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/placeholder.jpg';
          }}
          className="w-full h-48 object-cover object-center rounded-xl mb-3 group-hover:scale-105 transition-transform duration-200"
        />

        <div className="flex flex-col h-full">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

          <p className="mt-2 text-green-600 font-bold">{formatPrice(product.price)}</p>

          <p className={`mt-1 text-sm font-medium ${stock > 0 ? 'text-gray-600' : 'text-red-500'}`}>
            {stock > 0 ? `In Stock: ${stock}` : 'Out of Stock'}
          </p>
        </div>
      </Link>

      <button
        onClick={handleAddToCart}
        disabled={stock === 0}
        className={`mt-4 w-full py-2 rounded-lg font-medium transition ${
          stock === 0
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {stock === 0 ? 'Unavailable' : 'Add to Cart'}
      </button>

      {showAdded && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
          Added to Cart
        </div>
      )}
    </div>
  );
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
    stock: PropTypes.number.isRequired,
  }).isRequired,
};
