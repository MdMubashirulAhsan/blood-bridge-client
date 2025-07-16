import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // ✅ Required
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const DonorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation(); // ✅ Needed for redirect memory

  if (loading || roleLoading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user || role !== 'donor') {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return children;
};

export default DonorRoute;
