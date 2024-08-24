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
    },
    rightTag: {
      marginLeft: "auto",
      direction: "rtl",
    },
    sliders: {
      position: "relative",
      height: "29px",
      marginBlock: "3rem",
    },
    slider: {
      position: "absolute",
      marginBlockStart: "0.5rem",
      marginInline: "1rem",
      top: 0,
      bottom: 0,
      left: "-1rem",
      right: "-1rem",
    },
    sliderHandle: {
      zIndex: 3,
      "&::after": {
        backgroundColor: `#DB6249 !important`,
        boxShadow: `0 0 0 2px ${colorAlpha("#DB6249", 0.75)} !important`,
      },
    },
    tooltip: {
      "& .ant-tooltip-inner": {
        backgroundColor: "#DB6249",
      },
      "& .ant-tooltip-arrow::before": {
        backgroundColor: "#DB6249",
      },
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
    otherTooltip: {},
    targetSliderHandle: {
      visibility: "hidden",
    },
    targetSliderRail: {
      background:
        target !== undefined
          ? `linear-gradient(to right, transparent 0%, transparent ${target - BAD_SCORE_DISTANCE}%, ${token.red} ${target - BAD_SCORE_DISTANCE}%, ${token.red} ${target - OKAY_SCORE_DISTANCE}%, ${token.orange} ${target - OKAY_SCORE_DISTANCE}%, ${token.orange} ${target - GREAT_SCORE_DISTANCE}%, ${token.blue} ${target - GREAT_SCORE_DISTANCE}%, ${token.blue} ${target - PERFECT_SCORE_DISTANCE}%, ${token.green} ${target - PERFECT_SCORE_DISTANCE}%, ${token.green} ${target + PERFECT_SCORE_DISTANCE}%, ${token.blue} ${target + PERFECT_SCORE_DISTANCE}%, ${token.blue} ${target + GREAT_SCORE_DISTANCE}%, ${token.orange} ${target + GREAT_SCORE_DISTANCE}%, ${token.orange} ${target + OKAY_SCORE_DISTANCE}%, ${token.red} ${target + OKAY_SCORE_DISTANCE}%, ${token.red} ${target + BAD_SCORE_DISTANCE}%, transparent ${target + BAD_SCORE_DISTANCE}%, transparent 100%)`
          : undefined,
    },
    targetTooltip: {
      "& .ant-tooltip-inner": {
        backgroundColor: token.green5,
      },
      "& .ant-tooltip-arrow::before": {
        backgroundColor: token.green5,
      },
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
              rootClassName: styles.otherTooltip,
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
              handle: styles.targetSliderHandle,
              rail: styles.targetSliderRail,
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
              rootClassName: styles.tooltip,
            }}
            className={styles.slider}
            classNames={{ handle: styles.sliderHandle }}
          />
        )}
      </div>
    </div>
  );
}
