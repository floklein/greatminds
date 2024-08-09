import { createFileRoute } from "@tanstack/react-router";
import { client } from "../colyseus";
import { MyRoom } from "@wavelength/api/src/rooms/MyRoom";

export const Route = createFileRoute("/$roomId")({
  component: Room,
  loader: async ({ params: { roomId } }) => client.joinById<MyRoom>(roomId),
  errorComponent: ({ error }) => <p>{error.message}</p>,
});

function Room() {
  const { roomId } = Route.useParams();
  const room = Route.useLoaderData();

  return (
    <>
      <h2>Room {roomId}</h2>
      <p>{JSON.stringify(room)}</p>
    </>
  );
}
