import { Layout, Typography } from "antd";
import header from "/assets/images/header.svg";
import { createStyles } from "antd-style";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

const useStyles = createStyles(({ token }) => ({
  layout: {
    minHeight: "100vh",
  },
  header: {
    backgroundImage: `url("${header}")`,
    backgroundSize: "auto 100px",
    backgroundRepeat: "repeat-x",
    "@media (max-width: 800px)": {
      paddingInline: token.padding,
    },
  },
  title: {
    color: `${token.volcano} !important`,
    margin: "16px 0 0 0 !important",
  },
  subtitle: {
    color: `${token.colorTextSecondary} !important`,
    fontSize: token.fontSizeHeading5,
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
    background: `linear-gradient(to bottom, transparent, ${token.colorBgElevated})`,
  },
  footerTypography: {
    textAlign: "center",
  },
}));

export function Root({ children }: PropsWithChildren) {
  const { t } = useTranslation("root");
  const { styles } = useStyles();

  return (
    <Layout className={styles.layout}>
      <Layout.Header className={styles.header}>
        <div>
          <Typography.Title level={2} className={styles.title}>
            great minds <span className={styles.subtitle}>think alike</span>
          </Typography.Title>
        </div>
      </Layout.Header>
      <Layout.Content className={styles.content}>{children}</Layout.Content>
      <Layout.Footer className={styles.footer}>
        <Typography className={styles.footerTypography}>
          {t("typography.madeWithLoveBy")}{" "}
          <Typography.Link
            href="https://github.com/floklein"
            target="_blank"
            rel="noopener noreferrer"
          >
            Florent
          </Typography.Link>
        </Typography>
      </Layout.Footer>
    </Layout>
  );
}
