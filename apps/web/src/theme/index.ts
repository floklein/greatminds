import { ThemeConfig } from "antd/es/config-provider";
import antdTheme from "antd/es/theme";
import "antd/dist/reset.css";
import "@fontsource/quando";
import "@fontsource/gloria-hallelujah";
import "./global.css";
import colorAlpha from "color-alpha";

export const theme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  cssVar: true,
  token: {
    colorBgBase: "#0d1c20",
    colorBgElevated: "#0a1518",
    colorPrimary: "#d4974e",
    colorLink: "#DAD3BB",
    volcano: "#d4974e",
    volcano1: "#fffbf0",
    volcano2: "#fffaf0",
    volcano3: "#faedd4",
    volcano4: "#edd1a4",
    volcano5: "#e0b477",
    volcano6: "#d4974e",
    volcano7: "#ad7437",
    volcano8: "#875424",
    volcano9: "#613715",
    volcano10: "#3b200c",
  },
  components: {
    Button: {
      primaryShadow: `0 2px 0 ${colorAlpha("#0A1518", 0.5)}`,
    },
    Layout: {
      headerBg: "transparent",
      siderBg: "transparent",
    },
    Tag: {
      marginXS: 0,
    },
  },
};
