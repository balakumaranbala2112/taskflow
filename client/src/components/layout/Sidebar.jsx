import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle2,
  FolderKanban,
  User,
} from "lucide-react";

function Sidebar({ onItemClick }) {
  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckCircle2,
    },
    {
      name: "Categories",
      path: "/categories",
      icon: FolderKanban,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="h-full w-64 border-r border-gray-200 bg-white flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Navigation
        </div>
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                to={item.path}
                key={item.path}
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-4">
        <h4 className="text-xs font-bold text-blue-900">TaskFlow Pro</h4>
        <p className="mt-1 text-xs text-blue-700/80">
          Organize your tasks, stay on schedule, and boost your productivity.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;