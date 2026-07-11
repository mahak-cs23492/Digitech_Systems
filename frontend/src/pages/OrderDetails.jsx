import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../utils/api.js';
import Loader from '../components/Loader.jsx';
import { toast } from 'react-toastify';
import { FiCreditCard, FiTruck, FiBox, FiCheck, FiAlertTriangle } from 'react-icons/fi';

const OrderDetails = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error(error.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handlePayOrder = async () => {
    setActionLoading(true);
    try {
      const paymentResult = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'SUCCESS',
        update_time: new Date().toISOString(),
        email_address: userInfo.email,
      };

      const { data } = await API.put(`/api/orders/${id}/pay`, paymentResult);
      setOrder(data);
      toast.success('Payment simulated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment simulation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeliverOrder = async () => {
    setActionLoading(false);
    try {
      const { data } = await API.put(`/api/orders/${id}/deliver`);
      setOrder(data);
      toast.success('Order marked as shipped/delivered!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delivery update failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader fullPage={true} />;
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h3 className="text-2xl font-bold text-slate-800">Order Not Found</h3>
        <Link to="/" className="text-accent hover:underline mt-4 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Order Details</h2>
        <p className="text-slate-400 text-xs mt-1">Order Ref: #{order._id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Status Sheets */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Status Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <FiTruck className="text-accent" />
              <span>Shipping Information</span>
            </h3>

            <div className="text-sm space-y-2 text-slate-650">
              <p><span className="font-bold text-slate-800">Customer Name:</span> {order.user?.name}</p>
              <p><span className="font-bold text-slate-800">Email:</span> {order.user?.email}</p>
              <p>
                <span className="font-bold text-slate-800">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>

            {/* Delivery Status Badge */}
            {order.isDelivered ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-center space-x-3 text-sm">
                <FiCheck className="w-5 h-5 flex-shrink-0" />
                <span>Shipped / Delivered on {new Date(order.deliveredAt).toLocaleDateString()} at {new Date(order.deliveredAt).toLocaleTimeString()}</span>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-2xl flex items-center space-x-3 text-sm">
                <FiAlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
                <span>Awaiting Shipment / Delivery</span>
              </div>
            )}
          </div>

          {/* Payment Status Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <FiCreditCard className="text-accent" />
              <span>Payment Status</span>
            </h3>

            <div className="text-sm space-y-2 text-slate-650">
              <p><span className="font-bold text-slate-800">Method:</span> {order.paymentMethod}</p>
              {order.isPaid && (
                <p><span className="font-bold text-slate-800">Transaction ID:</span> {order.paymentResult?.id}</p>
              )}
            </div>

            {/* Paid status badge */}
            {order.isPaid ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-center space-x-3 text-sm">
                <FiCheck className="w-5 h-5 flex-shrink-0" />
                <span>Paid on {new Date(order.paidAt).toLocaleDateString()} at {new Date(order.paidAt).toLocaleTimeString()}</span>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center space-x-3 text-sm">
                <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>Awaiting Payment</span>
              </div>
            )}
          </div>

          {/* Ordered Products Item Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-card space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <FiBox className="text-accent" />
              <span>Ordered Items</span>
            </h3>

            <div className="divide-y divide-slate-50">
              {order.orderItems.map((item) => (
                <div key={item.product} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-4 flex-1 min-w-[200px]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain p-1 border rounded bg-slate-50 flex-shrink-0"
                    />
                    <Link
                      to={`/product/${item.product}`}
                      className="text-slate-850 font-bold hover:text-accent truncate hover:underline"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="w-32 text-slate-500 text-right">
                    {item.qty} x ₹{item.price}
                  </div>
                  <div className="w-24 text-right font-extrabold text-slate-950">
                    ₹{Math.round(item.qty * item.price * 100) / 100}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Pricing Summary Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-card space-y-5">
            <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-50 pb-3">Bill Invoice</h3>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800">₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span className="font-semibold text-slate-800">
                  {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sales Tax (8%):</span>
                <span className="font-semibold text-slate-800">₹{order.taxPrice}</span>
              </div>
              <div className="border-t border-slate-50 pt-4 flex justify-between text-base font-extrabold text-slate-950">
                <span>Total Paid:</span>
                <span>₹{order.totalPrice}</span>
              </div>
            </div>

            {/* Payment triggers (Simulation) */}
            {!order.isPaid && (
              <button
                onClick={handlePayOrder}
                disabled={actionLoading}
                className="w-full bg-accent hover:bg-secondary text-white font-bold py-3.5 rounded-xl shadow-md transition duration-300 flex items-center justify-center space-x-2"
              >
                <span>Simulate Card Payment</span>
              </button>
            )}

            {/* Admin Shipment Trigger */}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                onClick={handleDeliverOrder}
                disabled={actionLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-md transition duration-300 flex items-center justify-center space-x-2 mt-4"
              >
                <span>Mark Order as Shipped</span>
              </button>
            )}

          </div>

          <div className="text-center">
            <Link to="/profile" className="text-xs text-slate-500 hover:text-accent hover:underline">
              Go to Order History Dashboard
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetails;
