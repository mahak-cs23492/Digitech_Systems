import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { 
  FiShoppingCart, 
  FiHeart, 
  FiUser, 
  FiLogOut, 
  FiSearch, 
  FiMenu, 
  FiX, 
  FiGrid, 
  FiChevronDown 
} from 'react-icons/fi';

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems, wishlist } = useContext(CartContext);

  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const categories = ['Laptops', 'Printers', 'Monitors', 'Accessories'];

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="bg-accent p-2 rounded-lg text-white font-bold text-xl tracking-wider">
              DS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight leading-none text-white hover:text-accent transition duration-300">
                DIGITECH
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest font-medium">
                SYSTEMS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 font-medium">
            <Link to="/" className="hover:text-accent transition duration-200">
              Home
            </Link>
            
            {/* Categories Mega Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center space-x-1 hover:text-accent transition duration-200 focus:outline-none"
              >
                <span>Products</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-52 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-50">
                  <Link 
                    to="/products" 
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm hover:bg-slate-50 hover:text-accent font-semibold transition"
                  >
                    <FiGrid className="mr-2" /> All Categories
                  </Link>
                  <div className="border-t border-slate-100 my-1"></div>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${cat}`}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-accent transition"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className="hover:text-accent transition duration-200">
              About
            </Link>
            <Link to="/contact" className="hover:text-accent transition duration-200">
              Contact
            </Link>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-md w-full mx-8">
            <input
              type="text"
              placeholder="Search laptops, printers, monitors..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-full px-5 py-2.5 pl-12 text-sm border border-slate-750 focus:outline-none focus:border-accent focus:bg-slate-900 transition-all"
            />
            <FiSearch className="absolute left-4 text-slate-400 w-5 h-5 cursor-pointer" onClick={handleSearch} />
          </form>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center space-x-6">
            
            {/* Wishlist Icon */}
            <Link to="/profile?tab=wishlist" className="relative hover:text-accent transition duration-200">
              <FiHeart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-highlight text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative hover:text-accent transition duration-200">
              <FiShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-1.5 focus:outline-none hover:text-accent transition"
                >
                  <div className="bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-slate-600">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <FiChevronDown className="w-4 h-4" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold truncate text-slate-900">{userInfo.name}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-slate-50 hover:text-accent transition"
                    >
                      My Dashboard
                    </Link>

                    {userInfo.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/5 transition"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-accent hover:bg-secondary text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition duration-300 transform hover:scale-105"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden items-center space-x-4">
            <Link to="/cart" className="relative hover:text-accent text-white">
              <FiShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-accent focus:outline-none"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center relative mb-4">
            <input
              type="text"
              placeholder="Search Products..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:border-accent"
            />
            <FiSearch className="absolute left-3 text-slate-400" onClick={handleSearch} />
          </form>

          {/* Navigation links */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white py-2 border-b border-slate-800"
          >
            Home
          </Link>
          
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-2 pl-2">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white py-1 text-sm"
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${cat}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-white py-1 text-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white py-2 border-b border-slate-800"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white py-2 border-b border-slate-800"
          >
            Contact
          </Link>

          {/* Profile options */}
          {userInfo ? (
            <div className="pt-2 border-t border-slate-850">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white leading-tight">{userInfo.name}</p>
                  <p className="text-xs text-slate-400">{userInfo.email}</p>
                </div>
              </div>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-2 text-sm"
              >
                My Dashboard / Wishlist
              </Link>

              {userInfo.isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-accent font-bold py-2 text-sm"
                >
                  Admin Control Panel
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mt-2 w-full text-left flex items-center py-2 text-sm text-red-400"
              >
                <FiLogOut className="mr-2" /> Log Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block bg-accent text-center text-white py-3 rounded-lg font-bold shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
