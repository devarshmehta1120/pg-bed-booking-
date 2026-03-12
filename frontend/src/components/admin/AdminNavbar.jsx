import { logoutUser } from "../../api/authApi";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "../ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback
} from "../ui/avatar";

export default function AdminNavbar() {

  const navigate = useNavigate();

  const logout = () => {
    logoutUser();
    navigate({ to: "/login" });
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="border-b bg-white px-6 py-4 flex items-center justify-between">

      {/* Left Section */}
      <div className="flex items-center gap-4">

        {/* Sidebar Toggle */}
        <SidebarTrigger />

        <h1 className="text-xl font-semibold">
          Admin Dashboard
        </h1>

      </div>

      {/* Right Section */}
      <DropdownMenu>

        <DropdownMenuTrigger asChild>

          <Button variant="ghost" className="flex items-center gap-2">

            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>

            {user?.name || "Admin"}

          </Button>

        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">

          <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={logout}>
            Logout
          </DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>

    </div>
  );
}