import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, increaseQuantity, decreaseQuantity } from '../redux/cartSlice';
import PropTypes from 'prop-types';
import { formatPrice } from '../utils/priceFormatter';
import { useState } from 'react';

export default function ProductItem({ product }) {
  const dispatch = useDispatch();
  const [sliding, setSliding] = useState(false);

  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item._id === product._id)
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  const availableStock = (product.stock ?? 0) - quantity;
  const outOfStock = (product.stock ?? 0) === 0;

  const handleAdd = () => {
    if (availableStock <= 0) return;
    if (quantity === 0) {
      setSliding(true);
      setTimeout(() => setSliding(false), 500);
    }
    if (quantity === 0) {
      dispatch(addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      }));
    } else {
      dispatch(increaseQuantity(product._id));
    }
  };

  const handleDecrease = () => {
    dispatch(decreaseQuantity(product._id));
  };

  return (
    <>
      <style>{`
        @keyframes slideGreen {
          0%   { background-position: 100% 0; }
          100% { background-position: 0% 0; }
        }
        @keyframes popNum {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .slide-green {
          background: linear-gradient(to right, #16a34a 50%, #2563eb 50%);
          background-size: 200% 100%;
          animation: slideGreen 0.45s ease forwards;
        }
        .pop-num {
          animation: popNum 0.25s ease forwards;
        }
      `}</style>

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
            <p className={`mt-1 text-sm font-medium ${availableStock > 0 ? 'text-gray-600' : 'text-red-500'}`}>
              {outOfStock
                ? 'Out of Stock'
                : availableStock <= 0
                ? 'Max added to cart'
                : `In Stock: ${availableStock}`}
            </p>
          </div>
        </Link>

        <div className="mt-4" style={{ height: '40px', position: 'relative' }}>
          {outOfStock ? (
            <button
              disabled
              style={{ position: 'absolute', inset: 0, width: '100%' }}
              className="rounded-lg font-medium bg-red-500 text-white cursor-not-allowed text-sm"
            >
              Not Available
            </button>

          ) : quantity === 0 ? (
            <button
              onClick={handleAdd}
              style={{ position: 'absolute', inset: 0, width: '100%' }}
              className={`rounded-lg font-medium text-white text-sm ${sliding ? 'slide-green' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {sliding ? '✓ Added!' : 'Add to Cart'}
            </button>

          ) : (
            // GREEN +/- counter, turns back to blue only when quantity = 0
            <div
              className="flex items-center justify-between rounded-lg overflow-hidden bg-green-600"
              style={{ position: 'absolute', inset: 0, width: '100%' }}
            >
              <button
                onClick={handleDecrease}
                className="text-white font-bold px-4 h-full hover:bg-green-700 active:bg-green-800 transition-colors duration-100 text-lg"
                style={{ minWidth: '40px' }}
              >
                −
              </button>

              <span className="text-white font-bold text-sm flex-1 text-center">
                <span key={quantity} className="pop-num" style={{ display: 'inline-block' }}>
                  {quantity}
                </span>
              </span>

              <button
                onClick={handleAdd}
                disabled={availableStock <= 0}
                className={`text-white font-bold px-4 h-full transition-colors duration-100 text-lg ${availableStock <= 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-green-700 active:bg-green-800'}`}
                style={{ minWidth: '40px' }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
    stock: PropTypes.number,
  }).isRequired,
};