import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Loader from './Loader.jsx';

const PrivateRoute = () => {
  const { userInfo, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loader fullPage={true} />;
  }

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const AdminRoute = () => {
  const { userInfo, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader fullPage={true} />;
  }

  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export { PrivateRoute, AdminRoute };
