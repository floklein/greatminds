import { Button, Flex, Space, theme as antdTheme } from "antd";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useRef, useState } from "react";
import { createStyles } from "antd-style";
import { RiEraserLine } from "react-icons/ri";

const colors = [
  "white",
  "black",
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
  "magenta",
] as const;

type Color = (typeof colors)[number];

const useStyles = createStyles(({ token }) => ({
  canvas: {
    aspectRatio: "16/9",
    border: `1px solid ${token.colorBorder} !important`,
    "&:hover": {
      border: `1px solid ${token.colorPrimary} !important`,
    },
    "&:active": {
      border: `1px solid ${token.colorPrimaryActive} !important`,
    },
  },
  button__white: {
    "&.ant-btn": {
      "--ant-button-default-bg": "#fff",
      "--ant-button-default-hover-bg": "#fff",
    },
  },
  button__black: {
    "&.ant-btn": {
      "--ant-button-default-bg": "#000",
      "--ant-button-default-hover-bg": "#000",
    },
  },
  button__red: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.red,
      "--ant-button-default-hover-bg": token.red,
    },
  },
  button__orange: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.orange,
      "--ant-button-default-hover-bg": token.orange,
    },
  },
  button__yellow: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.yellow,
      "--ant-button-default-hover-bg": token.yellow,
    },
  },
  button__lime: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.lime,
      "--ant-button-default-hover-bg": token.lime,
    },
  },
  button__green: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.green,
      "--ant-button-default-hover-bg": token.green,
    },
  },
  button__cyan: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.cyan,
      "--ant-button-default-hover-bg": token.cyan,
    },
  },
  button__blue: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.blue,
      "--ant-button-default-hover-bg": token.blue,
    },
  },
  button__geekblue: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.geekblue,
      "--ant-button-default-hover-bg": token.geekblue,
    },
  },
  button__purple: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.purple,
      "--ant-button-default-hover-bg": token.purple,
    },
  },
  button__magenta: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.magenta,
      "--ant-button-default-hover-bg": token.magenta,
    },
  },
}));

export function SketchHint() {
  const { token } = antdTheme.useToken();
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const { styles } = useStyles();

  const [color, setColor] = useState<Color>("white");
  const [eraseMode, setEraseMode] = useState(false);

  function handleColorChange(color: Color) {
    return () => {
      setEraseMode(false);
      canvasRef.current?.eraseMode(false);
      setColor(color);
    };
  }

  function handleEraseMode() {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  }

  function handleClear() {
    canvasRef.current?.clearCanvas();
  }

  function getColorFromKey(key: (typeof colors)[number]) {
    if (key === "white") return "#fff";
    if (key === "black") return "#000";
    return token[key];
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <ReactSketchCanvas
        ref={canvasRef}
        width="100%"
        height="100%"
        canvasColor={token.colorBgBlur}
        strokeColor={getColorFromKey(color)}
        className={styles.canvas}
      />
      <Flex gap={4} align="center" justify="center" wrap>
        {colors.map((c) => (
          <Button
            key={c}
            onClick={handleColorChange(c)}
            className={styles[`button__${c}`]}
            disabled={c === color && !eraseMode}
          />
        ))}
        <Button onClick={handleEraseMode} disabled={eraseMode}>
          <RiEraserLine />
        </Button>
        <Button onClick={handleClear}>Clear</Button>
      </Flex>
    </Space>
  );
}
