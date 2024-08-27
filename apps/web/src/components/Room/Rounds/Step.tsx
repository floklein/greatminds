import { Flex, Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../../zustand";
import { useTranslation } from "react-i18next";

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

  const hinterName =
    useStore((state) => state.roomState!.round?.hinter?.name) ?? "";
  const isHinter = useStore(
    (store) =>
      store.roomState!.round?.hinter?.sessionId === store.room!.sessionId,
  );
  const step = useStore((state) => state.roomState!.round?.step);
  const hint = useStore((state) => state.roomState!.round?.hint);

  return (
    <Flex align="center" justify="center" className={styles.flex}>
      <Typography.Title
        level={3}
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
            {t("title.hinting1", { context: isHinter ? "hinter" : undefined })}
          </>
        )}
        {step === "guessing" && (
          <>
            {t("title.guessing1", { hinter: hinterName })}
            <span className={styles.span}>"{hint}"</span>
            {t("title.guessing2", { context: isHinter ? "hinter" : undefined })}
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
    </Flex>
  );
}
