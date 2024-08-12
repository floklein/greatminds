import { ThemeConfig, theme as antdTheme } from "antd";
import "antd/dist/reset.css";
import "./fonts.css";
import colorAlpha from "color-alpha";

export const theme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  cssVar: true,
  token: {
    // colorPrimary: "#48c7fb",
    colorBgBase: "#010625",
    fontFamily: "GT Walsheim Regular, sans-serif",
  },
  components: {
    Layout: {
      headerBg: "transparent",
      headerPadding: 0,
      siderBg: colorAlpha("#000312", 0.5),
    },
  },
};
