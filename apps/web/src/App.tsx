import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HappyProvider } from "@ant-design/happy-work-theme";
import { ConfigProvider, App as AntdApp } from "antd";
import { StyleProvider } from "antd-style";
import { useTranslation } from "react-i18next";
import fr from "antd/locale/fr_FR";
import en from "antd/locale/en_US";
import { theme } from "./theme";
import { Root } from "./components/Root";
import { Index } from "./components/Index";

const queryClient = new QueryClient();

export function App() {
  const {
    i18n: { language },
  } = useTranslation();

  return (
    <QueryClientProvider client={queryClient}>
      <HappyProvider>
        <ConfigProvider theme={theme} locale={{ fr, en }[language]}>
          <AntdApp>
            <StyleProvider>
              <Root>
                <Index />
              </Root>
            </StyleProvider>
          </AntdApp>
        </ConfigProvider>
      </HappyProvider>
    </QueryClientProvider>
  );
}
