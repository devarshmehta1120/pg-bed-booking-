import { Outlet } from "@tanstack/react-router";
import AdminSidebar from "./Sidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">

      <AdminSidebar />

      <div className="flex-1">

        <AdminNavbar />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  )
}