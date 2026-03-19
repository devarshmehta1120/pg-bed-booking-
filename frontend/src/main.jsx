import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import { Toaster } from "react-hot-toast";
import GlobalLoader from "./components/common/GlobalLoader";
// import GlobalLoader from "./components/GlobalLoader"; // ✅ IMPORT

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* 🔥 GLOBAL COMPONENTS */}
      <GlobalLoader />
      <Toaster position="top-right" />

      {/* 🔥 ROUTER */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);