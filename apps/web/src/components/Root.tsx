import { Divider, Flex, Layout, Typography } from "antd";
import header from "/assets/images/header.svg";
import { createStyles } from "antd-style";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { GithubOutlined, LinkedinFilled } from "@ant-design/icons";

const useStyles = createStyles(({ token }) => ({
  layout: {
    minHeight: "100dvh",
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
  github: {
    fontSize: "1.5em",
  },
  linkedin: {
    fontSize: "1.55em",
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
            great minds <span className={styles.subtitle}>(think alike)</span>
          </Typography.Title>
        </div>
      </Layout.Header>
      <Layout.Content className={styles.content}>{children}</Layout.Content>
      <Layout.Footer className={styles.footer}>
        <Flex justify="center" align="center" gap="small">
          <Typography>
            {t("typography.madeWithLoveBy")}{" "}
            <Typography.Link
              href="https://github.com/floklein"
              target="_blank"
              rel="noopener noreferrer"
            >
              Florent Klein
            </Typography.Link>
          </Typography>
          <Divider type="vertical" style={{ top: 0, height: "1.5em" }} />
          <Flex align="center" gap="middle">
            <Typography.Link
              href="https://github.com/floklein"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.github}
            >
              <GithubOutlined />
            </Typography.Link>
            <Typography.Link
              href="https://www.linkedin.com/in/florentklein"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkedin}
            >
              <LinkedinFilled />
            </Typography.Link>
          </Flex>
        </Flex>
      </Layout.Footer>
    </Layout>
  );
}
