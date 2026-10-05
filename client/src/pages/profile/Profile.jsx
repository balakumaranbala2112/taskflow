import { useQuery } from "@tanstack/react-query";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  LogOut,
  CheckCircle2,
  Key,
} from "lucide-react";
import { getMe, logoutUser } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/ui/Button";

function Profile() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const storeUser = useAuthStore((state) => state.user);

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getMe,
    initialData: storeUser
      ? {
          name: storeUser.name,
          email: storeUser.email,
          id: storeUser.id || storeUser._id,
        }
      : undefined,
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuth();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      clearAuth();
      navigate("/login");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const user = profile || storeUser || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          User Profile
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your personal account settings and workspace access.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl shadow-md shadow-blue-500/20">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{user.name || "TaskFlow User"}</h2>
                <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-semibold border border-blue-100">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          <Button
            variant="dangerOutline"
            icon={LogOut}
            onClick={handleLogout}
            className="text-xs"
          >
            Sign Out
          </Button>
        </div>

        {/* Account Details Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3.5 rounded-2xl border border-gray-50 bg-slate-50/50 p-4">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Email Address
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {user.email || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-gray-50 bg-slate-50/50 p-4">
            <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Member Since
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Recently"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-gray-50 bg-slate-50/50 p-4">
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Authentication
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                JWT Bearer & Secure Cookies
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-gray-50 bg-slate-50/50 p-4">
            <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                User ID
              </p>
              <p className="mt-1 text-xs font-mono font-medium text-gray-700 truncate max-w-[200px]">
                {user.id || user._id || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
