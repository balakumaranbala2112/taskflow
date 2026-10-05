import { NavLink } from "react-router-dom";

function Sidebar() {
    const navigation = [
        {
            name: "Dashboard",
            path: "/dashboard",
        },
        {
            name: "Tasks",
            path: "/tasks",
        },
        {
            name: "Categories",
            path: "/categories",
        },
        {
            name: "Profile",
            path: "/profile",
        },
    ];

    return (
        <aside className="w-64 border-r border-gray-200 bg-white">
            <nav className="space-y-1 p-4">
                {navigation.map((item) => (
                    <NavLink to={item.path} key={item.path} className={({ isActive }) => `block rounded-lg px-4 py-2 text-sm font-medium transition ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>{item.name}</NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar;