import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // ✅ useLocation here!
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation(); // ✅ get location

  if (loading || roleLoading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return children;
};

export default AdminRoute;
