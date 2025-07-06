import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  // Get product ID from the URL parameters
  const { id } = useParams();

  // State to hold the fetched product data
  const [product, setProduct] = useState(null);
  // State to handle fetch errors
  const [error, setError] = useState(null);

  // Fetch product details when the component mounts or when the ID changes
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product"); // Throw error if request fails
        const data = await res.json();
        setProduct(data); // Set the fetched product in state
      } catch (err) {
        setError(err.message); // Set error message
      }
    }

    fetchProduct(); // Call the fetch function
  }, [id]);

  //show error message if fetch failed
  if (error) return <p className="text-red-600">Error: {error}</p>;

  //Sshow loading text while product is being fetched
  if (!product) return <p>Loading...</p>;

  //render product details once data is available
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      
      {/* Product Image */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-80 object-cover rounded mb-4"
      />
      
      {/* Product Info */}
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-xl font-semibold text-green-700">${product.price}</p>
      <p className="text-sm text-gray-500 mt-2">Brand: {product.brand}</p>
      <p className="text-sm text-gray-500">Category: {product.category}</p>
    </div>
  );
}
