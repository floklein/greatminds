import { useStore } from "../zustand";
import { Lobby } from "./Room/Lobby";
import { Rounds } from "./Room/Rounds";
import { Scoreboard } from "./Room/Scoreboard";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Layout, message, Spin } from "antd";
import { Details } from "./Room/Details";
import { createStyles } from "antd-style";
import { Center } from "./UI/Center";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Message, Messages } from "@greatminds/api";
import { useReconnectionToken } from "../hooks";

const useStyles = createStyles(({ token }) => ({
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
  details: {
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

  const [, setReconnectionToken] = useReconnectionToken();

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
        <Layout.Content>
          {phase === "lobby" && <Lobby />}
          {phase === "rounds" && <Rounds />}
          {phase === "scoreboard" && <Scoreboard />}
        </Layout.Content>
      </Layout>
      {isMobile ? (
        <Layout.Footer className={clsx(styles.footer, styles.details)}>
          <Details />
        </Layout.Footer>
      ) : (
        <Layout.Sider
          width={300}
          className={clsx(styles.sider, styles.details)}
        >
          <Details />
        </Layout.Sider>
      )}
    </Layout>
  );
}
