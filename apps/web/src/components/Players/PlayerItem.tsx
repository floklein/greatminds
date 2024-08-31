import {
  CrownOutlined,
  MoreOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Message, Messages, Player } from "@greatminds/api";
import {
  Badge,
  Button,
  Dropdown,
  Flex,
  List,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useStore } from "../../zustand";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "framer-motion";
import { createStyles } from "antd-style";

const useStyles = createStyles({
  tag: {
    margin: "0 !important",
  },
  actions: {
    "& li": {
      padding: "0 !important",
    },
  },
  meta: {
    "& .ant-list-item-meta-title": {
      margin: "0 !important",
    },
  },
  flex: {
    width: "100%",
    height: 32,
    position: "relative",
    whiteSpace: "nowrap",
    "& > *": {
      position: "absolute",
      right: 0,
    },
  },
});

interface PlayerItemProps {
  player: Player;
  index: number;
}

export function PlayerItem({ player, index }: PlayerItemProps) {
  const { t } = useTranslation("room");
  const { styles } = useStyles();

  const room = useStore((state) => state.room!);
  const phase = useStore((state) => state.roomState!.phase);
  const clientId = useStore((state) => state.room!.sessionId);
  const adminId = useStore((state) => state.roomState!.admin?.sessionId);
  const isAdmin = useStore(
    (state) => state.roomState!.admin?.sessionId === state.room!.sessionId,
  );

  const [isHover, setIsHover] = useState(false);

  const playerName = player.name.length
    ? player.name
    : t("list.text.playerN", { index: index + 1 });
  const isPlayerAdmin = player.sessionId === adminId;
  const isPlayerClient = player.sessionId === clientId;
  const showKick = isAdmin && !isPlayerClient;

  function handleMouseEnter() {
    setIsHover(true);
  }

  function handleMouseLeave() {
    setIsHover(false);
  }

  function kickPlayer() {
    room.send<Message[Messages.KickPlayer]>(
      Messages.KickPlayer,
      player.sessionId,
    );
  }

  return (
    <List.Item
      classNames={{ actions: styles.actions }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      actions={[
        <Flex align="center" className={styles.flex}>
          <motion.div
            animate={showKick && { opacity: isHover ? 0 : 1 }}
            transition={{ duration: 0.1 }}
          >
            {phase === "rounds" ? (
              player.score
            ) : (
              <Badge
                status={player.ready ? "success" : "error"}
                text={player.ready ? t("badge.ready") : t("badge.notReady")}
              />
            )}
          </motion.div>
          {showKick && (
            <motion.div
              animate={{ opacity: isHover ? 1 : 0 }}
              transition={{ duration: 0.1 }}
            >
              <Dropdown
                menu={{
                  items: [
                    {
                      type: "item",
                      key: "0",
                      label: (
                        <Popconfirm
                          title={t("pop.title.kick")}
                          description={t("pop.description.kick", {
                            player: playerName,
                          })}
                          icon={null}
                          onConfirm={kickPlayer}
                        >
                          {t("menu.label.kick", { player: playerName })}
                        </Popconfirm>
                      ),
                      danger: true,
                      icon: <UserDeleteOutlined />,
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <Button icon={<MoreOutlined />} type="text" />
              </Dropdown>
            </motion.div>
          )}
        </Flex>,
      ]}
    >
      <List.Item.Meta
        className={styles.meta}
        title={
          <>
            {playerName}
            &nbsp;
            {isPlayerClient && (
              <Typography.Text type="secondary">
                ({t("list.description.you")})
              </Typography.Text>
            )}
            &nbsp;
            {isPlayerAdmin && (
              <Tooltip color="red" title={t("tag.admin")}>
                <Tag
                  color="red"
                  bordered={false}
                  icon={<CrownOutlined />}
                  className={styles.tag}
                />
              </Tooltip>
            )}
          </>
        }
      />
    </List.Item>
  );
}
