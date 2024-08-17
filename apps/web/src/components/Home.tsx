import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { client } from "../colyseus";
import { WavelengthRoomState } from "@wavelength/api";
import { Button, Card, Divider, Flex, Form, Input, List, Space } from "antd";
import { Center } from "./UI/Center";
import { createStyles } from "antd-style";
import { PlusOutlined, UndoOutlined } from "@ant-design/icons";
import { useReconnectionToken } from "../hooks";

type FieldType = {
  roomId?: string;
};

const useStyles = createStyles(({ token }) => ({
  space: {
    width: "100%",
  },
  flexItem: {
    width: "100%",
    maxWidth: "30rem",
  },
  createButton: {
    backgroundColor: token.green5,
    "&:hover": {
      backgroundColor: `${token.green6} !important`,
    },
    "&:active": {
      backgroundColor: `${token.green4} !important`,
    },
  },
}));

export function Home() {
  const { styles } = useStyles();

  const setRoom = useStore((state) => state.setRoom);

  const [reconnectionToken, setReconnectionToken] = useReconnectionToken();

  const { data: rooms } = useQuery({
    queryFn: () => client.getAvailableRooms<WavelengthRoomState>(),
    queryKey: ["rooms"],
    refetchInterval: 1000,
  });

  const { mutate: createRoom } = useMutation({
    mutationFn: () => client.create<WavelengthRoomState>("wavelength"),
    onSuccess: (newRoom) => {
      setReconnectionToken(newRoom.reconnectionToken);
      setRoom(newRoom);
    },
  });

  const { mutate: joinRoom } = useMutation({
    mutationFn: (roomId: string) =>
      client.joinById<WavelengthRoomState>(roomId),
    onSuccess: (newRoom) => {
      setReconnectionToken(newRoom.reconnectionToken);
      setRoom(newRoom);
    },
  });

  const { mutate: reconnectRoom } = useMutation({
    mutationFn: (reconnectionToken: string) =>
      client.reconnect<WavelengthRoomState>(reconnectionToken),
    onSuccess: (newRoom) => {
      setReconnectionToken(newRoom.reconnectionToken);
      setRoom(newRoom);
    },
    onError: () => {
      setReconnectionToken(null);
    },
  });

  function handleJoinSubmit(values: FieldType) {
    if (!values.roomId) return;
    joinRoom(values.roomId);
  }

  return (
    <Center itemClassName={styles.flexItem}>
      <Space direction="vertical" size="large" className={styles.space}>
        <Flex vertical gap="middle" align="center" justify="center">
          <Button
            type="primary"
            size="large"
            onClick={() => createRoom()}
            icon={<PlusOutlined />}
            className={styles.createButton}
          >
            Start a new game
          </Button>
          {reconnectionToken && (
            <Button
              type="text"
              onClick={() => reconnectRoom(reconnectionToken)}
              icon={<UndoOutlined />}
            >
              Reconnect to the game you just left
            </Button>
          )}
        </Flex>
        <Divider>or</Divider>
        <Card title="Join your friends' game" size="small" bordered={false}>
          <Form<FieldType>
            layout="inline"
            autoComplete="off"
            onFinish={handleJoinSubmit}
          >
            <Form.Item<FieldType>
              name="roomId"
              rules={[{ required: true, message: "Please type a game ID" }]}
              required={false}
            >
              <Input.Password placeholder="Game ID" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Join
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Divider>or</Divider>
        <Card title="Join an open game" size="small" bordered={false}>
          <List
            dataSource={rooms}
            pagination={{ pageSize: 5 }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="primary" onClick={() => joinRoom(item.roomId)}>
                    Join
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.roomId}
                  description={`${item.clients} / ${item.maxClients} players`}
                />
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </Center>
  );
}
