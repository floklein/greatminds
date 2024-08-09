import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { client } from "../colyseus";
import { MyRoomState } from "@wavelength/api";
import { useStore } from "../zustand";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const room = useStore((state) => state.room);
  const setRoom = useStore((state) => state.setRoom);

  const { data: rooms } = useQuery({
    queryFn: () => client.getAvailableRooms<MyRoomState>(),
    queryKey: ["rooms"],
    refetchInterval: 1000,
  });

  const { mutate: createRoom } = useMutation({
    mutationFn: () => client.create<MyRoomState>("my_room"),
    onSuccess: (newRoom) => setRoom(newRoom),
  });

  const { mutate: joinRoom } = useMutation({
    mutationFn: (roomId: string) => client.joinById<MyRoomState>(roomId),
    onSuccess: (newRoom) => setRoom(newRoom),
  });

  const { mutate: leaveRoom } = useMutation({
    mutationFn: () => room!.leave(),
    onSuccess: () => setRoom(null),
  });

  useEffect(() => {
    if (!room) {
      return;
    }
    room.onMessage("type", (message) => {
      console.log("type", message);
    });
    return () => {
      room.removeAllListeners();
    };
  }, [room]);

  if (room === null) {
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
  return (
    <>
      <h2>Room: {room.roomId}</h2>
      <button onClick={() => leaveRoom()}>Leave</button>
    </>
  );
}
