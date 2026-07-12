import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo, register, loading } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const result = await register(name, email, password, phone);
    if (result.success) {
      toast.success('Registration successful! Welcome!');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
      
      {loading && <Loader fullPage={true} />}

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-card max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-xs">Join DIGITECH SYSTEMS to place orders and manage gear.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
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
              placeholder="e.g. jane.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Phone Number (Optional)</label>
            <input
              type="tel"
              placeholder="e.g. +91 9927700201"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Verify password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-secondary text-white font-bold py-3.5 rounded-xl shadow-md transition duration-300 transform active:scale-98 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <div className="border-t border-slate-50 pt-4 text-center text-xs text-slate-500">
          <p>
            Already have an account?{' '}
            <Link 
              to={`/login?redirect=${encodeURIComponent(redirect)}`} 
              className="text-accent font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
