import { useMutation } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { useEffect, useState } from "react";
import { RoomPhase } from "@wavelength/api";

export function Room() {
  const room = useStore((state) => state.room!);
  const setRoom = useStore((state) => state.setRoom);

  const [phase, setPhase] = useState<RoomPhase>("lobby");

  const { mutate: leaveRoom } = useMutation({
    mutationFn: () => room!.leave(),
    onSuccess: () => setRoom(null),
  });

  useEffect(() => {
    room.onMessage("type", (message) => {
      console.log("type", message);
    });
    room.state.listen("phase", (newPhase) => {
      setPhase(newPhase);
    });
    return () => {
      room.removeAllListeners();
    };
  }, [room]);

  return (
    <>
      <h2>Room: {room.roomId}</h2>
      <button onClick={() => leaveRoom()}>Leave</button>
      <p>Phase: {phase}</p>
    </>
  );
}
