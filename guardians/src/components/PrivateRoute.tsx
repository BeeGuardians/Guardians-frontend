// components/PrivateRoute.tsx
import {JSX, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login", { replace: true });
        }
    }, [user, isLoading, navigate]);

    if (isLoading) return null;

    return user ? children : null;
};

export default PrivateRoute;
