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
    cyan4: "#005b4e",
    cyan5: "#008270",
    cyan6: "#009681",
    volcano: "#db6249",
    volcano1: "#fff5f0",
    volcano2: "#fff4f0",
    volcano3: "#ffdbcf",
    volcano4: "#f5b39f",
    volcano5: "#e88972",
    volcano6: "#db6249",
    volcano7: "#b54433",
    volcano8: "#8f2c21",
    volcano9: "#691913",
    volcano10: "#420d0b",
  },
  components: {
    Layout: {
      headerBg: "transparent",
      headerPadding: 0,
      siderBg: "transparent",
    },
  },
};
