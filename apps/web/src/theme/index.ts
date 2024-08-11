import { ThemeConfig, theme as antdTheme } from "antd";
import "antd/dist/reset.css";

export const theme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  cssVar: true,
  token: {
    // colorPrimary: "#48c7fb",
    colorBgBase: "#010625",
  },
  components: {
    Layout: {
      headerBg: "transparent",
    },
  },
};
