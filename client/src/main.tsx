import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import DashboardPage from "./components/Dashboard.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import TopItemsPage from "./components/TopItemsPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import SongDetails from "./components/SongDetails.tsx";
import AlbumDetails from "./components/AlbumDetails.tsx";
import ArtistInformation from "./components/ArtistInformation.tsx";
import AppLayout from "./AppLayout.tsx";
import SearchPage from "./components/SearchPage.tsx";

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
    Component: App,
    index: true,
  },
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        path: "/top",
        Component: TopItemsPage,
      },
      {
        path: "/dashboard",
        Component: DashboardPage,
      },
      {
        path: `/song/:id`,
        Component: SongDetails,
      },
      {
        path: `/albums/:id`,
        Component: AlbumDetails,
      },
      {
        path: `/artists/:id`,
        Component: ArtistInformation,
      },
      {
        path: "search",
        Component: SearchPage,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
