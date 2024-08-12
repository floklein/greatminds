import { Badge, Layout, List } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";

const useStyles = createStyles({
  layout: {
    paddingInline: "1rem",
    backgroundColor: "unset",
  },
});

export function Players() {
  const { styles } = useStyles();

  const players = useStore((state) => state.roomState?.players) ?? {};

  return (
    <Layout className={styles.layout}>
      <Layout.Header>
        <h3>Players</h3>
      </Layout.Header>
      <Layout.Content>
        <List
          dataSource={Object.values(players)}
          renderItem={(player) => (
            <List.Item
              actions={[
                <Badge
                  status={player.ready ? "success" : "error"}
                  text={player.ready ? "Ready" : "Not ready"}
                />,
              ]}
            >
              {player.name.length ? player.name : player.sessionId}
            </List.Item>
          )}
        />
      </Layout.Content>
    </Layout>
  );
}
