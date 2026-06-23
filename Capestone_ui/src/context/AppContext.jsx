import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AppContext = createContext();

// Inline localStorage helpers (previously in utili/store.js)
const getStoredUser = () => JSON.parse(localStorage.getItem('currentUser') || 'null');
const setStoredUser = (user) => {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
};

export const AppProvider = ({ children }) => {
    const [currentUser, setCurrentUserState] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
    const [notifications, setNotifications] = useState([]);

    // Initialize session from localStorage
    useEffect(() => {
        const user = getStoredUser();
        if (user) {
            setCurrentUserState(user);
        }
    }, []);

    const refreshNotifications = async () => {
        if (!currentUser) {
            setNotifications([]);
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:8080/api/notification/fetch', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data || []);
        } catch (error) {
            console.error("Failed to load notifications in AppContext:", error);
        }
    };

    // Load notifications when currentUser changes
    useEffect(() => {
        refreshNotifications();
    }, [currentUser]);

    const login = (user) => {
        setCurrentUserState(user);
        setStoredUser(user);
    };

    const logout = () => {
        setStoredUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setCurrentUserState(null);
        showToast("Logged out successfully.", "info");
    };

    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            login,
            logout,
            toast,
            showToast,
            notifications,
            refreshNotifications
        }}>
            {children}
            {/* Unified Toast Component */}
            <div className="custom-toast-container">
                <div className={`custom-toast ${toast.show ? 'show' : ''}`}>
                    <i className={`bi bi-${
                        toast.type === 'success' ? 'check-circle-fill text-success' :
                        toast.type === 'error' ? 'exclamation-circle-fill text-danger' :
                        toast.type === 'warning' ? 'exclamation-triangle-fill text-warning' :
                        'info-circle-fill text-primary'
                    }`}></i>
                    <span>{toast.message}</span>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
