import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // ✅ Required imports
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const VolunteerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation(); // ✅ Correctly get current location

  if (loading || roleLoading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user || role !== 'volunteer') {
    return <Navigate to="/forbidden" replace state={{ from: location }} />;
  }

  return children;
};

export default VolunteerRoute;
