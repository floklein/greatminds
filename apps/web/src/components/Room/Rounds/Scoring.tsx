import { useStore } from "../../../zustand";

export function Scoring() {
  const guesses = useStore((state) => state.roomState!.round?.guesses);
  const players = useStore((state) => state.roomState!.players);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Guess</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {guesses &&
            Object.entries(guesses).map(([sessionId, guess]) => (
              <tr key={sessionId}>
                <td>
                  [{sessionId}] {players[sessionId].name}
                </td>
                <td>{guess}</td>
                <td>0</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
