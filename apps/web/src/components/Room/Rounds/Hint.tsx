import { Button, Form, Input } from "antd";
import { Message, Messages } from "@wavelength/api";
import { useStore } from "../../../zustand";
import { Center } from "../../UI/Center";
import { ArrowRightOutlined } from "@ant-design/icons";

type FieldType = {
  hint?: string;
};

export function Hint() {
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
              message: "Please type a hint to help the guessers",
            },
          ]}
        >
          <Input placeholder="Your hint" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<ArrowRightOutlined />}
            iconPosition="end"
          >
            Submit hint
          </Button>
        </Form.Item>
      </Form>
    </Center>
  );
}
