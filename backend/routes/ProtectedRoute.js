import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../"; 
const ProtectedRoute = () => {
  const { user } = useAuth(); // Get the authenticated user from context

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;