import { ThemeConfig } from "antd/es/config-provider";
import antdTheme from "antd/es/theme";
import "antd/dist/reset.css";
import "./fonts.css";

export const theme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  cssVar: true,
  token: {
    // colorPrimary: "#48c7fb",
    colorBgBase: "#010625",
    fontFamily: "GT Walsheim Regular, sans-serif",
    green4: "#005b4e",
    green5: "#008270",
    green6: "#009681",
  },
  components: {
    Layout: {
      headerBg: "transparent",
      headerPadding: 0,
      siderBg: "transparent",
    },
  },
};
