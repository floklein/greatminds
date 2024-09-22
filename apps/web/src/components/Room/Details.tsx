import { Flex, List, Space, Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";
import { useTranslation } from "react-i18next";
import { ROOM_MAX_CLIENTS } from "@greatminds/api";
import { PlayerItem } from "./Details/PlayerItem";
import { Settings } from "./Details/Settings";

const useStyles = createStyles(({ token }) => ({
  details: {
    width: "100%",
    paddingInline: token.padding,
    paddingBlock: token.paddingLG,
  },
  header: {
    paddingInline: 0,
  },
  headerFlex: {
    height: "100%",
  },
  settingsTitle: {
    marginBottom: `${token.paddingSM}px !important`,
  },
  playersTitle: {
    margin: "0 !important",
  },
}));

export function Details() {
  const { t } = useTranslation("room");
  const { styles } = useStyles();

  const players = useStore((state) => state.roomState!.players);

  const sortedPlayers = Object.values(players).sort(
    (a, b) => b.score - a.score,
  );

  return (
    <Space direction="vertical" size="large" className={styles.details}>
      <div>
        <Typography.Title level={5} className={styles.settingsTitle}>
          {t("title.settings")}
        </Typography.Title>
        <Settings />
      </div>
      <div>
        <Flex
          align="center"
          justify="space-between"
          className={styles.headerFlex}
        >
          <Typography.Title level={5} className={styles.playersTitle}>
            {t("title.players")}
          </Typography.Title>
          <Typography.Text type="secondary">
            {sortedPlayers.length} / {ROOM_MAX_CLIENTS}
          </Typography.Text>
        </Flex>
        <List
          dataSource={sortedPlayers}
          renderItem={(player, index) => (
            <PlayerItem player={player} index={index} />
          )}
        />
      </div>
    </Space>
  );
}
