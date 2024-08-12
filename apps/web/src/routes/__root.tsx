import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Layout, Typography } from "antd";

import header from "../../public/assets/header.svg";
import footer from "../../public/assets/footer.svg";
import { createStyles } from "antd-style";

export const Route = createRootRoute({
  component: Root,
});

const useStyles = createStyles({
  layout: {
    minHeight: "100vh",
  },
  header: {
    height: 80,
    paddingInline: 0,
    position: "relative",
    backgroundImage: `url("${header}")`,
    backgroundPositionX: "center",
    backgroundPositionY: "bottom",
    backgroundSize: "cover",
  },
  title: {
    textAlign: "center",
    marginBlockStart: "0.75rem",
    letterSpacing: 3,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: "4rem 1rem",
  },
  footer: {
    backgroundImage: `url("${footer}")`,
    backgroundSize: "cover",
    backgroundPositionX: "center",
  },
  footerTypography: {
    textAlign: "center",
  },
});

function Root() {
  const { styles } = useStyles();

  return (
    <Layout className={styles.layout}>
      <Layout.Header className={styles.header}>
        <Typography.Title className={styles.title}>WAVELENGTH</Typography.Title>
      </Layout.Header>
      <Layout.Content className={styles.content}>
        <Outlet />
      </Layout.Content>
      <Layout.Footer className={styles.footer}>
        <Typography className={styles.footerTypography}>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/floklein"
            target="_blank"
            rel="noopener noreferrer"
          >
            Florent
          </a>
        </Typography>
      </Layout.Footer>
    </Layout>
  );
}
