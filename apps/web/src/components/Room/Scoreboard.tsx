import { Button, List, Space, Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";
import { Place } from "./Scoreboard/Place";
import { Center } from "../UI/Center";

import waveArrow from "/assets/images/waveArrow.svg";
import { Messages } from "@wavelength/api";
import { useTranslation } from "react-i18next";

const useStyles = createStyles(({ token }) => ({
  space: {
    width: "100%",
  },
  typography: {
    textAlign: "center",
  },
  span: {
    color: token.colorText,
  },
  list: {
    width: "100%",
    maxWidth: "20rem",
    marginInline: "auto",
  },
  playerName: {
    "& .ant-list-item-meta-title": {
      margin: "0 !important",
    },
  },
  arrow: {
    transform: "rotate(180deg)",
  },
  playAgainButton: {
    backgroundColor: token.green5,
    "&:hover": {
      backgroundColor: `${token.green6} !important`,
    },
    "&:active": {
      backgroundColor: `${token.green4} !important`,
    },
  },
}));

export function Scoreboard() {
  const { t } = useTranslation("room");
  const { styles } = useStyles();

  const room = useStore((state) => state.room!);
  const players = useStore((state) => state.roomState!.players) ?? {};

  let place = 1;
  const sortedPlayers = Object.values(players)
    .sort((a, b) => b.score - a.score)
    .map((player, index, array) => {
      if (
        array[index - 1] !== undefined &&
        player.score < array[index - 1].score
      ) {
        place++;
      }
      return { ...player, place };
    });

  function playAgain() {
    room.send(Messages.PlayAgain);
  }

  return (
    <Space direction="vertical" size="large" className={styles.space}>
      <Typography.Title
        level={3}
        type="secondary"
        className={styles.typography}
      >
        {t("title.scoreboard1")}
        <span className={styles.span}>{t("title.scoreboard2")}</span>
        {t("title.scoreboard3")}
      </Typography.Title>
      <List
        header={t("list.title.scoreboard")}
        dataSource={sortedPlayers}
        bordered
        itemLayout="horizontal"
        renderItem={(player) => (
          <List.Item actions={[player.score]}>
            <List.Item.Meta
              avatar={<Place place={player.place} />}
              title={player.name}
              className={styles.playerName}
            />
          </List.Item>
        )}
        className={styles.list}
      />
      <Center>
        <img src={waveArrow} alt="arrow" className={styles.arrow} />
        <Button
          type="primary"
          size="large"
          className={styles.playAgainButton}
          onClick={playAgain}
        >
          {t("button.playAgain")}
        </Button>
      </Center>
    </Space>
  );
}
