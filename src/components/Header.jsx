import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setSearchQuery } from "../redux/searchSlice";
import { CiShoppingCart } from "react-icons/ci";

export default function Header() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-[#131921] text-white z-50 shadow-md">
      <div className="w-full px-6 py-3 flex items-center gap-6 flex-wrap">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold text-yellow-100 tracking-wide"
        >
          ShoppyGlobe
        </Link>

        {/* Search Bar */}
        <div className="flex-grow max-w-2xl w-full">
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Navigation */}
        <nav className="ml-auto flex items-center gap-2 text-base font-bold">
          {/* Home */}
          <Link
            to="/"
            className="flex items-center h-12 px-5 py-2 rounded-md border border-transparent hover:border-white transition text-lg"
          >
            Home
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center h-12 px-5 py-2 rounded-md border border-transparent hover:border-white transition text-lg"
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <CiShoppingCart size={40} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute inset-0 flex items-center justify-center text-yellow-400 text-sm font-bold pointer-events-none">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="ml-2">Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
