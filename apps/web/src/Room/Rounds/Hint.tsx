import { Message, Messages } from "@wavelength/api";
import { useStore } from "../../zustand";
import { ChangeEvent, FormEvent, useState } from "react";

export function Hint() {
  const room = useStore((state) => state.room!);
  const step = useStore((state) => state.roomState!.round?.step);
  const isHinter = useStore(
    (state) =>
      state.room!.sessionId === state.roomState!.round?.hinter?.sessionId,
  );
  const stateHint = useStore((state) => state.roomState!.round?.hint);

  const [hint, setHint] = useState("");

  function handleHintChange(event: ChangeEvent<HTMLInputElement>) {
    setHint(event.target.value);
  }

  function handleHintSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    room.send<Message[Messages.SubmitHint]>(Messages.SubmitHint, hint);
  }

  if (step !== "hinting" && step !== "guessing") {
    return null;
  }
  return (
    <div>
      {step === "hinting" &&
        (isHinter ? (
          <form onSubmit={handleHintSubmit}>
            <input
              type="text"
              placeholder="Your hint"
              value={hint}
              onChange={handleHintChange}
            />
          </form>
        ) : (
          <p>Waiting for hint...</p>
        ))}
      {step === "guessing" && <p>Hint: {stateHint}</p>}
    </div>
  );
}
