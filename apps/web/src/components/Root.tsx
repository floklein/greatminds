import { Layout, Typography } from "antd";
import header from "/assets/header.svg";
import footer from "/assets/footer.svg";
import { createStyles } from "antd-style";
import { PropsWithChildren } from "react";

const useStyles = createStyles({
  layout: {
    minHeight: "100vh",
  },
  header: {
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
    letterSpacing: "0.2rem",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: "2rem 1rem",
    width: "100%",
    maxWidth: "80rem",
    marginInline: "auto",
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

export function Root({ children }: PropsWithChildren) {
  const { styles } = useStyles();

  return (
    <Layout className={styles.layout}>
      <Layout.Header className={styles.header}>
        <Typography.Title level={2} className={styles.title}>
          WAVELENGTH
        </Typography.Title>
      </Layout.Header>
      <Layout.Content className={styles.content}>{children}</Layout.Content>
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
