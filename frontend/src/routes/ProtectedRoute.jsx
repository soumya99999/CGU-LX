import { Navigate } from "react-router-dom";
<<<<<<< HEAD
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
=======
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
>>>>>>> c4114f99194437ff9ad2e33db83c366dba76bd81

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        console.log("Protected Route - User:", user);
        console.log("Protected Route - Loading:", loading);
    }, [user, loading]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
