import { Flex, Slider, Tag } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { useRef, useState } from "react";
import { Message, Messages } from "@wavelength/api";
import { useStore } from "../../../zustand";

const useStyles = createStyles({
  div: {
    paddingBlock: "2rem",
  },
  rightTag: {
    direction: "rtl",
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
  const storeGuesses = useStore(
    (state) =>
      state.roomState!.round?.guesses as unknown as
        | Record<string, number>
        | undefined,
  );
  const storeGuess = useStore((state) => storeGuesses?.[state.room!.sessionId]);
  const isGuessing = useStore(
    (state) => state.roomState!.round?.step === "guessing",
  );

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
      <Flex justify="space-between">
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
      <Slider
        value={target ?? guess}
        onChange={handleChange}
        disabled={isHinter || !isGuessing}
        min={0}
        max={100}
        tooltip={{ open: isHinter || isGuessing, placement: "bottom" }}
      />
    </div>
  );
}
