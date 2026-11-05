import * as React from "react";

import { dictionaries, LOCALES, type Locale, type StringKey } from "@/i18n/strings";

export { LOCALES, type Locale } from "@/i18n/strings";

const MONTHS: Record<Locale, string[]> = {
  rw: [
    "Mutarama", "Gashyantare", "Werurwe", "Mata", "Gicurasi", "Kamena",
    "Nyakanga", "Kanama", "Nzeri", "Ukwakira", "Ugushyingo", "Ukuboza",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  fr: [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ],
};

/** The prototype is written as if "now" were this moment. */
export const NOW = new Date("2026-11-05T11:20:00");

type Vars = Record<string, string | number>;

export type Translate = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: StringKey, vars?: Vars) => string;
  /** "5 November 2026" / "5 Ugushyingo 2026" */
  d: (iso: string) => string;
  /** "07:40" */
  time: (iso: string) => string;
  /** "4 hours ago", from NOW. */
  since: (iso: string) => string;
  /** The native name of a language, for labelling text written in it. */
  languageName: (locale: Locale) => string;
};

export const I18nContext = React.createContext<Translate | null>(null);

export function useI18n(): Translate {
  const value = React.useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside an I18nContext provider");
  return value;
}

export function createTranslate(locale: Locale, setLocale: (next: Locale) => void): Translate {
  const dict = dictionaries[locale];

  const t = (key: StringKey, vars?: Vars) => {
    let out: string = dict[key] ?? dictionaries.en[key] ?? String(key);
    if (vars) {
      for (const [name, value] of Object.entries(vars)) {
        out = out.replaceAll(`{${name}}`, String(value));
      }
    }
    return out;
  };

  const d = (iso: string) => {
    const date = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
    return `${date.getDate()} ${MONTHS[locale][date.getMonth()]} ${date.getFullYear()}`;
  };

  const time = (iso: string) => {
    const date = new Date(iso);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const since = (iso: string) => {
    const minutes = Math.max(1, Math.round((NOW.getTime() - new Date(iso).getTime()) / 60000));
    if (minutes < 60) return t("minutesAgo", { n: minutes });
    const hours = Math.round(minutes / 60);
    if (hours < 24) return t("hoursAgo", { n: hours });
    return t("daysAgo", { n: Math.round(hours / 24) });
  };

  const languageName = (target: Locale) =>
    LOCALES.find((option) => option.code === target)?.native ?? target;

  return { locale, setLocale, t, d, time, since, languageName };
}
