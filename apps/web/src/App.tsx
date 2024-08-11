import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfigProvider, App as AntdApp } from "antd";
import { theme } from "./theme";
import { StyleProvider } from "antd-style";

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <AntdApp>
          <StyleProvider>
            <RouterProvider router={router} />
          </StyleProvider>
        </AntdApp>
      </ConfigProvider>
      <TanStackRouterDevtools router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
