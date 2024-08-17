import { useMutation } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { Lobby } from "./Room/Lobby";
import { Rounds } from "./Room/Rounds";
import { Scoreboard } from "./Room/Scoreboard";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
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

const useStyles = createStyles(({ token }) => ({
  headerFlex: {
    height: "100%",
  },
  sider: {
    borderRadius: token.borderRadiusLG,
    marginInlineStart: "1rem",
  },
}));

export function Room() {
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

  const { mutate: leaveRoom } = useMutation({
    mutationFn: () => room!.leave(),
    onSuccess: () => {
      setReconnectionToken(null);
      setRoom(null);
    },
  });

  useEffect(() => {
    room.onStateChange((state) => setRoomState(state.toJSON()));
  }, [room, setRoomState]);

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
        <Layout.Header>
          <Flex
            gap="small"
            align="center"
            justify="center"
            className={styles.headerFlex}
          >
            <Space.Compact>
              <Input.Password
                addonBefore="Game ID"
                value={room.roomId}
                autoComplete="off"
                readOnly
              />
              {phase === "lobby" && (
                <Tooltip title={copied ? "Copied!" : "Copy"}>
                  <Button icon={<CopyOutlined />} onClick={copyRoomId} />
                </Tooltip>
              )}
            </Space.Compact>
            <Popconfirm
              title="Are you sure?"
              description="You will lose all progress in this game."
              onConfirm={() => leaveRoom()}
              okText="Yes!"
              cancelText="No, I'll stay"
              icon={null}
            >
              <Button type="text" danger>
                Leave
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
      <Layout.Sider width={300} className={styles.sider}>
        <Players />
      </Layout.Sider>
    </Layout>
  );
}
