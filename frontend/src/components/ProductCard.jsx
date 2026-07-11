import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { CartContext } from '../context/CartContext.jsx';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);

  const discountAmount = product.discountPrice > 0 ? product.price - product.discountPrice : 0;
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error('Out of stock!');
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (isWishlisted) {
      toast.info(`${product.name} removed from wishlist.`);
    } else {
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-cardHover hover:border-accent/15 overflow-hidden transition-all duration-300 flex flex-col h-full"
    >
      
      {/* Badges Container */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.bestSeller && (
          <span className="bg-highlight text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            Best Seller
          </span>
        )}
        {product.newArrival && (
          <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            New Arrival
          </span>
        )}
        {product.discountPrice > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            Save ₹{discountAmount}
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full border shadow-sm transition-all duration-300 ${
          isWishlisted 
            ? 'bg-red-550 border-red-550 text-white bg-red-500' 
            : 'bg-white/80 backdrop-blur-md border-slate-200 text-slate-500 hover:text-red-550 hover:bg-white hover:text-red-500'
        }`}
      >
        <FiHeart className="w-4 h-4 fill-current" />
      </button>

      {/* Image Gallery Trigger */}
      <Link to={`/product/${product._id}`} className="relative block bg-slate-50 pt-[100%] overflow-hidden">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-widest bg-slate-950/80 px-4 py-2 rounded-lg">
              Out Of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Info Body */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Brand */}
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1.5 block">
          {product.brand}
        </span>

        {/* Title */}
        <Link 
          to={`/product/${product._id}`}
          className="text-slate-900 font-bold text-sm hover:text-accent transition duration-200 line-clamp-2 min-h-[40px] mb-2.5 block"
        >
          {product.name}
        </Link>

        {/* Reviews */}
        <div className="flex items-center space-x-1 mb-4">
          <div className="flex text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar 
                key={i} 
                className={`w-3.5 h-3.5 ${
                  i < Math.round(product.rating || 0) ? 'fill-current' : 'text-slate-200'
                }`} 
              />
            ))}
          </div>
          <span className="text-slate-400 text-[11px] font-medium">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div>
            {product.discountPrice > 0 ? (
              <div className="flex flex-col">
                <span className="text-red-500 font-extrabold text-base leading-none">
                  ₹{product.discountPrice}
                </span>
                <span className="text-slate-400 line-through text-xs mt-1">
                  ₹{product.price}
                </span>
              </div>
            ) : (
              <span className="text-slate-950 font-extrabold text-base">
                ₹{product.price}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCartClick}
            disabled={product.stock === 0}
            className={`p-3 rounded-xl shadow-sm transition-all duration-300 focus:outline-none flex items-center justify-center ${
              product.stock === 0
                ? 'bg-slate-100 text-slate-350 cursor-not-allowed text-slate-400'
                : 'bg-accent hover:bg-secondary text-white hover:shadow-md'
            }`}
            title="Add to Cart"
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>

    </motion.div>
  );
};

export default ProductCard;
