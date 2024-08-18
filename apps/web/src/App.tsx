import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, App as AntdApp } from "antd";
import { theme } from "./theme";
import { StyleProvider } from "antd-style";
import { Root } from "./components/Root";
import { Index } from "./components/Index";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <AntdApp>
          <StyleProvider>
            <Root>
              <Index />
            </Root>
          </StyleProvider>
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
