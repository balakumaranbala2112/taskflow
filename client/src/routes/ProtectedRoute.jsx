import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore"

function ProtectedRoute() {

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute