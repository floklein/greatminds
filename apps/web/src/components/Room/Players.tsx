import { Badge, Flex, Layout, List, Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";

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
  const { styles } = useStyles();

  const players = useStore((state) => state.roomState!.players);
  const phase = useStore((state) => state.roomState!.phase);
  const maxPlayers = useStore((state) => state.roomState!.maxPlayers);

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
            Players
          </Typography.Title>
          <Typography.Text type="secondary">
            {sortedPlayers.length} / {maxPlayers}
          </Typography.Text>
        </Flex>
      </Layout.Header>
      <List
        dataSource={sortedPlayers}
        renderItem={(player) => (
          <List.Item
            actions={[
              phase === "lobby" ? (
                <Badge
                  status={player.ready ? "success" : "error"}
                  text={player.ready ? "Ready" : "Not ready"}
                />
              ) : (
                player.score
              ),
            ]}
          >
            {player.name.length ? player.name : player.sessionId}
          </List.Item>
        )}
      />
    </Layout>
  );
}
