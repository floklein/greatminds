import { Space, Steps } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";
import { Hint } from "./Rounds/Hint";
import { Scoring } from "./Rounds/Scoring";
import { Step } from "./Rounds/Step";
import { Range } from "./Rounds/Range";

const useStyles = createStyles({
  space: {
    width: "100%",
    "& > :first-of-type": {
      maxWidth: "100%",
      overflowX: "auto",
    },
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

  return (
    <Space direction="vertical" size="large" className={styles.space}>
      <Steps
        current={roundIndex}
        items={rounds.map(() => ({}))}
        labelPlacement="vertical"
        responsive={false}
      />
      <Step />
      {(step === "hinting" || step === "guessing" || step === "scoring") && (
        <Range />
      )}
      {step === "hinting" && isHinter && <Hint />}
      {step === "scoring" && <Scoring />}
    </Space>
  );
}
