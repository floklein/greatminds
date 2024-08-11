import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Flex, Layout, Typography } from "antd";

import header from "../../public/assets/header.svg";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        style={{
          backgroundImage: `url("${header}")`,
          backgroundRepeat: "repeat-x",
          backgroundPositionX: "center",
        }}
      >
        <Flex align="center" justify="center" style={{ height: "100%" }}>
          <Typography.Title
            style={{
              margin: 0,
              letterSpacing: 5,
            }}
          >
            WAVELENGTH
          </Typography.Title>
        </Flex>
      </Layout.Header>
      <Layout.Content style={{ display: "flex", padding: "48px 24px" }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
}
