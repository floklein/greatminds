import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Flex, Layout, Typography } from "antd";

export const Route = createRootRoute({
  component: () => (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header>
        <Flex align="center" justify="center" style={{ height: "100%" }}>
          <Typography.Title style={{ margin: 0 }}>Wavelength</Typography.Title>
        </Flex>
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  ),
});
