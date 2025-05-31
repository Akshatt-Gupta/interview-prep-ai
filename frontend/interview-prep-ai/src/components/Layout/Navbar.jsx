import React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import ProfileInfoCard from "../Cards/ProfileInfoCard";

const Navbar = () => {
    const { user, loading } = useUserContext();

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link 
                        to={user ? "/dashboard" : "/"} 
                        className="flex items-center gap-2"
                    >
                        <span className="text-lg font-extrabold bg-gradient-to-r from-[#FF9324] to-[#e99a4b] bg-clip-text text-transparent">
                            Interview Prep AI
                        </span>
                    </Link>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        {loading ? (
                            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="w-20 h-3 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="w-12 h-2 bg-gray-100 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ) : user ? (
                            <ProfileInfoCard />
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-5 py-2 rounded-full hover:shadow-md transition-all duration-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;