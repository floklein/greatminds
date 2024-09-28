import { Button, Flex, Space, Tooltip, theme as antdTheme } from "antd";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { useRef, useState } from "react";
import { createStyles } from "antd-style";
import { RiEraserLine } from "react-icons/ri";
import colorAlpha from "color-alpha";
import { useTranslation } from "react-i18next";

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
      "--ant-color-bg-container-disabled": colorAlpha("#fff", 0.3),
    },
  },
  button__black: {
    "&.ant-btn": {
      "--ant-button-default-bg": "#000",
      "--ant-button-default-hover-bg": "#000",
      "--ant-color-bg-container-disabled": colorAlpha("#000", 0.3),
    },
  },
  button__red: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.red,
      "--ant-button-default-hover-bg": token.red,
      "--ant-color-bg-container-disabled": colorAlpha(token.red, 0.3),
    },
  },
  button__orange: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.orange,
      "--ant-button-default-hover-bg": token.orange,
      "--ant-color-bg-container-disabled": colorAlpha(token.orange, 0.3),
    },
  },
  button__yellow: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.yellow,
      "--ant-button-default-hover-bg": token.yellow,
      "--ant-color-bg-container-disabled": colorAlpha(token.yellow, 0.3),
    },
  },
  button__lime: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.lime,
      "--ant-button-default-hover-bg": token.lime,
      "--ant-color-bg-container-disabled": colorAlpha(token.lime, 0.3),
    },
  },
  button__green: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.green,
      "--ant-button-default-hover-bg": token.green,
      "--ant-color-bg-container-disabled": colorAlpha(token.green, 0.3),
    },
  },
  button__cyan: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.cyan,
      "--ant-button-default-hover-bg": token.cyan,
      "--ant-color-bg-container-disabled": colorAlpha(token.cyan, 0.3),
    },
  },
  button__blue: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.blue,
      "--ant-button-default-hover-bg": token.blue,
      "--ant-color-bg-container-disabled": colorAlpha(token.blue, 0.3),
    },
  },
  button__geekblue: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.geekblue,
      "--ant-button-default-hover-bg": token.geekblue,
      "--ant-color-bg-container-disabled": colorAlpha(token.geekblue, 0.3),
    },
  },
  button__purple: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.purple,
      "--ant-button-default-hover-bg": token.purple,
      "--ant-color-bg-container-disabled": colorAlpha(token.purple, 0.3),
    },
  },
  button__magenta: {
    "&.ant-btn": {
      "--ant-button-default-bg": token.magenta,
      "--ant-button-default-hover-bg": token.magenta,
      "--ant-color-bg-container-disabled": colorAlpha(token.magenta, 0.3),
    },
  },
  eraser: {
    marginBlockStart: 2,
  },
}));

export function SketchHint() {
  const { t } = useTranslation("room");
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

  function getColorFromKey(key: Color) {
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
        <Tooltip title={t("tooltip.eraser")} placement="bottom">
          <Button
            onClick={handleEraseMode}
            disabled={eraseMode}
            icon={<RiEraserLine size={16} className={styles.eraser} />}
          />
        </Tooltip>
        <Button onClick={handleClear}>{t("button.clearCanvas")}</Button>
      </Flex>
    </Space>
  );
}
