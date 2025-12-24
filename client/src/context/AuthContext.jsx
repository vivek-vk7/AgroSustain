import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserStatus = async () => {
            const userInfo = localStorage.getItem('userInfo');

            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
                // Set global header if user exists
                axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;

                try {
                    // Fetch latest profile to sync status (e.g. if admin approved while user was logged in/away)
                    const { data } = await axios.get('http://localhost:5000/api/auth/profile');

                    // Merge new data (status) with existing token
                    const updatedUser = { ...parsedUser, ...data };
                    setUser(updatedUser);
                    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                } catch (error) {
                    console.error("Session sync failed:", error);
                    // If token is expired/invalid, logout to prevent stuck state
                    if (error.response?.status === 401) {
                        localStorage.removeItem('userInfo');
                        delete axios.defaults.headers.common['Authorization'];
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };

        checkUserStatus();
    }, []);

    // Login Function
    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);

            // Save user to localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            // Set global header
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return { success: true, user: data };
        } catch (error) {
            return {
                success: false,
                message: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
            };
        }
    };

    // Register Function
    const register = async (userData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post('http://localhost:5000/api/auth/register', userData, config);

            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            // Set global header
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return { success: true, user: data };
        } catch (error) {
            return {
                success: false,
                message: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
            };
        }
    };

    // Logout Function
    const logout = () => {
        localStorage.removeItem('userInfo');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
