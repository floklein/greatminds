import { Space, Steps } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";
import { TextHint } from "./Rounds/TextHint";
import { Scoring } from "./Rounds/Scoring";
import { Step } from "./Rounds/Step";
import { Range } from "./Rounds/Range";
import { GameMode } from "@greatminds/api";
import { SketchHint } from "./Rounds/SketchHint";

const useStyles = createStyles({
  space: {
    width: "100%",
  },
  steps: {
    maxWidth: "100%",
    overflowX: "auto",
  },
});

export function Rounds() {
  const { styles } = useStyles();

  const roundIndex = useStore((state) => state.roomState!.roundIndex);
  const rounds = useStore((state) => state.roomState!.rounds);
  const step = useStore((state) => state.roomState!.round?.step);
  const isHinter = useStore(
    (state) =>
      state.room!.sessionId === state.roomState!.round?.hinter?.sessionId,
  );
  const mode = useStore((state) => state.roomState!.mode);

  return (
    <Space direction="vertical" size="large" className={styles.space}>
      <Steps
        current={roundIndex}
        items={rounds.map(() => ({}))}
        labelPlacement="vertical"
        responsive={false}
        className={styles.steps}
      />
      <Step />
      {(step === "hinting" || step === "guessing" || step === "scoring") && (
        <Range />
      )}
      {step === "hinting" && isHinter && mode === GameMode.TextHints && (
        <TextHint />
      )}
      {step === "hinting" && isHinter && mode === GameMode.SketchHints && (
        <SketchHint />
      )}
      {step === "scoring" && <Scoring />}
    </Space>
  );
}
