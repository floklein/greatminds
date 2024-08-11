import { useStore } from "../../zustand";
import { Guessing } from "./Rounds/Guessing";
import { Hint } from "./Rounds/Hint";
import { Scoring } from "./Rounds/Scoring";
import { Target } from "./Rounds/Target";

export function Rounds() {
  const round = useStore((state) => state.roomState!.roundIndex);
  const step = useStore((state) => state.roomState!.round?.step);
  const hinterId = useStore(
    (state) => state.roomState!.round?.hinter?.sessionId,
  );
  const hinterName = useStore((state) => state.roomState!.round?.hinter?.name);
  const from = useStore((state) => state.roomState!.round?.from);
  const to = useStore((state) => state.roomState!.round?.to);

  return (
    <div>
      <h2>Rounds</h2>
      <h3>Round: {round}</h3>
      <h4>Step: {step}</h4>
      <p>
        Hinter: [{hinterId}] {hinterName}
      </p>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{from}</td>
            <td>{to}</td>
          </tr>
        </tbody>
      </table>
      <Target />
      <Hint />
      {step === "guessing" && <Guessing />}
      {step === "scoring" && <Scoring />}
    </div>
  );
}
