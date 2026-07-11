import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { CartContext } from '../context/CartContext.jsx';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateCartQty,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useContext(CartContext);

  const handleQtyChange = (id, currentQty, stock, increment) => {
    const nextQty = currentQty + increment;
    if (nextQty >= 1 && nextQty <= stock) {
      updateCartQty(id, nextQty);
    }
  };

  const handleCheckout = () => {
    navigate('/login?redirect=checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-card py-16 px-6 text-center max-w-md mx-auto">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <FiShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Your Cart is Empty</h3>
          <p className="text-slate-500 text-sm mt-2">
            Looks like you haven't added any products to your shopping cart yet.
          </p>
          <Link
            to="/products"
            className="mt-6 bg-accent hover:bg-secondary text-white font-bold px-6 py-3 rounded-full shadow-md transition duration-300 inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-card transition duration-300 flex items-center justify-between flex-wrap gap-4"
              >
                
                {/* Product Image & Link */}
                <div className="flex items-center space-x-4 min-w-[240px] flex-1">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <Link
                      to={`/product/${item.product}`}
                      className="text-slate-950 font-bold hover:text-accent transition duration-200 line-clamp-2 text-sm"
                    >
                      {item.name}
                    </Link>
                    <span className="text-xs text-slate-400 font-semibold block mt-1">
                      In Stock: {item.stock}
                    </span>
                  </div>
                </div>

                {/* Price (including discount calculations) */}
                <div className="w-28 text-left sm:text-center">
                  {item.discountPrice > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-red-500 font-extrabold text-sm">₹{item.discountPrice}</span>
                      <span className="text-slate-400 line-through text-xs">₹{item.price}</span>
                    </div>
                  ) : (
                    <span className="text-slate-900 font-extrabold text-sm">₹{item.price}</span>
                  )}
                </div>

                {/* Quantity Toggle */}
                <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-1 bg-slate-50 w-28">
                  <button
                    onClick={() => handleQtyChange(item.product, item.qty, item.stock, -1)}
                    disabled={item.qty <= 1}
                    className="text-slate-500 hover:text-slate-800 disabled:text-slate-350 disabled:cursor-not-allowed focus:outline-none"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-800 text-sm font-bold">{item.qty}</span>
                  <button
                    onClick={() => handleQtyChange(item.product, item.qty, item.stock, 1)}
                    disabled={item.qty >= item.stock}
                    className="text-slate-555 hover:text-slate-800 disabled:text-slate-355 disabled:cursor-not-allowed focus:outline-none text-slate-500"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal Item Value */}
                <div className="w-28 text-right font-extrabold text-slate-900 text-sm">
                  ₹{Math.round((item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty * 100) / 100}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="text-slate-450 hover:text-red-550 focus:outline-none p-2 text-slate-405 hover:text-red-505 hover:bg-red-50 rounded-xl transition duration-200 text-slate-400 hover:text-red-500"
                  title="Remove Item"
                >
                  <FiTrash2 className="w-4.5 h-4.5" />
                </button>

              </div>
            ))}
          </div>

          {/* Checkout Summary Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-card self-start space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">Order Summary</h3>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-650">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-850">₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between text-slate-655">
                <span>Shipping Fee:</span>
                <span className="font-semibold text-slate-850">
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-660">
                <span>Sales Tax (8%):</span>
                <span className="font-semibold text-slate-850">₹{taxPrice}</span>
              </div>
              
              {shippingPrice > 0 && (
                <p className="text-[11px] text-accent font-medium bg-accent/5 p-2 rounded-lg">
                  💡 Tip: Add ₹{(500 - itemsPrice).toFixed(2)} more to qualify for Free Shipping!
                </p>
              )}

              <div className="border-t border-slate-50 pt-4 flex justify-between text-base font-extrabold text-slate-900">
                <span>Est. Total:</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-accent hover:bg-secondary text-white font-bold py-3.5 rounded-xl shadow-md transition duration-300 flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <FiArrowRight />
            </button>
            
            <div className="text-center">
              <Link to="/products" className="text-xs text-slate-500 hover:text-accent hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
