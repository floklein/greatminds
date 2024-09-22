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

  const isAdmin = useStore(
    (state) => state.roomState!.admin?.sessionId === state.room!.sessionId,
  );

  const { styles } = useStyles({ isAdmin });

  return (
    <Form layout="vertical" className={styles.form}>
      <Form.Item label={t("form.label.mode")}>
        <Segmented
          block
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
              value: 1,
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
              value: 2,
            },
          ]}
        />
      </Form.Item>
      <Form.Item label={t("form.label.visibility")}>
        <Segmented
          block
          options={[
            {
              label: t("form.value.private"),
              value: 1,
              icon: <LockOutlined />,
            },
            {
              label: t("form.value.public"),
              value: 2,
              icon: <GlobalOutlined />,
            },
          ]}
        />
      </Form.Item>
    </Form>
  );
}
