import {
  BAD_SCORE_POINTS,
  getDistance,
  getScore,
  GREAT_SCORE_POINTS,
  OKAY_SCORE_POINTS,
  PERFECT_SCORE_POINTS,
} from "@wavelength/api";
import { useStore } from "../../../zustand";
import { List, Space, Tag } from "antd";
import { createStyles } from "antd-style";

function ScoreTag({ score }: { score: number }) {
  function getColor() {
    if (score === PERFECT_SCORE_POINTS) {
      return "green";
    } else if (score === GREAT_SCORE_POINTS) {
      return "blue";
    } else if (score === OKAY_SCORE_POINTS) {
      return "orange";
    } else if (score === BAD_SCORE_POINTS) {
      return "red";
    }
  }

  if (score === 0) {
    return null;
  }
  return <Tag color={getColor()}>+{score}</Tag>;
}

const useStyles = createStyles({
  list: {
    width: "100%",
    maxWidth: "25rem",
    margin: "0 auto",
  },
});

export function Scoring() {
  const { styles } = useStyles();

  const guesses =
    useStore(
      (state) =>
        state.roomState!.round?.guesses as unknown as
          | Record<string, number>
          | undefined,
    ) ?? {};
  const players = useStore((state) => state.roomState!.players);
  const target = useStore((state) => state.roomState!.round?.target) ?? 50;

  const sortedGuessesByDistance = Object.entries(players)
    .map(([sessionId, player]) => {
      const guess = guesses[sessionId] ?? null;
      return {
        sessionId,
        guess,
        distance: guess ? getDistance(target, guess) : Infinity,
        score: guess ? getScore(target, guess) : 0,
        player,
      };
    })
    .sort((a, b) => a.distance - b.distance);

  return (
    <List
      bordered
      header="Scoreboard"
      dataSource={sortedGuessesByDistance}
      renderItem={(guess) => (
        <List.Item actions={[<ScoreTag score={guess.score} />]}>
          {guess.player.name}
        </List.Item>
      )}
      className={styles.list}
    />
  );
}
