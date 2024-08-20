import { Button, Form, Input } from "antd";
import { Message, Messages } from "@wavelength/api";
import { useStore } from "../../../zustand";
import { Center } from "../../UI/Center";
import { useTranslation } from "react-i18next";

type FieldType = {
  hint?: string;
};

export function Hint() {
  const { t } = useTranslation("room");

  const room = useStore((state) => state.room!);

  function handleHintChange(values: FieldType) {
    room.send<Message[Messages.SubmitHint]>(Messages.SubmitHint, values.hint);
  }

  return (
    <Center>
      <Form<FieldType> size="large" layout="inline" onFinish={handleHintChange}>
        <Form.Item
          name="hint"
          rules={[
            {
              required: true,
              message: t("form.error.requiredHint"),
            },
            {
              type: "string",
              pattern: /^.{1,50}$/,
              message: t("form.error.validHint"),
            },
          ]}
        >
          <Input placeholder={t("form.placeholder.hint")} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" iconPosition="end">
            {t("button.submitHint")}
          </Button>
        </Form.Item>
      </Form>
    </Center>
  );
}
