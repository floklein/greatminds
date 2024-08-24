import { Badge, Flex, Layout, List, Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";
import { useTranslation } from "react-i18next";

const useStyles = createStyles(({ token }) => ({
  layout: {
    background: "unset",
    paddingInline: token.padding,
  },
  headerFlex: {
    height: "100%",
  },
  title: {
    margin: "0 !important",
  },
}));

export function Players() {
  const { t } = useTranslation("room");
  const { styles } = useStyles();

  const players = useStore((state) => state.roomState!.players);
  const phase = useStore((state) => state.roomState!.phase);
  const maxPlayers = useStore((state) => state.roomState!.maxPlayers);
  const clientId = useStore((state) => state.room!.sessionId);

  const sortedPlayers = Object.values(players).sort(
    (a, b) => b.score - a.score,
  );

  return (
    <Layout className={styles.layout}>
      <Layout.Header>
        <Flex
          align="center"
          justify="space-between"
          className={styles.headerFlex}
        >
          <Typography.Title level={5} className={styles.title}>
            {t("title.players")}
          </Typography.Title>
          <Typography.Text type="secondary">
            {sortedPlayers.length} / {maxPlayers}
          </Typography.Text>
        </Flex>
      </Layout.Header>
      <List
        dataSource={sortedPlayers}
        renderItem={(player, index) => (
          <List.Item
            actions={[
              phase === "rounds" ? (
                player.score
              ) : (
                <Badge
                  status={player.ready ? "success" : "error"}
                  text={player.ready ? t("badge.ready") : t("badge.notReady")}
                />
              ),
            ]}
          >
            {player.name.length
              ? player.name
              : t("list.text.playerN", { index: index + 1 })}
            &nbsp;
            {player.sessionId === clientId && (
              <Typography.Text type="secondary">
                ({t("list.description.you")})
              </Typography.Text>
            )}
          </List.Item>
        )}
      />
    </Layout>
  );
}
