import { Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../../zustand";
import { useTranslation } from "react-i18next";

const useStyles = createStyles(({ token }) => ({
  typography: {
    textAlign: "center",
  },
  span: {
    color: token.colorText,
  },
}));

export function Step() {
  const { t } = useTranslation("room");
  const { styles } = useStyles();

  const hinterName =
    useStore((state) => state.roomState!.round?.hinter?.name) ?? "";
  const step = useStore((state) => state.roomState!.round?.step);
  const hint = useStore((state) => state.roomState!.round?.hint);

  return (
    <Typography.Title level={3} type="secondary" className={styles.typography}>
      {step === "revealing" && (
        <>
          {t("title.revealing1")}
          <span className={styles.span}>{hinterName}</span>.
        </>
      )}
      {step === "hinting" && (
        <>
          <span className={styles.span}>{hinterName}</span>
          {t("title.hinting1")}
        </>
      )}
      {step === "guessing" && (
        <>
          {t("title.guessing1")} <span className={styles.span}>"{hint}"</span>
          {t("title.guessing2")}
        </>
      )}
      {step === "scoring" && (
        <>
          {t("title.scoring1")}
          <span className={styles.span}>{t("title.scoring2")}</span>
          {t("title.scoring3")}
        </>
      )}
    </Typography.Title>
  );
}
