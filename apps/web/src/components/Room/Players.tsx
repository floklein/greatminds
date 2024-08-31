import { Flex, Layout, List, Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";
import { useTranslation } from "react-i18next";
import { ROOM_MAX_CLIENTS } from "@greatminds/api";
import { PlayerItem } from "../Players/PlayerItem";

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
            {sortedPlayers.length} / {ROOM_MAX_CLIENTS}
          </Typography.Text>
        </Flex>
      </Layout.Header>
      <List
        dataSource={sortedPlayers}
        renderItem={(player, index) => (
          <PlayerItem player={player} index={index} />
        )}
      />
    </Layout>
  );
}
