// File: src/hooks/useFetchProducts.js

import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to fetch product data from API
export default function useFetchProducts() {
  // State to store the fetched products
  const [products, setProducts] = useState([]);

  //State to track loading status
  const [loading, setLoading] = useState(true);

  // state to track if any error occurred
  const [error, setError] = useState(null);

  // useEffect runs once on component mount to fetch data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch product data from dummyjson API with a limit of 100 products
        const response = await axios.get('https://dummyjson.com/products?limit=100');
        
        //storing the products in state
        setProducts(response.data.products);
      } catch (err) {
        //Set error state if fetching fails
        setError(err);
      } finally {
        //always stop loading after request is done (success or error)
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchProducts();
  }, []); // Empty dependency array means this runs only once

  // Return the products, loading status, and error if any
  return { products, loading, error };
}
