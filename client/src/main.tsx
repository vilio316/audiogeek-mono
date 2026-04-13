import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import DashboardPage from "./components/Dashboard.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import TopItemsPage from "./components/TopItemsPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

//Enables DevTools for Tanstack
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        Component: App,
      },
      {
        path: "/top",
        Component: TopItemsPage,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
