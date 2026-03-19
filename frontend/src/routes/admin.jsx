import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarProvider } from "../components/ui/sidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/Sidebar";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) {
    throw redirect({
      to: "/login",
    });
  }

  // Logged in but not admin
  if (user.role !== "admin") {
    throw redirect({
      to: "/unauthorized",
    });
  }
}
});

function AdminLayout() {
  return (
    <SidebarProvider defaultOpen={true}>

      <div className="flex min-h-screen w-full">

        {/* Sidebar */}
        <AdminSidebar />

        {/* Main */}
        <div className="flex-1 flex flex-col">

          {/* Navbar */}
          <AdminNavbar />

          {/* Content */}
          <main className="p-6 flex-1 bg-gray-50">
            <Outlet />
          </main>

        </div>

      </div>

    </SidebarProvider>
  );
}