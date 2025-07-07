import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

// ✅ Format USD to INR with 2 decimal places
const formatPrice = (priceInUSD) => {
  const priceInINR = parseFloat((priceInUSD * 83).toFixed(2));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceInINR);
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
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
        className="w-full h-80 object-cover rounded mb-4"
      />

      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-xl font-semibold text-green-700">
        {formatPrice(product.price)}
      </p>
      <p className="text-sm text-gray-500 mt-2">Brand: {product.brand}</p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>

      <button
        onClick={handleAddToCart}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Add to Cart
      </button>

      {added && (
        <p className="text-green-600 mt-3 font-medium">Product added to cart!</p>
      )}
    </div>
  );
}
