import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

//  Importing reusable price formatter
import { formatPrice } from '../utils/priceFormatter';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

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

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    dispatch(addToCart(product));
    setAdded(true);

    // 🟡 Decrement stock visually
    setProduct((prev) => ({
      ...prev,
      stock: prev.stock - 1,
    }));

    // 🟢 Update backend stock
    try {
      await fetch(`http://localhost:5000/api/products/${product._id}/decrement`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('Failed to update stock in backend:', err.message);
    }

    setTimeout(() => setAdded(false), 1500);
  };

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full max-h-[500px] object-contain rounded mb-4"

      />

      <p className="text-gray-600 mb-2">{product.description}</p>

      {/* Price formatted properly using utility */}
      <p className="text-xl font-semibold text-green-700">
        {formatPrice(product.price)}
      </p>

      <p className="text-sm text-gray-500 mt-2">Brand: {product.brand}</p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>
      <p className={`text-sm mt-2 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
      </p>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className={`mt-6 w-full ${
          product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-semibold py-2 px-4 rounded-lg transition`}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>

      {added && (
        <p className="text-green-600 mt-3 font-medium">Product added to cart!</p>
      )}
    </div>
  );
}
