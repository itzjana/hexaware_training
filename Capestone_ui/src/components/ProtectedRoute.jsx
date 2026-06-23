import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute
 *
 * Props:
 *  - allowedRoles: string[]  — e.g. ['ADMIN'], ['INSURANCE_OFFICER'], ['CUSTOMER']
 *                              If empty / not provided, only checks that the user is logged in.
 *  - children: ReactNode     — the page to render when access is granted
 *
 * Role is stored in localStorage as 'role' after login.
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');

    // Not logged in → go to /login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role → redirect to their own dashboard
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        if (role === 'ADMIN')              return <Navigate to="/admin/dashboard" replace />;
        if (role === 'INSURANCE_OFFICER')  return <Navigate to="/officer/dashboard" replace />;
        return <Navigate to="/customer/dashboard" replace />;
    }

    return children;
}
