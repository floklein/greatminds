import { ChangeEvent, FormEvent, useState } from "react";
import { useStore } from "../../../zustand";
import { Message, Messages } from "@wavelength/api";

export function Guessing() {
  const room = useStore((state) => state.room!);
  const isGuesser = useStore(
    (state) =>
      state.room!.sessionId !== state.roomState!.round?.hinter?.sessionId,
  );

  const [guess, setGuess] = useState<number>(50);

  function handleGuessChange(event: ChangeEvent<HTMLInputElement>) {
    setGuess(parseInt(event.target.value, 10));
  }

  function handleGuessSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    room.send<Message[Messages.SubmitGuess]>(Messages.SubmitGuess, guess);
  }

  return (
    <div>
      {isGuesser ? (
        <form onSubmit={handleGuessSubmit}>
          <input
            type="number"
            min={0}
            max={100}
            placeholder="Your guess"
            value={guess}
            onChange={handleGuessChange}
          />
        </form>
      ) : (
        <p>Waiting for guesses...</p>
      )}
    </div>
  );
}
