import { Flex, Slider, Tag } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { useRef, useState } from "react";
import { Message, Messages } from "@wavelength/api";
import { useStore } from "../../../zustand";
import clsx from "clsx";
import colorAlpha from "color-alpha";

const useStyles = createStyles({
  div: {
    paddingBlock: "2rem",
  },
  rightTag: {
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
      backgroundColor: `#008270 !important`,
      boxShadow: `0 0 0 2px ${colorAlpha("#008270", 0.75)} !important`,
    },
  },
  tooltip: {
    "& .ant-tooltip-inner": {
      backgroundColor: "#008270",
    },
    "& .ant-tooltip-arrow::before": {
      backgroundColor: "#008270",
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
    zIndex: 2,
    "&::after": {
      backgroundColor: `#DB6249 !important`,
      boxShadow: `0 0 0 2px ${colorAlpha("#DB6249", 0.75)} !important`,
    },
  },
  targetTooltip: {
    "& .ant-tooltip-inner": {
      backgroundColor: "#DB6249",
    },
    "& .ant-tooltip-arrow::before": {
      backgroundColor: "#DB6249",
    },
  },
});

export function Range() {
  const { styles } = useStyles();

  const room = useStore((state) => state.room!);
  const isHinter = useStore(
    (state) =>
      state.roomState!.round?.hinter?.sessionId === state.room!.sessionId,
  );
  const target = useStore((state) => state.roomState!.round?.target);
  const from = useStore((state) => state.roomState!.round?.from);
  const to = useStore((state) => state.roomState!.round?.to);
  const storeGuesses =
    useStore(
      (state) =>
        state.roomState!.round?.guesses as unknown as
          | Record<string, number>
          | undefined,
    ) ?? {};
  const storeGuess = useStore((state) => storeGuesses?.[state.room!.sessionId]);
  const isGuessing = useStore(
    (state) => state.roomState!.round?.step === "guessing",
  );
  const players = useStore((state) => state.roomState!.players);

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
      <Flex justify="space-between" className={styles.tags}>
        <Tag bordered={false} icon={<ArrowLeftOutlined />}>
          {from}
        </Tag>
        <Tag
          bordered={false}
          icon={<ArrowRightOutlined />}
          className={styles.rightTag}
        >
          {to}
        </Tag>
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
              formatter: (value) => `${guess.guesserName}: ${value}`,
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
              formatter: (value) => `Target: ${value}`,
              rootClassName: styles.targetTooltip,
            }}
            className={clsx(styles.slider, styles.otherSlider)}
            classNames={{ handle: styles.targetSliderHandle }}
          />
        )}
        {!isHinter && (
          <Slider
            value={guess}
            onChange={handleChange}
            disabled={!isGuessing}
            included={false}
            min={0}
            max={100}
            tooltip={{
              open: isGuessing,
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
