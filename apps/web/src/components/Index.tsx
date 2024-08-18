import { useStore } from "../zustand";
import { Room } from "./Room";
import { Home } from "./Home";

export function Index() {
  const room = useStore((state) => state.room);

  if (room === null) {
    return <Home />;
  }
  return <Room />;
}
