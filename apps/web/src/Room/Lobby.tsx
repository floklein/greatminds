import { ChangeEvent } from "react";
import { useStore } from "../zustand";
import { Message, Messages } from "@wavelength/api";

export function Lobby() {
  const room = useStore((state) => state.room!);
  const players = useStore((state) => state.roomState!.players);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    room.send<Message[Messages.SetPlayerName]>(
      Messages.SetPlayerName,
      event.target.value,
    );
  }

  function handleReadyChange(event: ChangeEvent<HTMLInputElement>) {
    room.send<Message[Messages.SetPlayerReady]>(
      Messages.SetPlayerReady,
      event.target.checked,
    );
  }

  return (
    <div>
      <h3>Lobby</h3>
      <form>
        <label htmlFor="name">Your name</label>
        <input id="name" type="text" onChange={handleNameChange} />
        <label htmlFor="ready">Ready?</label>
        <input id="ready" type="checkbox" onChange={handleReadyChange} />
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
