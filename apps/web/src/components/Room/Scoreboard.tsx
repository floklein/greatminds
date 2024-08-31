import { Button, List, Space, Typography } from "antd";
import { createStyles } from "antd-style";
import { useStore } from "../../zustand";
import { Place } from "./Scoreboard/Place";
import { Center } from "../UI/Center";
import { motion } from "framer-motion";
import waveArrow from "/assets/images/waveArrow.svg";
import { Messages } from "@greatminds/api";
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
    maxWidth: "25rem",
    marginInline: "auto",
  },
  playerName: {
    "& .ant-list-item-meta-title": {
      margin: "0 !important",
    },
  },
  playAgainButton: {
    display: "block",
    marginInline: "auto",
    backgroundColor: token.cyan5,
    "&:hover": {
      backgroundColor: `${token.cyan6} !important`,
    },
    "&:active": {
      backgroundColor: `${token.cyan4} !important`,
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
        renderItem={(player, index) => (
          <List.Item actions={[player.score]}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: sortedPlayers.length - index }}
            >
              <List.Item.Meta
                avatar={<Place place={player.place} />}
                title={player.name}
                className={styles.playerName}
              />
            </motion.div>
          </List.Item>
        )}
        className={styles.list}
      />
      <Center>
        <motion.img
          style={{
            transformOrigin: "center",
            display: "block",
            marginInline: "auto",
            transform: "rotate(180deg)",
          }}
          initial={{ height: 0 }}
          animate={{ height: 100 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 10,
            mass: 2,
          }}
          src={waveArrow}
          alt="arrow"
        />
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
