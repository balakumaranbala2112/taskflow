import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { logoutUser } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      clearAuth();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      clearAuth();
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 md:hidden"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        )}

        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm shadow-blue-500/20">
            <CheckSquare className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Task<span className="text-blue-600">Flow</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <Link
            to="/profile"
            className="flex items-center gap-2 rounded-lg p-1.5 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-gray-900 leading-tight">
                {user.name || "User"}
              </p>
              <p className="text-[11px] text-gray-500 truncate max-w-[140px]">
                {user.email || ""}
              </p>
            </div>
          </Link>
        )}

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="Sign out"
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;