import { useMutation } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { useEffect, useState } from "react";
import { RoomPhase } from "@wavelength/api";
import { Lobby } from "./Lobby";
import { Rounds } from "./Rounds";
import { Scoreboard } from "./Scoreboard";

export function Room() {
  const room = useStore((state) => state.room!);
  const setRoom = useStore((state) => state.setRoom);

  const [phase, setPhase] = useState<RoomPhase>("lobby");

  const { mutate: leaveRoom } = useMutation({
    mutationFn: () => room!.leave(),
    onSuccess: () => setRoom(null),
  });

  useEffect(() => {
    const disposers = [
      room.state.listen("phase", (newPhase) => {
        setPhase(newPhase);
      }),
    ];
    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [room]);

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
