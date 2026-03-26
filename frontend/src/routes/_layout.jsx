import { Outlet, createFileRoute } from "@tanstack/react-router";
import Navbar from "../components/common/navbar";
import Footer from "../components/common/footers";

export const Route = createFileRoute("/_layout")({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer/>
    </>
  );
}