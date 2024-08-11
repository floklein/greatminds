import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { client } from "../colyseus";
import { WavelengthRoomState } from "@wavelength/api";
import { useLocalStorage } from "usehooks-ts";
import { Button, Divider, Flex, List, Space } from "antd";

export function Home() {
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
      console.log(newRoom.reconnectionToken);
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
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Flex gap="small" justify="center">
        <Button type="primary" size="large" onClick={() => createRoom()}>
          Create a new party
        </Button>
        {reconnectionToken && (
          <Button size="large" onClick={() => reconnectRoom(reconnectionToken)}>
            Reconnect
          </Button>
        )}
      </Flex>
      <Divider>or</Divider>
      <List
        header="Join an available room"
        bordered
        dataSource={rooms}
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
  );
}
