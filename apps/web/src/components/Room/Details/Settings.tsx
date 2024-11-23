import {
  CopyOutlined,
  FontSizeOutlined,
  GlobalOutlined,
  LockOutlined,
  SignatureOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Flex,
  Form,
  Input,
  Popconfirm,
  Segmented,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { createStyles } from "antd-style";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../zustand";
import { GameMode, Message, Messages } from "@greatminds/api";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

interface FieldType {
  mode: GameMode;
  private: boolean;
}

const useStyles = createStyles(
  ({ token }, { isAdmin }: { isAdmin: boolean }) => ({
    flex: {
      height: 24,
    },
    title: {
      marginBlockEnd: "0px !important",
    },
    form: {
      pointerEvents: isAdmin ? undefined : "none",
      "& .ant-form-item": {
        "--ant-form-item-margin-bottom": "0px",
      },
      "& .ant-form-item:not(:last-child)": {
        "--ant-form-item-margin-bottom": `${token.paddingSM}px`,
      },
    },
  }),
);

export function Settings() {
  const { t } = useTranslation("room");

  const disabled = useStore((state) => state.roomState!.phase !== "lobby");
  const isAdmin = useStore(
    (state) => state.roomState!.admin?.sessionId === state.room!.sessionId,
  );
  const room = useStore((state) => state.room!);
  const mode = useStore((state) => state.roomState!.mode);
  const isPrivate = useStore((state) => state.roomState!.private);
  const phase = useStore((state) => state.roomState!.phase);
  const setRoomState = useStore((state) => state.setRoomState);
  const setRoom = useStore((state) => state.setRoom);

  const [, setReconnectionToken] = useLocalStorage<string | null>(
    "reconnectionToken",
    null,
  );

  const [form] = Form.useForm<FieldType>();

  const [copied, setCopied] = useState(false);

  const { styles } = useStyles({ isAdmin });

  function onValuesChange(values: FieldType) {
    room.send<Message[Messages.SetMode]>(Messages.SetMode, values.mode);
    room.send<Message[Messages.SetPrivate]>(
      Messages.SetPrivate,
      values.private,
    );
  }

  function copyRoomId() {
    navigator.clipboard.writeText(room.roomId);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const { mutate: leaveRoom } = useMutation({
    mutationFn: () => room!.leave(),
    onSuccess: () => {
      setReconnectionToken(null);
      setRoom(null);
      setRoomState(null);
    },
  });

  useEffect(() => {
    form.setFieldValue("mode", mode);
    form.setFieldValue("private", isPrivate);
  }, [mode, isPrivate, form]);

  return (
    <Space direction="vertical" size="middle">
      <Flex align="center" justify="space-between" className={styles.flex}>
        <Typography.Title level={5} className={styles.title}>
          {t("title.settings")}
        </Typography.Title>
        <Popconfirm
          title={t("pop.title.leave")}
          description={t("pop.description.leave")}
          onConfirm={() => leaveRoom()}
          okText={t("pop.ok.leave")}
          cancelText={t("pop.cancel.leave")}
          icon={null}
        >
          <Button type="text" danger>
            {t("button.leaveGame")}
          </Button>
        </Popconfirm>
      </Flex>
      <Space.Compact>
        <Input.Password
          addonBefore={t("form.label.gameId")}
          value={room.roomId}
          autoComplete="off"
          readOnly
          size="large"
        />
        {phase === "lobby" && (
          <Tooltip title={copied ? t("tooltip.copied") : t("tooltip.copy")}>
            <Button size="large" icon={<CopyOutlined />} onClick={copyRoomId} />
          </Tooltip>
        )}
      </Space.Compact>
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        disabled={disabled}
        initialValues={{ mode, private: isPrivate }}
        onValuesChange={onValuesChange}
      >
        <Form.Item label={t("form.label.mode")} name="mode">
          <Badge.Ribbon text={t("badge.comingSoon")}>
            <Segmented
              block
              disabled={disabled}
              options={[
                {
                  label: (
                    <Flex vertical align="center">
                      <FontSizeOutlined
                        style={{ paddingBlockStart: 8, fontSize: 32 }}
                      />
                      {t("form.value.textHints")}
                    </Flex>
                  ),
                  value: GameMode.TextHints,
                },
                {
                  label: (
                    <Flex vertical align="center">
                      <SignatureOutlined
                        style={{ paddingBlockStart: 8, fontSize: 32 }}
                      />
                      {t("form.value.sketchHints")}
                    </Flex>
                  ),
                  value: GameMode.SketchHints,
                  disabled: true,
                },
              ]}
            />
          </Badge.Ribbon>
        </Form.Item>
        <Form.Item label={t("form.label.private")} name="private">
          <Segmented
            block
            disabled={disabled}
            options={[
              {
                label: t("form.value.private"),
                value: true,
                icon: <LockOutlined />,
              },
              {
                label: t("form.value.public"),
                value: false,
                icon: <GlobalOutlined />,
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Space>
  );
}
