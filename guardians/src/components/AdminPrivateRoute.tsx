// src/components/AdminPrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // AuthContext의 useAuth 훅 임포트

const AdminPrivateRoute: React.FC = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>관리자 권한 확인 중...</div>;
    }

    const isAdmin = user && user.role === 'ADMIN';

    if (isAdmin && location.pathname === '/admin/login') {
        return <Navigate to="/admin/wargames" replace />;
    }

    if (!isAdmin && location.pathname !== '/admin/login') {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminPrivateRoute;