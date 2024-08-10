import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "../zustand";
import { Room } from "../components/Room";
import { Home } from "../components/Home";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const room = useStore((state) => state.room);

  if (room === null) {
    return <Home />;
  }
  return <Room />;
}
