import React from "react";
import { useUserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
    const { user, clearUser } = useUserContext();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        clearUser();
        navigate("/");
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2); // Limit to 2 characters
    };

    return (
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-100 hover:border-gray-200 transition-all duration-200">
            {user.profileImageUrl ? (
                <img 
                    src={user.profileImageUrl}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-gray-100 shadow-sm"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF9324] to-[#e99a4b] flex items-center justify-center text-white font-medium text-sm shadow-sm">
                    {getInitials(user.name || "Guest User")}
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 line-clamp-1">{user.name || "Guest User"}</span>
                <button 
                    onClick={handleLogout}
                    className="text-xs text-orange-600 font-medium text-left hover:text-orange-700"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default ProfileInfoCard;