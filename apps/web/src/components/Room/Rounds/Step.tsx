import { Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../../zustand";

const useStyles = createStyles(({ token }) => ({
  typography: {
    textAlign: "center",
  },
  span: {
    color: token.colorText,
  },
}));

export function Step() {
  const { styles } = useStyles();

  const hinterName =
    useStore((state) => state.roomState!.round?.hinter?.name) ?? "";
  const step = useStore((state) => state.roomState!.round?.step);
  const hint = useStore((state) => state.roomState!.round?.hint);

  return (
    <Typography.Title level={3} type="secondary" className={styles.typography}>
      {step === "revealing" && (
        <>
          This round's hinter is{" "}
          <span className={styles.span}>{hinterName}</span>.
        </>
      )}
      {step === "hinting" && (
        <>
          <span className={styles.span}>{hinterName}</span> is typing an hint...
        </>
      )}
      {step === "guessing" && (
        <>
          The hint is <span className={styles.span}>"{hint}"</span>. Guessers
          have 30 seconds to guess...
        </>
      )}
      {step === "scoring" && (
        <>
          Well played <span className={styles.span}>everyone</span>! Next round
          in 10 seconds...
        </>
      )}
    </Typography.Title>
  );
}
