import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom'; // ✅ REMOVE BrowserRouter import
import Header from './components/Header';
import NotFound from './components/NotFound';

const ProductList = lazy(() => import('./components/ProductList'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Header />
      <main className="container mx-auto p-4">
        <Suspense
          fallback={
            <div className="text-center text-lg text-blue-500 font-semibold">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
