import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

// Layout Elements
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// Guards
import { PrivateRoute, AdminRoute } from './components/PrivateRoute.jsx';

// Page Views
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-neutralbg font-poppins selection:bg-accent selection:text-white">
            
            {/* Navigation Header */}
            <Header />

            {/* Main Content Area */}
            <main className="flex-grow">
              <Routes>
                {/* Public General Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Customer Authenticated Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order/:id" element={<OrderDetails />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Admin Management System Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Fallback Catch-All */}
                <Route 
                  path="*" 
                  element={
                    <div className="text-center py-20 bg-white m-8 rounded-3xl shadow-sm border border-slate-100 max-w-md mx-auto">
                      <h3 className="text-2xl font-extrabold text-slate-800">404 - Page Not Found</h3>
                      <p className="text-slate-500 text-xs mt-2 mb-6">The page you were looking for doesn't exist.</p>
                      <a href="/" className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow hover:bg-secondary transition">
                        Back to Home
                      </a>
                    </div>
                  } 
                />
              </Routes>
            </main>

            {/* Sticky/Constant Footer */}
            <Footer />

            {/* Global Toasts Notifications Provider */}
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
