import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { client } from "../colyseus";
import { MyRoom } from "@wavelength/api/src/rooms/MyRoom";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const queryClient = useQueryClient();

  const { data: rooms } = useQuery({
    queryFn: () => client.getAvailableRooms<MyRoom>(),
    queryKey: ["rooms"],
  });

  const { mutate: createRoom } = useMutation({
    mutationFn: () => client.create<MyRoom>("my_room"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });

  return (
    <>
      <button onClick={() => createRoom()}>New room</button>
      {rooms?.map((room) => (
        <div key={room.roomId}>
          <p>
            {room.name} {room.roomId} ({room.clients}/{room.maxClients}){" "}
            <Link to="/$roomId" params={{ roomId: room.roomId }}>
              Go
            </Link>
          </p>
        </div>
      ))}
    </>
  );
}
