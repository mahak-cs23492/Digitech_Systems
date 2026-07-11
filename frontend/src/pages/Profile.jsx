import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import API from '../utils/api.js';
import Loader from '../components/Loader.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { toast } from 'react-toastify';
import { FiUser, FiMapPin, FiPackage, FiHeart, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

const Profile = () => {
  const { userInfo, updateProfile } = useContext(AuthContext);
  const { wishlist } = useContext(CartContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  // Personal Info Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Shipping Defaults Form States
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Order history
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Initialize fields
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      if (userInfo.shippingAddress) {
        setAddress(userInfo.shippingAddress.address || '');
        setCity(userInfo.shippingAddress.city || '');
        setPostalCode(userInfo.shippingAddress.postalCode || '');
        setCountry(userInfo.shippingAddress.country || '');
      }
    }
  }, [userInfo]);

  // Load orders if on orders tab
  useEffect(() => {
    if (activeTab === 'orders' && userInfo) {
      const fetchMyOrders = async () => {
        setOrdersLoading(true);
        try {
          const { data } = await API.get('/api/orders/myorders');
          setOrders(data);
        } catch (error) {
          console.error('Error fetching user orders:', error);
          toast.error('Failed to load order history');
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchMyOrders();
    }
  }, [activeTab, userInfo]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setFormLoading(true);
    const result = await updateProfile({ name, email, password });
    setFormLoading(false);

    if (result.success) {
      toast.success('Profile details updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.error);
    }
  };

  const handleUpdateShipping = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const result = await updateProfile({
      shippingAddress: { address, city, postalCode, country }
    });
    setFormLoading(false);

    if (result.success) {
      toast.success('Default shipping details saved!');
    } else {
      toast.error(result.error);
    }
  };

  const switchTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <FiUser /> },
    { id: 'shipping', label: 'Shipping Details', icon: <FiMapPin /> },
    { id: 'orders', label: 'Order History', icon: <FiPackage /> },
    { id: 'wishlist', label: 'My Wishlist', icon: <FiHeart /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customer Dashboard</h2>
        <p className="text-slate-400 text-xs mt-1">Manage your account, order tracking, and wishlist settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-sm font-semibold tracking-wide transition duration-300 focus:outline-none ${
                activeTab === t.id
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-white border border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
              {t.id === 'wishlist' && wishlist.length > 0 && (
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'wishlist' ? 'bg-white text-accent' : 'bg-accent text-white'
                }`}>
                  {wishlist.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic content cards */}
        <div className="lg:col-span-3">
          
          {/* PROFILE DETAILS TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">Personal Profile</h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">New Password (Optional)</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep old password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-accent hover:bg-secondary text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition duration-300 transform active:scale-95"
                >
                  {formLoading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {/* SHIPPING DEFAULTS TAB */}
          {activeTab === 'shipping' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">Default Shipping Address</h3>
              
              <form onSubmit={handleUpdateShipping} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 123 Technology Way"
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
                      placeholder="e.g. Silicon Valley"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Postal Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 94025"
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

                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-accent hover:bg-secondary text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition duration-300 transform active:scale-95"
                >
                  {formLoading ? 'Saving...' : 'Save Default Address'}
                </button>
              </form>
            </div>
          )}

          {/* ORDER HISTORY TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">My Orders History</h3>
              
              {ordersLoading ? (
                <Loader />
              ) : orders.length === 0 ? (
                <div className="py-10 text-center text-slate-500 border border-dashed rounded-2xl">
                  No orders placed yet. Add items to cart and check out.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-slate-450 uppercase font-bold text-xs">
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Paid</th>
                        <th className="py-3 px-4">Delivered</th>
                        <th className="py-3 px-4 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                          <td className="py-4 px-4 font-mono text-xs font-bold text-slate-700">
                            <Link to={`/order/${ord._id}`} className="text-accent hover:underline">
                              {ord._id.substring(0, 10)}...
                            </Link>
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-800">
                            ${ord.totalPrice}
                          </td>
                          <td className="py-4 px-4">
                            {ord.isPaid ? (
                              <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center w-max">
                                <FiCheck className="mr-1" /> Paid
                              </span>
                            ) : (
                              <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center w-max">
                                <FiX className="mr-1" /> No
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {ord.isDelivered ? (
                              <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center w-max">
                                <FiCheck className="mr-1" /> Delivered
                              </span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center w-max">
                                <FiX className="mr-1" /> No
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link
                              to={`/order/${ord._id}`}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              View details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MY WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">My Wishlist</h3>
              
              {wishlist.length === 0 ? (
                <div className="py-12 text-center text-slate-500 border border-dashed rounded-2xl">
                  You haven't wishlisted any items yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlist.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;
