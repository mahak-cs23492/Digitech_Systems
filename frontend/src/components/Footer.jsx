import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiClock
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing to DIGITECH SYSTEMS newsletter!');
      setEmail('');
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        
        {/* Brand Information */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-accent p-2 rounded-lg text-white font-bold text-lg tracking-wider">
              DS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                DIGITECH
              </span>
              <span className="text-[9px] text-slate-400 tracking-widest font-medium">
                SYSTEMS
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            DIGITECH SYSTEMS is your trusted technology partner, offering premium computers, heavy-duty printers, crystal-clear monitors, and high-performance accessories.
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="bg-slate-800 p-2.5 rounded-full hover:bg-accent hover:text-white transition duration-300">
              <FiFacebook className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="bg-slate-800 p-2.5 rounded-full hover:bg-accent hover:text-white transition duration-300">
              <FiTwitter className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="bg-slate-800 p-2.5 rounded-full hover:bg-accent hover:text-white transition duration-300">
              <FiInstagram className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="bg-slate-800 p-2.5 rounded-full hover:bg-accent hover:text-white transition duration-300">
              <FiLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-base font-bold tracking-wider uppercase mb-5">Quick Links</h3>
          <ul className="space-y-3.5 text-sm">
            <li>
              <Link to="/" className="hover:text-accent transition duration-200">Home</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-accent transition duration-200">Product Catalog</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-accent transition duration-200">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-accent transition duration-200">Contact Us</Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-accent transition duration-200">My Dashboard</Link>
            </li>
          </ul>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="text-white text-base font-bold tracking-wider uppercase mb-5">Categories</h3>
          <ul className="space-y-3.5 text-sm">
            <li>
              <Link to="/products?category=Laptops" className="hover:text-accent transition duration-200">Laptops & Notebooks</Link>
            </li>
            <li>
              <Link to="/products?category=Printers" className="hover:text-accent transition duration-200">Printers & Scanners</Link>
            </li>
            <li>
              <Link to="/products?category=Monitors" className="hover:text-accent transition duration-200">Monitors & Displays</Link>
            </li>
            <li>
              <Link to="/products?category=Accessories" className="hover:text-accent transition duration-200">Computer Accessories</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info / Newsletter */}
        <div>
          <h3 className="text-white text-base font-bold tracking-wider uppercase mb-5">Contact Details</h3>
          <ul className="space-y-3.5 text-sm text-slate-400 mb-6">
            <li className="flex items-start">
              <FiMapPin className="text-accent w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <span>123 Technology Way, Electronic City, Suite 100</span>
            </li>
            <li className="flex items-center">
              <FiPhone className="text-accent w-5 h-5 mr-3 flex-shrink-0" />
              <span>+1 (555) 234-5678</span>
            </li>
            <li className="flex items-center">
              <FiMail className="text-accent w-5 h-5 mr-3 flex-shrink-0" />
              <span>sales@digitechsystems.com</span>
            </li>
            <li className="flex items-center">
              <FiClock className="text-accent w-5 h-5 mr-3 flex-shrink-0" />
              <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
            </li>
          </ul>

          <h4 className="text-white text-sm font-bold mb-3 uppercase tracking-wider">Subscribe to Newsletter</h4>
          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800 text-white rounded-l-lg px-4 py-2 text-xs border border-slate-700 focus:outline-none focus:border-accent w-full"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-secondary text-white rounded-r-lg px-4 py-2 text-xs font-semibold tracking-wider transition duration-300"
            >
              Join
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-850 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} DIGITECH SYSTEMS. All rights reserved. Your Trusted Technology Partner.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-accent transition">Privacy Policy</a>
          <a href="#" className="hover:text-accent transition">Terms of Service</a>
          <a href="#" className="hover:text-accent transition">Support Desk</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
