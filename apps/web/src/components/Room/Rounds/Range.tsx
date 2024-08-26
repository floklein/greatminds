import { Flex, Slider, Tag } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { useRef, useState } from "react";
import clsx from "clsx";
import colorAlpha from "color-alpha";
import {
  BAD_SCORE_DISTANCE,
  GREAT_SCORE_DISTANCE,
  Message,
  Messages,
  OKAY_SCORE_DISTANCE,
  PERFECT_SCORE_DISTANCE,
} from "@wavelength/api";
import { useStore } from "../../../zustand";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const useStyles = createStyles(
  ({ token }, { target }: { target?: number }) => ({
    div: {
      paddingBlock: "2rem",
    },
    tag: {
      margin: 0,
      fontSize: token.fontSize,
      paddingBlock: token.paddingXS,
      paddingInline: token.paddingSM,
      whiteSpace: "wrap",
    },
    rightTag: {
      direction: "rtl",
    },
    sliders: {
      position: "relative",
      height: "36px",
      marginBlock: "50px",
    },
    slider: {
      position: "absolute",
      marginBlock: 0,
      marginInline: "1rem",
      top: 0,
      bottom: 0,
      left: "-1rem",
      right: "-1rem",
      "&.ant-slider": {
        "--ant-slider-rail-size": "12px",
        "--ant-slider-handle-size": "20px",
        "--ant-slider-handle-size-hover": "22px",
      },
    },
    meSlider: {
      "&.ant-slider": {
        "--ant-color-bg-elevated": token.volcano,
        "--ant-slider-handle-color": token.volcano8,
        "--ant-slider-handle-active-color": token.volcano8,
        "--ant-color-primary-border-hover": token.volcano9,
        "--ant-slider-handle-active-outline-color": colorAlpha(
          token.volcano,
          0.2,
        ),
      },
    },
    meSliderHandle: {
      zIndex: 3,
    },
    meTooltip: {
      "--ant-color-bg-spotlight": token.volcano,
    },
    otherSlider: {
      pointerEvents: "none",
    },
    otherSliderRail: {
      "&&&": {
        backgroundColor: "transparent !important",
      },
    },
    otherSliderHandle: {
      zIndex: 1,
    },
    targetSliderHandle: {
      visibility: "hidden",
    },
    targetSliderRail: {
      background:
        target !== undefined
          ? `linear-gradient(to right, transparent 0%, transparent ${target - BAD_SCORE_DISTANCE}%, ${token.red5} ${target - BAD_SCORE_DISTANCE}%, ${token.red5} ${target - OKAY_SCORE_DISTANCE}%, ${token.orange5} ${target - OKAY_SCORE_DISTANCE}%, ${token.orange5} ${target - GREAT_SCORE_DISTANCE}%, ${token.blue5} ${target - GREAT_SCORE_DISTANCE}%, ${token.blue5} ${target - PERFECT_SCORE_DISTANCE}%, ${token.green5} ${target - PERFECT_SCORE_DISTANCE}%, ${token.green5} ${target + PERFECT_SCORE_DISTANCE}%, ${token.blue5} ${target + PERFECT_SCORE_DISTANCE}%, ${token.blue5} ${target + GREAT_SCORE_DISTANCE}%, ${token.orange5} ${target + GREAT_SCORE_DISTANCE}%, ${token.orange5} ${target + OKAY_SCORE_DISTANCE}%, ${token.red5} ${target + OKAY_SCORE_DISTANCE}%, ${token.red5} ${target + BAD_SCORE_DISTANCE}%, transparent ${target + BAD_SCORE_DISTANCE}%, transparent 100%)`
          : undefined,
    },
    targetTooltip: {
      "--ant-color-bg-spotlight": token.green5,
    },
  }),
);

export function Range() {
  const { t } = useTranslation(["room", "range"]);

  const room = useStore((state) => state.room!);
  const isHinter = useStore(
    (state) =>
      state.roomState!.round?.hinter?.sessionId === state.room!.sessionId,
  );
  const target = useStore((state) => state.roomState!.round?.target);
  const range = useStore((state) => state.roomState!.round?.range);
  const storeGuesses =
    useStore(
      (state) =>
        state.roomState!.round?.guesses as unknown as
          | Record<string, number>
          | undefined,
    ) ?? {};
  const storeGuess = useStore((state) => storeGuesses?.[state.room!.sessionId]);
  const step = useStore((state) => state.roomState!.round?.step);
  const players = useStore((state) => state.roomState!.players);

  const { styles } = useStyles({ target });

  const otherPlayersGuesses = Object.entries(storeGuesses)
    .filter(([sessionId]) => sessionId !== room!.sessionId)
    .map(([sessionId, guess]) => ({
      sessionId,
      guesserName: players[sessionId]?.name,
      guessValue: guess,
    }));

  const [guess, setGuess] = useState(storeGuess ?? 50);

  const debounce = useRef<ReturnType<typeof setTimeout>>();

  function handleChange(value: number) {
    setGuess(value);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      room.send<Message[Messages.SetGuess]>(Messages.SetGuess, value);
    }, 500);
  }

  return (
    <div className={styles.div}>
      <Flex justify="space-between" gap="small" wrap>
        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
          }}
        >
          <Tag
            bordered={false}
            icon={<ArrowLeftOutlined />}
            className={styles.tag}
          >
            {range !== undefined && t(`range:${range}`, { context: "from" })}
          </Tag>
        </motion.div>
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{
            type: "spring",
          }}
          style={{ marginInlineStart: "auto" }}
        >
          <Tag
            bordered={false}
            icon={<ArrowRightOutlined />}
            className={clsx(styles.tag, styles.rightTag)}
          >
            {range !== undefined && t(`range:${range}`, { context: "to" })}
          </Tag>
        </motion.div>
      </Flex>
      <div className={styles.sliders}>
        {otherPlayersGuesses.map((guess) => (
          <Slider
            key={guess.sessionId}
            value={guess.guessValue}
            disabled
            included={false}
            min={0}
            max={100}
            tooltip={{
              open: true,
              placement: "bottom",
              formatter: (value) =>
                t("tooltip.guess", { player: guess.guesserName, value }),
            }}
            className={clsx(styles.slider, styles.otherSlider)}
            classNames={{
              rail: styles.otherSliderRail,
              handle: styles.otherSliderHandle,
            }}
          />
        ))}
        {target !== undefined && (
          <Slider
            value={target}
            included={false}
            min={0}
            max={100}
            tooltip={{
              open: true,
              placement: "top",
              formatter: (value) => t("tooltip.target", { value }),
              rootClassName: styles.targetTooltip,
            }}
            className={clsx(styles.slider, styles.otherSlider)}
            classNames={{
              rail: styles.targetSliderRail,
              handle: styles.targetSliderHandle,
            }}
          />
        )}
        {!isHinter && (
          <Slider
            value={guess}
            onChange={handleChange}
            disabled={step !== "guessing"}
            included={false}
            min={0}
            max={100}
            tooltip={{
              open: step !== "hinting",
              placement: "bottom",
              rootClassName: styles.meTooltip,
            }}
            className={clsx(styles.slider, styles.meSlider)}
            classNames={{
              handle: styles.meSliderHandle,
            }}
          />
        )}
      </div>
    </div>
  );
}
