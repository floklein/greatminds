import {
  BAD_SCORE_POINTS,
  GREAT_SCORE_POINTS,
  OKAY_SCORE_POINTS,
  PERFECT_SCORE_POINTS,
} from "@wavelength/api";
import { useStore } from "../../../zustand";
import { List, Tag } from "antd";
import { createStyles } from "antd-style";
import { useTranslation } from "react-i18next";

function ScoreTag({ score }: { score: number }) {
  function getColor() {
    if (score >= PERFECT_SCORE_POINTS) {
      return "green";
    } else if (score >= GREAT_SCORE_POINTS) {
      return "blue";
    } else if (score >= OKAY_SCORE_POINTS) {
      return "orange";
    } else if (score >= BAD_SCORE_POINTS) {
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
  const { t } = useTranslation("room");
  const { styles } = useStyles();

  const scores =
    useStore(
      (state) =>
        state.roomState!.round?.scores as unknown as
          | Record<string, number>
          | undefined,
    ) ?? {};
  const players = useStore((state) => state.roomState!.players);
  const hinterId = useStore(
    (state) => state.roomState!.round?.hinter?.sessionId,
  );

  const sortedGuessesByDistance = Object.entries(players)
    .map(([sessionId, player]) => {
      return {
        sessionId,
        score: scores[sessionId] ?? 0,
        player,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <List
      bordered
      header={t("list.title.roundScoreboard")}
      dataSource={sortedGuessesByDistance}
      renderItem={(guess) => (
        <List.Item actions={[<ScoreTag score={guess.score} />]}>
          <List.Item.Meta
            title={guess.player.name}
            description={
              guess.sessionId === hinterId
                ? t("list.description.hinter")
                : t("list.description.guesser")
            }
          />
        </List.Item>
      )}
      className={styles.list}
    />
  );
}
