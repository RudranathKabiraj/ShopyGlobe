// File: src/hooks/useFetchProducts.js

import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to fetch product data from your backend API
export default function useFetchProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //Fetch from your backend instead of dummyjson
        const response = await axios.get('http://localhost:5000/api/products');

        //Use response data as-is (MongoDB returns _id)
        setProducts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}
