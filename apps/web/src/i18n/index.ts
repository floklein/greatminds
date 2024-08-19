import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { fr } from "./fr";

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
  await i18next.use(initReactI18next).init({
    lng: "fr",
    fallbackLng: "fr",
    resources,
    defaultNS,
  });
}
