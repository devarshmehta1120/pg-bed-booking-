import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "../components/common/navbar";
import ErrorPage from "../components/common/ErrorPage";
import NotFound from "../components/common/NotFound";
import { ToastContainer } from "react-toastify";

const RootLayout = () => (
  <>
    <Outlet />
          {/* ✅ Toast container (global) */}
      <ToastContainer position="top-right" autoClose={3000} />

  </>
);

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: ErrorPage,
  notFoundComponent:NotFound,
});