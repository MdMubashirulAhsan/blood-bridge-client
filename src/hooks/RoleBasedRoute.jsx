// src/components/RoleBasedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { role, roleLoading } = useUserRole(); // Fetch role from DB
  const location = useLocation();

  if (authLoading || roleLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RoleBasedRoute;
