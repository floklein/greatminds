import {
  Button,
  Flex,
  Input,
  List,
  Popconfirm,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";
import { useTranslation } from "react-i18next";
import { ROOM_MAX_CLIENTS } from "@greatminds/api";
import { PlayerItem } from "./Details/PlayerItem";
import { Settings } from "./Details/Settings";
import { CopyOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { useReconnectionToken } from "../../hooks";
import { useState } from "react";

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

  const room = useStore((state) => state.room!);
  const setRoom = useStore((state) => state.setRoom);
  const phase = useStore((state) => state.roomState?.phase);
  const setRoomState = useStore((state) => state.setRoomState);
  const players = useStore((state) => state.roomState!.players);

  const [, setReconnectionToken] = useReconnectionToken();

  const [copied, setCopied] = useState(false);

  const sortedPlayers = Object.values(players).sort(
    (a, b) => b.score - a.score,
  );

  const { mutate: leaveRoom } = useMutation({
    mutationFn: () => room!.leave(),
    onSuccess: () => {
      setReconnectionToken(null);
      setRoom(null);
      setRoomState(null);
    },
  });

  function copyRoomId() {
    navigator.clipboard.writeText(room.roomId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Space direction="vertical" size="large" className={styles.details}>
      <div>
        <Typography.Title level={5} className={styles.settingsTitle}>
          {t("title.settings")}
        </Typography.Title>
        <Flex
          gap="small"
          align="center"
          justify="center"
          className={styles.headerFlex}
        >
          <Space.Compact>
            <Input.Password
              addonBefore={t("form.label.gameId")}
              value={room.roomId}
              autoComplete="off"
              readOnly
            />
            {phase === "lobby" && (
              <Tooltip title={copied ? t("tooltip.copied") : t("tooltip.copy")}>
                <Button icon={<CopyOutlined />} onClick={copyRoomId} />
              </Tooltip>
            )}
          </Space.Compact>
          <Popconfirm
            title={t("pop.title.leave")}
            description={t("pop.description.leave")}
            onConfirm={() => leaveRoom()}
            okText={t("pop.ok.leave")}
            cancelText={t("pop.cancel.leave")}
            icon={null}
          >
            <Button type="text" danger>
              {t("button.leaveGame")}
            </Button>
          </Popconfirm>
        </Flex>
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
