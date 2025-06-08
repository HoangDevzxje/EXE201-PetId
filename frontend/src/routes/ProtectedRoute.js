import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and user doesn't have the required role
  if (role && user.role !== role) {
    // If user is admin but trying to access user routes, allow it
    if (role === "user" && user.role === "admin") {
      return children;
    }

    // If user is regular user trying to access admin routes, redirect to home
    if (role === "admin" && user.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    // For other cases, redirect based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin/users" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
