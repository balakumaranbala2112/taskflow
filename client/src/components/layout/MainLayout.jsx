import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="flex min-h-[calc(100vh-4rem)]">
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                <main className="min-w-0 flex-1  p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout