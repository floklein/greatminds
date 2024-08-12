import { ChangeEvent, useState } from "react";
import { useStore } from "../../zustand";
import { Message, Messages } from "@wavelength/api";
import { Center } from "../UI/Center";
import { Button, Form, Input } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token }, props: { sucess: boolean }) => ({
  button: {
    backgroundColor: props.sucess ? token["green-5"] : undefined,
    "&&&&:hover": {
      backgroundColor: props.sucess ? token["green-6"] : undefined,
    },
    "&&&&:active": {
      backgroundColor: props.sucess ? token["green-4"] : undefined,
    },
  },
  form: {
    flexWrap: "nowrap",
  },
}));

export function Lobby() {
  const form = Form.useForm();

  const room = useStore((state) => state.room!);

  const storeName = useStore(
    (state) => state.roomState?.players[state.room!.sessionId]?.name ?? "",
  );
  const storeReady = useStore(
    (state) => state.roomState?.players[state.room!.sessionId]?.ready ?? false,
  );

  const { styles } = useStyles({ sucess: storeReady });

  const [name, setName] = useState(storeName);
  const [ready, setReady] = useState(storeReady);

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
    room.send<Message[Messages.SetPlayerName]>(
      Messages.SetPlayerName,
      event.target.value,
    );
  }

  function handleReadyChange() {
    setReady(!ready);
  }

  function handleFormSubmit() {
    room.send<Message[Messages.SetPlayerReady]>(
      Messages.SetPlayerReady,
      !ready,
    );
  }

  return (
    <Center>
      <Form layout="inline" onFinish={handleFormSubmit} className={styles.form}>
        <Form.Item>
          <Input
            placeholder="Your name"
            onChange={handleNameChange}
            disabled={ready}
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleReadyChange}
            className={styles.button}
            disabled={!name.length}
            size="large"
          >
            Ready?
          </Button>
        </Form.Item>
      </Form>
    </Center>
  );
}
