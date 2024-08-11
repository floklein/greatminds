import { useMutation } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { Lobby } from "../Room/Lobby";
import { Rounds } from "../Room/Rounds";
import { Scoreboard } from "../Room/Scoreboard";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export function Room() {
  const room = useStore((state) => state.room!);
  const setRoom = useStore((state) => state.setRoom);
  const phase = useStore((state) => state.roomState?.phase);
  const setRoomState = useStore((state) => state.setRoomState);

  const [, setReconnectionToken] = useLocalStorage<string | null>(
    "reconnectionToken",
    null,
  );

  const { mutate: leaveRoom } = useMutation({
    mutationFn: () => room!.leave(),
    onSuccess: () => {
      setReconnectionToken(null);
      setRoom(null);
    },
  });

  useEffect(() => {
    room.onStateChange((state) => setRoomState(state.toJSON()));
  }, [room, setRoomState]);

  return (
    <div>
      <h2>
        Room: {room.roomId} <button onClick={() => leaveRoom()}>Leave</button>
      </h2>
      {phase === "lobby" && <Lobby />}
      {phase === "rounds" && <Rounds />}
      {phase === "scoreboard" && <Scoreboard />}
    </div>
  );
}
