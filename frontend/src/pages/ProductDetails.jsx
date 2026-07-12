import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiCheckCircle, FiMinus, FiPlus, FiStar, FiFileText } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import API from '../utils/api.js';
import Loader from '../components/Loader.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const { addToCart, toggleWishlist, isInWishlist } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Gallery active index
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Cart quantity picker
  const [qty, setQty] = useState(1);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProduct(data);
        setActiveImageIndex(0);
        setQty(1);

        // Fetch related products in same category
        const { data: related } = await API.get(`/api/products?category=${data.category}`);
        setRelatedProducts(related.filter((p) => p._id !== data._id).slice(0, 4));
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <Loader fullPage={true} />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h3 className="text-2xl font-bold text-slate-800">Product Not Found</h3>
        <Link to="/products" className="text-accent hover:underline mt-4 inline-block font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const discountAmount = product.discountPrice > 0 ? product.price - product.discountPrice : 0;
  const isWishlisted = isInWishlist(product._id);

  const handleQtyChange = (val) => {
    setQty((prev) => Math.max(1, Math.min(product.stock, prev + val)));
  };

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, qty);
      toast.success(`${qty}x ${product.name} added to cart!`);
    } else {
      toast.error('Out of stock');
    }
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    if (isWishlisted) {
      toast.info('Removed from wishlist');
    } else {
      toast.success('Added to wishlist!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    setReviewLoading(true);
    try {
      await API.post(`/api/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      
      // Reload product details to show new review
      const { data } = await API.get(`/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setReviewLoading(false);
    }
  };

  // Convert specifications map object into iterable list
  const specList = product.specifications 
    ? (product.specifications instanceof Map 
       ? Array.from(product.specifications.entries()) 
       : Object.entries(product.specifications))
    : [];

  const productPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const productUrl = window.location.href;
  const messageText = `Hello DigiTech Systems,\n\nI would like to order the following product:\n- Product: ${product.name}\n- Price: ₹${productPrice}\n- Link: ${productUrl}\n\nPlease share availability. My details are:\n- Name:\n- Delivery Address:\n\nThank you!`;
  const whatsappUrl = `https://wa.me/919927700201?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 mb-8 flex space-x-2">
        <Link to="/" className="hover:text-accent">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-accent">{product.category}</Link>
        <span>/</span>
        <span className="text-slate-600 truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-card">
        
        {/* Gallery Section */}
        <div className="space-y-6">
          
          {/* Main Display */}
          <div className="relative pt-[85%] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
            <img
              src={product.images && product.images.length > 0 ? product.images[activeImageIndex] : 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-300"
            />
            {product.stock === 0 && (
              <span className="absolute bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow top-4 left-4">
                Out of Stock
              </span>
            )}
          </div>

          {/* Thumbnails grid */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3.5">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`pt-[100%] relative rounded-xl border overflow-hidden bg-slate-50 transition-all ${
                    activeImageIndex === idx ? 'border-accent ring-2 ring-accent/10' : 'border-slate-200 hover:border-slate-350'
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumbnail-${idx}`}
                    className="absolute inset-0 w-full h-full object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Product Details Section */}
        <div className="flex flex-col space-y-6">
          
          <div>
            <span className="text-accent text-xs font-bold uppercase tracking-widest bg-accent/5 px-3 py-1.5 rounded-md inline-block mb-3.5">
              {product.brand}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Review Ratings Header */}
          <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4.5 h-4.5 ${
                    i < Math.round(product.rating || 0) ? 'fill-current' : 'text-slate-250'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-800">{product.rating ? Math.round(product.rating * 10) / 10 : 0} Rating</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm text-slate-500 font-medium">({product.numReviews || 0} customer reviews)</span>
          </div>

          {/* Pricing Row */}
          <div>
            {product.discountPrice > 0 ? (
              <div className="space-y-1">
                <div className="flex items-baseline space-x-3">
                  <span className="text-red-500 font-extrabold text-3xl">
                    ₹{product.discountPrice}
                  </span>
                  <span className="text-slate-400 line-through text-lg">
                    ₹{product.price}
                  </span>
                </div>
                <p className="text-xs text-red-550 font-bold bg-red-500/5 px-2.5 py-1 rounded inline-block text-red-500">
                  You save ₹{discountAmount} ({Math.round((discountAmount / product.price) * 100)}% OFF)
                </p>
              </div>
            ) : (
              <span className="text-slate-950 font-extrabold text-3xl">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Stock details */}
          <div className="flex items-center space-x-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Availability:</span>
            {product.stock > 0 ? (
              <div className="flex items-center text-green-600 text-sm font-bold bg-green-50 px-3 py-1.5 rounded-lg">
                <FiCheckCircle className="mr-1.5" /> In Stock ({product.stock} units remaining)
              </div>
            ) : (
              <span className="text-red-500 text-sm font-bold bg-red-50 px-3 py-1.5 rounded-lg">
                Unavailable / Out of Stock
              </span>
            )}
          </div>

          {/* Order Selector Footer */}
          {product.stock > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4">
              
              {/* Quantity Picker */}
              <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-2 bg-slate-50 sm:w-36">
                <button
                  onClick={() => handleQtyChange(-1)}
                  disabled={qty <= 1}
                  className="text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed focus:outline-none"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="text-slate-800 font-bold">{qty}</span>
                <button
                  onClick={() => handleQtyChange(1)}
                  disabled={qty >= product.stock}
                  className="text-slate-500 hover:text-slate-800 disabled:text-slate-300 disabled:cursor-not-allowed focus:outline-none"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-accent hover:bg-secondary text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition duration-300 flex items-center justify-center space-x-2"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>

              {/* Order Now */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition duration-300 flex items-center justify-center space-x-2 text-center"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>Order Now</span>
              </a>

              {/* Wishlist Icon */}
              <button
                onClick={handleWishlistToggle}
                className={`p-3.5 rounded-xl border transition duration-300 flex items-center justify-center ${
                  isWishlisted 
                    ? 'bg-red-500 border-red-500 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <FiHeart className="w-5 h-5 fill-current" />
              </button>

            </div>
          )}

        </div>

      </div>

      {/* Specifications Table Panel */}
      {specList.length > 0 && (
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-card">
          <h3 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center space-x-2">
            <FiFileText className="text-accent" />
            <span>Specifications Sheets</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <tbody>
                {specList.map(([key, value]) => (
                  <tr key={key} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-600 w-1/3 bg-slate-50/50">{key}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews & Submit Forms Row */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-card">
        
        {/* View Reviews */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-6">Reviews ({product.reviews?.length || 0})</h3>
          
          {(!product.reviews || product.reviews.length === 0) ? (
            <div className="bg-slate-50/50 rounded-2xl p-6 text-center border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2">
              {product.reviews.map((rev) => (
                <div key={rev._id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-bold text-slate-800 text-sm">{rev.name}</h5>
                    <span className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-amber-500 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-current' : 'text-slate-200'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review */}
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-6">Write a Customer Review</h3>
          
          {userInfo ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              
              {/* Stars selection */}
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                  Rating Selection
                </label>
                <div className="flex items-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-amber-500 focus:outline-none"
                    >
                      <FiStar 
                        className={`w-7 h-7 hover:scale-110 transition ${
                          star <= rating ? 'fill-current' : 'text-slate-200'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                  Review Comment
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us what you think about this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="bg-primary hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition duration-300 shadow-md flex items-center justify-center"
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>

            </form>
          ) : (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
              <p className="text-slate-650 text-sm">
                You must be logged in to review products.
              </p>
              <Link
                to="/login"
                className="mt-4 bg-accent hover:bg-secondary text-white font-bold px-5 py-2.5 rounded-xl text-xs inline-block shadow-sm"
              >
                Sign In / Log In
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-extrabold text-slate-900 mb-8">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
