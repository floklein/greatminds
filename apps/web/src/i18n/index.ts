import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { fr } from "./fr";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

const defaultNS = "home";
const resources = {
  en,
  fr,
} as const;

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["fr"];
  }
}

export async function initializeI18n() {
  await i18next
    .use(initReactI18next)
    .use(I18nextBrowserLanguageDetector)
    .init({
      fallbackLng: "fr",
      detection: {
        order: [
          "querystring",
          "cookie",
          "sessionStorage",
          "localStorage",
          "navigator",
          "htmlTag",
        ],
      },
      supportedLngs: ["fr", "en"],
      resources,
      defaultNS,
    });
}
