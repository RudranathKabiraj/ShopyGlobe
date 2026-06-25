import React, { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import NotFound from './components/NotFound';
import PaymentPage from "./components/PaymentPage";

const ProductList = lazy(() => import('./components/ProductList'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const Cart = lazy(() => import('./components/Cart'));
const Checkout = lazy(() => import('./components/Checkout'));

function App() {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="bg-gray-200 text-gray-900">
      <Header />
      <main style={{ flex: 1, overflow: isCheckout ? 'hidden' : 'auto' }} className={isCheckout ? '' : 'container mx-auto p-4'}>
        <Suspense fallback={<div className="text-center text-lg text-blue-500 font-semibold">Loading...</div>}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;