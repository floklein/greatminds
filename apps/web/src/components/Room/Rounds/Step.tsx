import { Flex, Spin, Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../../zustand";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  GUESSING_STEP_DURATION_SECONDS,
  REVEALING_STEP_DURATION_SECONDS,
  SCORING_STEP_DURATION_SECONDS,
} from "@greatminds/api";

const useStyles = createStyles(({ token }) => ({
  flex: {
    height: 64,
  },
  typography: {
    textAlign: "center",
    margin: "0 !important",
  },
  span: {
    color: token.colorText,
  },
}));

export function Step() {
  const { t } = useTranslation("room");
  const { styles } = useStyles();

  const [percentage, setPercentage] = useState<number | undefined>(undefined);

  const hinterName =
    useStore((state) => state.roomState!.round?.hinter?.name) ?? "";
  const isHinter = useStore(
    (store) =>
      store.roomState!.round?.hinter?.sessionId === store.room!.sessionId,
  );
  const step = useStore((state) => state.roomState!.round?.step);
  const hint = useStore((state) => state.roomState!.round?.hint);

  function spin(seconds: number) {
    setPercentage(1);
    const interval = setInterval(
      () => {
        setPercentage((prevPercentage) => {
          if (prevPercentage === undefined) {
            return 1;
          }
          if (prevPercentage >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevPercentage + 1;
        });
      },
      Math.round((seconds / 100) * 1000),
    );
    return interval;
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "revealing") {
      interval = spin(REVEALING_STEP_DURATION_SECONDS);
    } else if (step === "guessing") {
      interval = spin(GUESSING_STEP_DURATION_SECONDS);
    } else if (step === "scoring") {
      interval = spin(SCORING_STEP_DURATION_SECONDS);
    } else {
      setPercentage(undefined);
    }
    return () => {
      clearInterval(interval);
    };
  }, [step]);

  return (
    <Flex align="center" justify="center" className={styles.flex}>
      <Typography.Title
        level={4}
        type="secondary"
        className={styles.typography}
      >
        {step === "revealing" && (
          <>
            {t("title.revealing1", {
              context: isHinter ? "hinter" : undefined,
            })}
            <span className={styles.span}>{hinterName}</span>.
          </>
        )}
        {step === "hinting" && (
          <>
            <span className={styles.span}>{hinterName}</span>
            {t("title.hinting1", {
              context: isHinter ? "hinter" : undefined,
            })}
          </>
        )}
        {step === "guessing" && (
          <>
            {t("title.guessing1", { hinter: hinterName })}
            <span className={styles.span}>"{hint}"</span>
            {t("title.guessing2", {
              context: isHinter ? "hinter" : undefined,
            })}
          </>
        )}
        {step === "scoring" && (
          <>
            {t("title.scoring1")}
            <span className={styles.span}>{t("title.scoring2")}</span>
            {t("title.scoring3")}
          </>
        )}{" "}
        {(step !== "hinting" || !isHinter) && <Spin percent={percentage} />}
      </Typography.Title>
    </Flex>
  );
}
