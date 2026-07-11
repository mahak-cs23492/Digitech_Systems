import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import API from '../utils/api.js';
import Loader from '../components/Loader.jsx';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const {
    cartItems,
    clearCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useContext(CartContext);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [loading, setLoading] = useState(false);

  // Load default user address details
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    if (userInfo && userInfo.shippingAddress) {
      setAddress(userInfo.shippingAddress.address || '');
      setCity(userInfo.shippingAddress.city || '');
      setPostalCode(userInfo.shippingAddress.postalCode || '');
      setCountry(userInfo.shippingAddress.country || '');
    }
  }, [userInfo, cartItems, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      toast.error('Please complete all shipping address fields');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const { data } = await API.post('/api/orders', orderData);
      
      // Clear shopping cart on successful submission
      clearCart();
      
      toast.success('Order placed successfully!');
      navigate(`/order/${data._id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Secure Checkout</h2>

      {loading && <Loader fullPage={true} />}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shipping Form & Payment Selection */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Details */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">Shipping Address</h3>
            
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 Main St, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Los Angeles"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Postal / Zip Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 90001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Country</label>
                  <input
                    type="text"
                    placeholder="e.g. USA"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">Payment Method</h3>
            
            <div className="grid grid-cols-3 gap-4">
              {['Card', 'PayPal', 'Cash'].map((method) => (
                <label
                  key={method}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                    paymentMethod === method
                      ? 'border-accent bg-accent/5 text-accent font-bold shadow-sm'
                      : 'border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentGroup"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="sr-only"
                  />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>

          </div>

        </div>

        {/* Order Review Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-card self-start space-y-6">
          <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">Review Items</h3>
          
          {/* Scrollable list of items */}
          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center space-x-3.5 text-xs">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 object-contain p-1 border rounded bg-slate-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{item.name}</p>
                  <p className="text-slate-400 mt-0.5">{item.qty} x ₹{(item.discountPrice > 0 ? item.discountPrice : item.price)}</p>
                </div>
                <span className="font-extrabold text-slate-900 flex-shrink-0">
                  ₹{Math.round((item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty * 100) / 100}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-50 pt-4 space-y-3.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items Total:</span>
              <span className="font-semibold text-slate-800">₹{itemsPrice}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping cost:</span>
              <span className="font-semibold text-slate-800">
                {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Sales Tax (8%):</span>
              <span className="font-semibold text-slate-800">₹{taxPrice}</span>
            </div>
            <div className="border-t border-slate-50 pt-4 flex justify-between text-base font-extrabold text-slate-900">
              <span>Grand Total:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-secondary text-white font-bold py-4 rounded-xl shadow-md transition duration-300 inline-block text-center cursor-pointer"
          >
            Place My Order
          </button>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
