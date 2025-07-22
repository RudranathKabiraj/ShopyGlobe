import React from 'react';
import ProductItem from './ProductItem';
import useFetchProducts from './useFetchProducts';
import { useSelector } from 'react-redux';

export default function ProductList() {
  const { products, loading, error } = useFetchProducts();

  // Safe selector with fallback to empty string
  const searchQuery = useSelector((state) => {
    const rawQuery = state.search?.query;
    return typeof rawQuery === 'string' ? rawQuery.toLowerCase() : '';
  });

  // ✅ Safe filtering (avoid undefined product.name)
  const filteredProducts = products.filter((product) =>
    (product.name || '').toLowerCase().includes(searchQuery)
  );

  if (loading)
    return (
      <div className="text-center text-blue-600 text-lg py-8">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 text-lg py-8">
        Error fetching products.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Explore Products
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
