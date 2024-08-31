import { Button, Form, Input } from "antd";
import { createStyles } from "antd-style";
import { CheckOutlined } from "@ant-design/icons";
import { Message, Messages } from "@greatminds/api";
import { useStore } from "../../zustand";
import { Center } from "../UI/Center";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

type FieldType = {
  name?: string;
};

const useStyles = createStyles(({ token }, props: { sucess: boolean }) => ({
  button: {
    backgroundColor: props.sucess ? token.cyan5 : undefined,
    "&:hover": {
      backgroundColor: props.sucess ? `${token.cyan6} !important` : undefined,
    },
    "&:active": {
      backgroundColor: props.sucess ? `${token.cyan4} !important` : undefined,
    },
  },
  form: {
    flexWrap: "nowrap",
  },
}));

export function Lobby() {
  const { t } = useTranslation("room");

  const room = useStore((state) => state.room!);
  const storeName = useStore(
    (state) => state.roomState!.players[state.room!.sessionId]?.name ?? "",
  );
  const ready = useStore(
    (state) => state.roomState!.players[state.room!.sessionId]?.ready ?? false,
  );

  const { styles } = useStyles({ sucess: ready });

  function handleFormSubmit(values: FieldType) {
    if (!ready) {
      room.send<Message[Messages.SetPlayerName]>(
        Messages.SetPlayerName,
        values.name ?? "",
      );
    }
    room.send<Message[Messages.SetPlayerReady]>(
      Messages.SetPlayerReady,
      !ready,
    );
  }

  return (
    <Center>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <Form<FieldType>
          initialValues={{ name: storeName }}
          layout="inline"
          onFinish={handleFormSubmit}
          className={styles.form}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="name"
            rules={[
              { required: true, message: t("form.error.requiredName") },
              {
                type: "string",
                pattern: /^.{1,16}$/,
                message: t("form.error.validName"),
              },
            ]}
          >
            <Input
              size="large"
              placeholder={t("form.placeholder.name")}
              autoFocus
              disabled={ready}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.button}
              size="large"
              icon={ready ? <CheckOutlined /> : undefined}
              iconPosition="end"
            >
              {ready ? t("button.ready") : t("button.notReady")}
            </Button>
          </Form.Item>
        </Form>
      </motion.div>
    </Center>
  );
}
