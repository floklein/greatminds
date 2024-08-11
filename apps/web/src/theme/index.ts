import { ThemeConfig, theme as antdTheme } from "antd";

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
