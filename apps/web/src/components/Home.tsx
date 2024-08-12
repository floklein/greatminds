import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { client } from "../colyseus";
import { WavelengthRoomState } from "@wavelength/api";
import { useLocalStorage } from "usehooks-ts";
import { Button, Divider, Flex, List, Space } from "antd";
import { Center } from "./UI/Center";
import { createStyles } from "antd-style";

const useStyles = createStyles({
  space: {
    width: "100%",
  },
  flexItem: {
    width: "100%",
    maxWidth: "40rem",
  },
});

export function Home() {
  const { styles } = useStyles();

  const setRoom = useStore((state) => state.setRoom);

  const [reconnectionToken, setReconnectionToken] = useLocalStorage<
    string | null
  >("reconnectionToken", null);

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

  return (
    <Center itemClassName={styles.flexItem}>
      <Space direction="vertical" size="large" className={styles.space}>
        <Flex gap="small" justify="center">
          <Button type="primary" size="large" onClick={() => createRoom()}>
            Create a new party
          </Button>
          {reconnectionToken && (
            <Button
              size="large"
              onClick={() => reconnectRoom(reconnectionToken)}
            >
              Reconnect
            </Button>
          )}
        </Flex>
        <Divider>or</Divider>
        <List
          header="Join an available room"
          bordered
          dataSource={rooms}
          pagination={{ pageSize: 5 }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button onClick={() => joinRoom(item.roomId)}>Join</Button>,
              ]}
            >
              <List.Item.Meta
                title={item.roomId}
                description={`${item.clients} / ${item.maxClients}`}
              />
            </List.Item>
          )}
        />
      </Space>
    </Center>
  );
}
