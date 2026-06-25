import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQuantity, decreaseQuantity } from '../redux/cartSlice';
import { formatPrice } from '../utils/priceFormatter';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [sliding, setSliding] = useState(false);
  const dispatch = useDispatch();

  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item._id === id)
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProduct();
  }, [id]);

  const availableStock = (product?.stock ?? 0) - quantity;
  const outOfStock = (product?.stock ?? 0) === 0;

  const handleAdd = () => {
    if (availableStock <= 0) return;
    if (quantity === 0) {
      setSliding(true);
      setTimeout(() => setSliding(false), 500);
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

  if (error) return <p className="text-red-600 text-center mt-10">Error: {error}</p>;
  if (!product) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

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

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

          {/* Left - Image */}
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
            <img
              src={product.thumbnail || '/assets/placeholder.jpg'}
              alt={product.name}
              onError={(e) => { e.target.onerror = null; e.target.src = '/assets/placeholder.jpg'; }}
              className="max-h-96 object-contain rounded-xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Right - Details */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
                {product.category}
              </span>

              <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-1">{product.name}</h1>
              <p className="text-sm text-gray-400 mb-3">Brand: <span className="text-gray-600 font-medium">{product.brand}</span></p>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>

              <p className="text-3xl font-bold text-green-600 mb-2">{formatPrice(product.price)}</p>

              <p className={`text-sm font-semibold mb-6 ${availableStock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                {outOfStock
                  ? '❌ Out of Stock'
                  : availableStock <= 0
                  ? '⚠️ Max added to cart'
                  : `✅ In Stock: ${availableStock} left`}
              </p>
            </div>

            {/* Button */}
            <div style={{ height: '48px', position: 'relative' }}>
              {outOfStock ? (
                <button
                  disabled
                  style={{ position: 'absolute', inset: 0, width: '100%' }}
                  className="rounded-xl font-semibold bg-red-500 text-white cursor-not-allowed text-sm"
                >
                  Not Available
                </button>

              ) : quantity === 0 ? (
                <button
                  onClick={handleAdd}
                  style={{ position: 'absolute', inset: 0, width: '100%' }}
                  className={`rounded-xl font-semibold text-white text-sm ${sliding ? 'slide-green' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-150`}
                >
                  {sliding ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                </button>

              ) : (
                <div
                  className="flex items-center justify-between rounded-xl overflow-hidden bg-green-600"
                  style={{ position: 'absolute', inset: 0, width: '100%' }}
                >
                  <button
                    onClick={handleDecrease}
                    className="text-white font-bold px-6 h-full hover:bg-green-700 active:bg-green-800 transition-colors duration-100 text-xl"
                  >
                    −
                  </button>

                  <span className="text-white font-bold text-base flex-1 text-center">
                    <span key={quantity} className="pop-num" style={{ display: 'inline-block' }}>
                      {quantity} in cart
                    </span>
                  </span>

                  <button
                    onClick={handleAdd}
                    disabled={availableStock <= 0}
                    className={`text-white font-bold px-6 h-full transition-colors duration-100 text-xl ${availableStock <= 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-green-700 active:bg-green-800'}`}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}