import { logoutUser } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

function Navbar() {
    const clearAuth = useAuthStore((state) => state.clearAuth);


    const handleLogout = async () => {
        try {
            await logoutUser();

            clearAuth();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
            <div>
                <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
                    TaskFlow
                </h1>
            </div>

            <div className="hidden text-sm text-gray-600 sm:block">
                Task Management
            </div>

            <button onClick={handleLogout}>
                Logout
            </button>
        </header>
    );
}

export default Navbar;