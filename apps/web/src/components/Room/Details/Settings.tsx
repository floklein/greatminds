import {
  FontSizeOutlined,
  GlobalOutlined,
  LockOutlined,
  SignatureOutlined,
} from "@ant-design/icons";
import { Flex, Form, Segmented } from "antd";
import { createStyles } from "antd-style";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../zustand";
import { GameMode, Message, Messages } from "@greatminds/api";
import { useEffect } from "react";

interface FieldType {
  mode?: GameMode;
  private?: boolean;
}

const useStyles = createStyles(
  ({ token }, { isAdmin }: { isAdmin: boolean }) => ({
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

  const [form] = Form.useForm<FieldType>();

  const { styles } = useStyles({ isAdmin });

  function onValuesChange(values: FieldType) {
    if (values.mode !== undefined) {
      room.send<Message[Messages.SetMode]>(Messages.SetMode, values.mode);
    }
    if (values.private !== undefined) {
      room.send<Message[Messages.SetPrivate]>(
        Messages.SetPrivate,
        values.private,
      );
    }
  }

  useEffect(() => {
    form.setFieldValue("mode", mode);
    form.setFieldValue("private", isPrivate);
  }, [mode, isPrivate, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      className={styles.form}
      disabled={disabled}
      initialValues={{ mode, private: isPrivate }}
      onValuesChange={onValuesChange}
    >
      <Form.Item label={t("form.label.mode")} name="mode">
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
            },
          ]}
        />
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
  );
}
