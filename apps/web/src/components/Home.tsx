import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { client } from "../colyseus";
import { WavelengthRoomState } from "@wavelength/api";

export function Home() {
  const setRoom = useStore((state) => state.setRoom);

  const { data: rooms } = useQuery({
    queryFn: () => client.getAvailableRooms<WavelengthRoomState>(),
    queryKey: ["rooms"],
    refetchInterval: 1000,
  });

  const { mutate: createRoom } = useMutation({
    mutationFn: () => client.create<WavelengthRoomState>("wavelength"),
    onSuccess: (newRoom) => setRoom(newRoom),
  });

  const { mutate: joinRoom } = useMutation({
    mutationFn: (roomId: string) =>
      client.joinById<WavelengthRoomState>(roomId),
    onSuccess: (newRoom) => setRoom(newRoom),
  });

  return (
    <>
      <button onClick={() => createRoom()}>New room</button>
      {rooms?.map((room) => (
        <div key={room.roomId}>
          <p>
            {room.name} {room.roomId} ({room.clients}/{room.maxClients}){" "}
            <button onClick={() => joinRoom(room.roomId)}>Join</button>
          </p>
        </div>
      ))}
    </>
  );
}
