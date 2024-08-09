import { client } from "./colyseus";
import { MyRoom } from "@wavelength/api/src/rooms/MyRoom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = useQueryClient();

  const { data: rooms } = useQuery({
    queryFn: () => client.getAvailableRooms<MyRoom>(),
    queryKey: ["rooms"],
  });

  const joinOrCreateRoom = useMutation({
    mutationFn: () => client.joinOrCreate<MyRoom>("my_room"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["rooms"] }),
  });

  return (
    <>
      <button onClick={() => joinOrCreateRoom.mutate()}>New room</button>
      {JSON.stringify(rooms)}
    </>
  );
}

export default App;
