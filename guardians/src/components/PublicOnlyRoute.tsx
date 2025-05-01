// components/PublicOnlyRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {JSX} from "react";

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null; // 로딩 중이면 아무것도 안 보임

    return user ? <Navigate to="/" replace /> : children;
};

export default PublicOnlyRoute;
