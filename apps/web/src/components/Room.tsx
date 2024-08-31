import { useMutation } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { Lobby } from "./Room/Lobby";
import { Rounds } from "./Room/Rounds";
import { Scoreboard } from "./Room/Scoreboard";
import { useEffect, useState } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import {
  Button,
  Flex,
  Input,
  Layout,
  Popconfirm,
  Space,
  Spin,
  Tooltip,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { Players } from "./Room/Players";
import { createStyles } from "antd-style";
import { Center } from "./UI/Center";
import colorAlpha from "color-alpha";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const useStyles = createStyles(({ token }) => ({
  header: {
    marginBlockEnd: "2rem",
  },
  headerFlex: {
    height: "100%",
  },
  footer: {
    padding: 0,
    marginBlockStart: "2rem",
  },
  sider: {
    marginInlineStart: "1rem",
  },
  players: {
    borderRadius: token.borderRadiusLG,
    backgroundColor: `${colorAlpha("#000312", 0.5)} !important`,
  },
  password: {
    width: "210px",
  },
}));

export function Room() {
  const { t } = useTranslation("room");
  const { styles } = useStyles();

  const room = useStore((state) => state.room!);
  const setRoom = useStore((state) => state.setRoom);
  const phase = useStore((state) => state.roomState?.phase);
  const hasRoomState = useStore((state) => state.roomState !== null);
  const setRoomState = useStore((state) => state.setRoomState);

  const [, setReconnectionToken] = useLocalStorage<string | null>(
    "reconnectionToken",
    null,
  );

  const [copied, setCopied] = useState(false);

  const isMobile = useMediaQuery("(max-width: 800px)");

  const { mutate: leaveRoom } = useMutation({
    mutationFn: () => room!.leave(),
    onSuccess: () => {
      setReconnectionToken(null);
      setRoom(null);
      setRoomState(null);
    },
  });

  useEffect(() => {
    room.onStateChange((state) => setRoomState(state.toJSON()));
    room.onLeave(() => {
      setReconnectionToken(null);
      setRoom(null);
      setRoomState(null);
    });
  }, [room, setReconnectionToken, setRoom, setRoomState]);

  function copyRoomId() {
    navigator.clipboard.writeText(room.roomId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (!hasRoomState) {
    return (
      <Center>
        <Spin size="large" />
      </Center>
    );
  }
  return (
    <Layout>
      <Layout>
        <Layout.Header className={styles.header}>
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
                className={styles.password}
              />
              {phase === "lobby" && (
                <Tooltip
                  title={copied ? t("tooltip.copied") : t("tooltip.copy")}
                >
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
        </Layout.Header>
        <Layout.Content>
          {phase === "lobby" && <Lobby />}
          {phase === "rounds" && <Rounds />}
          {phase === "scoreboard" && <Scoreboard />}
        </Layout.Content>
      </Layout>
      {isMobile ? (
        <Layout.Footer className={clsx(styles.footer, styles.players)}>
          <Players />
        </Layout.Footer>
      ) : (
        <Layout.Sider
          width={300}
          className={clsx(styles.sider, styles.players)}
        >
          <Players />
        </Layout.Sider>
      )}
    </Layout>
  );
}
