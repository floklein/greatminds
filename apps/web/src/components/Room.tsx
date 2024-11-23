import { useStore } from "../zustand";
import { Lobby } from "./Room/Lobby";
import { Rounds } from "./Room/Rounds";
import { Scoreboard } from "./Room/Scoreboard";
import { useEffect, useState } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { Badge, Button, Drawer, Layout, message, Spin } from "antd";
import { Details } from "./Room/Details";
import { createStyles } from "antd-style";
import { Center } from "./UI/Center";
import { useTranslation } from "react-i18next";
import { Message, Messages } from "@greatminds/api";
import { MenuOutlined } from "@ant-design/icons";

const useStyles = createStyles(({ token }) => ({
  header: {
    height: "unset",
    lineHeight: "unset",
    paddingInline: 0,
    marginBlockStart: "-2rem",
    marginBlockEnd: "2rem",
    textAlign: "right",
  },
  sider: {
    marginInlineStart: "1rem",
    paddingInline: token.paddingMD,
    paddingBlock: token.paddingLG,
    borderRadius: token.borderRadiusLG,
    backgroundColor: `${token.colorBgElevated} !important`,
  },
}));

export function Room() {
  const { t } = useTranslation(["room", "errors"]);
  const { styles } = useStyles();
  const [messageApi, contextHolder] = message.useMessage();

  const room = useStore((state) => state.room!);
  const setRoom = useStore((state) => state.setRoom);
  const phase = useStore((state) => state.roomState?.phase);
  const hasRoomState = useStore((state) => state.roomState !== null);
  const setRoomState = useStore((state) => state.setRoomState);
  const playersLength = useStore(
    (state) => Object.keys(state.roomState?.players ?? {}).length,
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [, setReconnectionToken] = useLocalStorage<string | null>(
    "reconnectionToken",
    null,
  );

  const isMobile = useMediaQuery("(max-width: 800px)");

  useEffect(() => {
    room.onStateChange((state) => setRoomState(state.toJSON()));
    room.onMessage<Message[Messages.SendError]>(Messages.SendError, (error) =>
      messageApi.error(t(`errors:${error}`)),
    );
    room.onLeave(() => {
      setReconnectionToken(null);
      setRoom(null);
      setRoomState(null);
    });
    return () => {
      room.removeAllListeners();
    };
  }, [messageApi, room, setReconnectionToken, setRoom, setRoomState, t]);

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  function openDrawer() {
    setIsDrawerOpen(true);
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
      {contextHolder}
      <Layout>
        {isMobile && (
          <Layout.Header className={styles.header}>
            <Badge count={playersLength} color="volcano">
              <Button
                variant="filled"
                color="primary"
                size="large"
                icon={<MenuOutlined />}
                onClick={openDrawer}
              />
            </Badge>
          </Layout.Header>
        )}

        <Layout.Content>
          {phase === "lobby" && <Lobby />}
          {phase === "rounds" && <Rounds />}
          {phase === "scoreboard" && <Scoreboard />}
        </Layout.Content>
      </Layout>
      {isMobile ? (
        <Drawer open={isDrawerOpen} onClose={closeDrawer}>
          <Details />
        </Drawer>
      ) : (
        <Layout.Sider width={300} className={styles.sider}>
          <Details />
        </Layout.Sider>
      )}
    </Layout>
  );
}
