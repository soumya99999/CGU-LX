import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Debugging logs
  console.log("Protected Route - User:", user);
  console.log("Protected Route - Loading:", loading);

  // Show a loading spinner while checking auth state
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the children
  return children;
};

export default ProtectedRoute;
