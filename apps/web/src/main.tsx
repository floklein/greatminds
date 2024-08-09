import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./reset.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { TanStackRouterDevtools } from "./components/TanStackRouterDevTools.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
);
