import { useEffect, useState } from "react";
import { useStore } from "../zustand";
import { Player } from "@wavelength/api";

export function Lobby() {
  const room = useStore((state) => state.room!);

  const [players, setPlayers] = useState<Record<string, Player>>({});

  useEffect(() => {
    const disposers = [
      room.state.players.onAdd((player, sessionId) => {
        setPlayers((oldPlayers) => ({ ...oldPlayers, [sessionId]: player }));
      }),
      room.state.players.onRemove((_, sessionId) => {
        setPlayers(
          ({ [sessionId]: removedPlayer, ...oldPlayers }) => oldPlayers,
        );
      }),
    ];
    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, [room]);

  return (
    <div>
      <h3>Lobby</h3>
      <form>
        <input type="text" placeholder="Your name" />
      </form>
      <ul>
        {Object.values(players).map((player) => (
          <li key={player.sessionId}>
            [{player.sessionId}] {player.name} {player.ready ? "✔️" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}
