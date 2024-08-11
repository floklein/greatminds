import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { client } from "../colyseus";
import { WavelengthRoomState } from "@wavelength/api";
import { useLocalStorage } from "usehooks-ts";

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
    <div>
      <h2>
        Rooms <button onClick={() => createRoom()}>New room</button>{" "}
        {reconnectionToken && (
          <button onClick={() => reconnectRoom(reconnectionToken)}>
            Reconnect
          </button>
        )}
      </h2>
      <ul>
        {rooms?.map((room) => (
          <li key={room.roomId}>
            {room.name} {room.roomId} ({room.clients}/{room.maxClients}){" "}
            <button onClick={() => joinRoom(room.roomId)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
