import React from "react";
import { useUserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";

const DashboardLayout = ({children}) => {
    const { user, loading } = useUserContext();
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }
    
    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar/>
            <div className="pt-4">{children}</div>
        </div>
    );
}

export default DashboardLayout;
