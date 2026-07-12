import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo, login, loading } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirection handling (e.g. after login, redirect back to checkout if checkout was pending)
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter all credentials');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      toast.success('Successfully logged in!');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
      
      {loading && <Loader fullPage={true} />}

      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-card max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
          <p className="text-slate-400 text-xs">Welcome back to DIGITECH SYSTEMS client panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              placeholder="e.g. customer@digitech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-secondary text-white font-bold py-3.5 rounded-xl shadow-md transition duration-300 transform active:scale-98 cursor-pointer"
          >
            Sign In / Log In
          </button>
        </form>

        <div className="border-t border-slate-50 pt-4 text-center text-xs text-slate-500 space-y-2">
          <p>
            New customer?{' '}
            <Link 
              to={`/register?redirect=${encodeURIComponent(redirect)}`} 
              className="text-accent font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
