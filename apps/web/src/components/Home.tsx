import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "../zustand";
import { client } from "../colyseus";
import { GreatMindsRoomState } from "@greatminds/api";
import {
  Alert,
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  List,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { Center } from "./UI/Center";
import { createStyles } from "antd-style";
import { PlusOutlined, UndoOutlined } from "@ant-design/icons";
import { useIsAdmin, useReconnectionToken } from "../hooks";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

type FieldType = {
  roomId?: string;
};

const useStyles = createStyles(({ token }) => ({
  space: {
    width: "100%",
  },
  flexItem: {
    width: "100%",
    maxWidth: "30rem",
  },
  tutorial: {
    backgroundColor: token.colorBgElevated,
    border: "none",
    marginBlockEnd: token.paddingLG,
  },
  greatMinds: {
    color: token.colorLink,
    fontFamily: "Quando, sans serif",
  },
  tooltip: {
    fontFamily: "Gloria Hallelujah, cursive",
  },
  createButton: {
    backgroundColor: token.volcano,
    "&:hover": {
      backgroundColor: `${token.volcano5} !important`,
    },
    "&:active": {
      backgroundColor: `${token.volcano7} !important`,
    },
  },
}));

export function Home() {
  const { t } = useTranslation("home");
  const { styles } = useStyles();

  const setRoom = useStore((state) => state.setRoom);

  const [reconnectionToken, setReconnectionToken] = useReconnectionToken();
  const [isAdmin] = useIsAdmin();

  const { data: rooms, isLoading: loadingRooms } = useQuery({
    queryFn: () => client.getAvailableRooms<GreatMindsRoomState>(),
    queryKey: ["rooms"],
    refetchInterval: 5000,
    enabled: isAdmin,
  });

  const { mutate: createRoom, isPending: creatingRoom } = useMutation({
    mutationFn: () => client.create<GreatMindsRoomState>("greatminds"),
    onSuccess: (newRoom) => {
      setReconnectionToken(newRoom.reconnectionToken);
      setRoom(newRoom);
    },
  });

  const { mutate: joinRoom, isPending: joiningRoom } = useMutation({
    mutationFn: (roomId: string) =>
      client.joinById<GreatMindsRoomState>(roomId),
    onSuccess: (newRoom) => {
      setReconnectionToken(newRoom.reconnectionToken);
      setRoom(newRoom);
    },
  });

  const { mutate: reconnectRoom, isPending: reconnectingRoom } = useMutation({
    mutationFn: (reconnectionToken: string) =>
      client.reconnect<GreatMindsRoomState>(reconnectionToken),
    onSuccess: (newRoom) => {
      setReconnectionToken(newRoom.reconnectionToken);
      setRoom(newRoom);
    },
    onError: () => {
      setReconnectionToken(null);
    },
  });

  function handleJoinSubmit(values: FieldType) {
    if (!values.roomId) return;
    joinRoom(values.roomId);
  }

  return (
    <Center itemClassName={styles.flexItem}>
      <Space direction="vertical" size="large" className={styles.space}>
        <Alert
          className={styles.tutorial}
          message={
            <>
              <Typography.Text className={styles.greatMinds}>
                {t("tutorial.title1")}
              </Typography.Text>
              {t("tutorial.title2")}
            </>
          }
          description={
            <>
              <Typography.Paragraph>
                {t("tutorial.paragraph1a")}
                <Tooltip
                  title={t("tutorial.tooltip1")}
                  rootClassName={styles.tooltip}
                >
                  <Tag bordered>{t("tutorial.tag1")}</Tag>
                </Tooltip>
                {t("tutorial.paragraph1b")}
                <Tooltip
                  title={t("tutorial.tooltip2")}
                  rootClassName={styles.tooltip}
                >
                  <Tag>{t("tutorial.tag2")}</Tag>
                </Tooltip>
                {t("tutorial.paragraph1c")}
              </Typography.Paragraph>
              <Typography.Paragraph>
                {t("tutorial.paragraph2a")}
                <Tooltip
                  title={t("tutorial.tooltip3")}
                  rootClassName={styles.tooltip}
                >
                  <Tag>{t("tutorial.tag3")}</Tag>
                </Tooltip>
                {t("tutorial.paragraph2b")}
                <Tooltip
                  title={t("tutorial.tooltip4")}
                  rootClassName={styles.tooltip}
                >
                  <Tag>{t("tutorial.tag4")}</Tag>
                </Tooltip>
                {t("tutorial.paragraph2c")}
                <Tooltip
                  title={t("tutorial.tooltip5")}
                  rootClassName={styles.tooltip}
                >
                  <Tag>{t("tutorial.tag5")}</Tag>
                </Tooltip>
                {t("tutorial.paragraph2d")}
              </Typography.Paragraph>
              <Typography.Paragraph style={{ marginBlockEnd: 0 }}>
                {t("tutorial.paragraph3a")}
                <Tooltip
                  title={t("tutorial.tooltip6")}
                  rootClassName={styles.tooltip}
                >
                  <Tag>{t("tutorial.tag6")}</Tag>
                </Tooltip>
                {t("tutorial.paragraph3b")}
              </Typography.Paragraph>
            </>
          }
        />
        <Flex vertical gap="middle" align="center" justify="center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.05 }}>
            <Button
              type="primary"
              size="large"
              onClick={() => createRoom()}
              icon={<PlusOutlined />}
              loading={creatingRoom}
              className={styles.createButton}
            >
              {t("button.createGame")}
            </Button>
          </motion.div>
          {reconnectionToken && (
            <Button
              type="text"
              onClick={() => reconnectRoom(reconnectionToken)}
              icon={<UndoOutlined />}
              loading={reconnectingRoom}
            >
              {t("button.reconnectGame")}
            </Button>
          )}
        </Flex>
        <Divider>{t("divider.or")}</Divider>
        <Card
          title={t("card.title.joinGameById")}
          size="small"
          bordered={false}
        >
          <Form<FieldType> layout="inline" onFinish={handleJoinSubmit}>
            <Form.Item<FieldType>
              name="roomId"
              rules={[
                { required: true, message: t("form.error.gameIdRequired") },
              ]}
              required={false}
            >
              <Input.Password
                placeholder={t("form.placeholder.gameId")}
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={joiningRoom}>
                {t("button.joinGame")}
              </Button>
            </Form.Item>
          </Form>
        </Card>
        {isAdmin && (
          <>
            <Divider>{t("divider.or")}</Divider>
            <Card
              title={t("card.title.joinGame")}
              size="small"
              bordered={false}
            >
              <List
                locale={{ emptyText: t("card.text.noGames") }}
                loading={loadingRooms}
                dataSource={rooms}
                pagination={{ pageSize: 5 }}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        type="primary"
                        onClick={() => joinRoom(item.roomId)}
                        loading={joiningRoom}
                      >
                        {t("button.joinGame")}
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={item.roomId}
                      description={t("card.description.playersInGame", {
                        count: item.clients,
                        max: item.maxClients,
                      })}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </>
        )}
      </Space>
    </Center>
  );
}
