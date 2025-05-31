import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

const UserContext = createContext();

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('token');
        if(!accessToken){
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                setError(null);
                const response = await axiosInstance.get(API_PATHS.AUTH.ME);
                if (response.data) {
                    setUser({
                        ...response.data,
                        token: accessToken // Preserve the token
                    });
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setError(error.message || 'Failed to fetch user data');
                // Clear invalid token
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const updateUser = (userData) => {
        if (!userData) {
            setUser(null);
            localStorage.removeItem('token');
            return;
        }

        const { token, ...rest } = userData;
        if (token) {
            localStorage.setItem('token', token);
        }
        
        setUser({
            ...rest,
            token: token || localStorage.getItem('token')
        });
        setLoading(false);
        setError(null);
    };

    const clearUser = () => {
        setUser(null);
        setError(null);
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ 
            user, 
            loading, 
            error,
            updateUser, 
            clearUser 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
