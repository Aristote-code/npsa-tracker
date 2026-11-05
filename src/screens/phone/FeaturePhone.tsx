import * as React from "react";
import { Message01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n, type Locale } from "@/i18n";
import { dictionaries, type StringKey } from "@/i18n/strings";
import { normalizeReference } from "@/reference";

type Screen =
  | "lang"
  | "menu"
  | "list"
  | "ask"
  | "statusAction"
  | "statusReview"
  | "notFound"
  | "timeout";

const SCREEN_KEY: Record<Screen, StringKey> = {
  lang: "ussd.lang",
  menu: "ussd.menu",
  list: "ussd.list",
  ask: "ussd.ask",
  statusAction: "ussd.statusAction",
  statusReview: "ussd.statusReview",
  notFound: "ussd.notFound",
  timeout: "ussd.timeout",
};

const LIMIT = 182;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

/**
 * The fourth deliverable, designed rather than described.
 *
 * USSD is the pull channel: free, no data, works on any handset, and
 * menu-driven, so a citizen presses a digit instead of composing a correctly
 * formatted SMS. SMS is the push channel. Neither can resolve a document
 * problem, which is why the assisted path at any NPSA counter is a designed
 * route rather than a footnote.
 *
 * The dialog below is drawn to match a real MTN Rwanda USSD session: it is an
 * operating-system modal over whatever the phone was doing, with centre-set
 * white system text and "N)" numbering. None of our design system appears in
 * it, because none of it would survive the channel — we control the text and
 * nothing else.
 */
export function FeaturePhone() {
  const { t, locale, setLocale } = useI18n();
  const [screen, setScreen] = React.useState<Screen>("lang");
  const [entry, setEntry] = React.useState("");

  const body = t(SCREEN_KEY[screen]);

  // Counted across all three dictionaries, because a screen that fits in
  // English and overflows in Kinyarwanda does not fit.
  const worst = Math.max(
    ...(["rw", "en", "fr"] as Locale[]).map((code) => dictionaries[code][SCREEN_KEY[screen]].length),
  );

  const press = (key: string) => setEntry((value) => (value.length < 12 ? value + key : value));

  const reply = () => {
    const value = entry.trim();
    const digitsOnly = normalizeReference(value);
    setEntry("");
    if (!value) return;

    switch (screen) {
      case "lang": {
        const picked: Record<string, Locale> = { "1": "rw", "2": "en", "3": "fr" };
        if (picked[value]) {
          setLocale(picked[value]);
          setScreen("menu");
        }
        return;
      }
      case "menu":
        if (value === "1") setScreen("list");
        else if (value === "2") setScreen("ask");
        else if (value === "3") setScreen("lang");
        else if (value === "4") setScreen("timeout");
        return;
      case "list":
        if (value === "1") setScreen("statusAction");
        else if (value === "2") setScreen("statusReview");
        else if (value === "9") setScreen("timeout");
        else if (value === "99") setScreen("menu");
        return;
      case "ask":
        if (value === "99") setScreen("menu");
        else if (value === "9") setScreen("timeout");
        else if (digitsOnly === "260051230") setScreen("statusAction");
        else if (digitsOnly === "260048178") setScreen("statusReview");
        else setScreen("notFound");
        return;
      case "statusAction":
      case "statusReview":
        if (value === "99") setScreen("list");
        return;
      case "notFound":
        if (value === "1") setScreen("ask");
        else if (value === "9") setScreen("timeout");
        return;
      default:
    }
  };

  const restart = () => {
    setEntry("");
    setScreen("lang");
  };

  return (
    <div className="u-screen">
      <header className="u-head">
        <div>
          <h1>{t("u.title")}</h1>
          <p>{t("u.sub")}</p>
        </div>
        <LanguageSwitcher />
      </header>

      <div className="u-cols">
        <section className="u-col">
          <h2>{t("u.pullTitle")}</h2>
          <p className="u-dial mono">{t("u.dial", { code: "*123#" })}</p>

          <div className="handset">
            <div className="handset__screen">
              {/* The status bar belongs to the phone and stays crisp above the
                  dialog, exactly as it does on a real handset. */}
              <div className="handset__statusbar" aria-hidden="true">
                <span>MTN RW</span>
                <span>11:13</span>
              </div>

              <div className="handset__stage">
                {/* Whatever the phone was showing. The dialog covers it. */}
                <div className="handset__idle" aria-hidden="true">
                  <div className="handset__clock">11:13</div>
                  <div className="handset__softkeys">
                    <span>Menu</span>
                    <span>Names</span>
                  </div>
                </div>

                {screen !== "timeout" ? (
                  <div className="ussd" role="dialog" aria-label="USSD">
                    <div className="ussd__chrome">
                      <button
                        type="button"
                        className="ussd__pill"
                        onClick={() => setScreen("timeout")}
                      >
                        {t("u.cancel")}
                      </button>
                      <span className="ussd__title">{t("u.send")}</span>
                      <button type="button" className="ussd__pill" onClick={reply}>
                        {t("u.send")}
                      </button>
                    </div>

                    <pre className="ussd__body">{body}</pre>

                    <div className="ussd__field">{entry}</div>
                    <div className="ussd__count">
                      {t("u.charsLeft", { n: Math.max(0, LIMIT - entry.length) })}
                    </div>
                  </div>
                ) : (
                  <div className="ussd ussd--ended" role="dialog" aria-label="USSD">
                    <pre className="ussd__body">{t("ussd.timeout")}</pre>
                    <button type="button" className="ussd__pill ussd__pill--wide" onClick={restart}>
                      {t("u.reset")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* A feature phone's keypad: digits only, which is why every step
                of the menu is a number. */}
            <div className="keypad">
              {KEYS.map((key) => (
                <button key={key} type="button" onClick={() => press(key)} disabled={screen === "timeout"}>
                  {key}
                </button>
              ))}
            </div>
            <div className="keypad__row">
              <button type="button" onClick={() => setEntry("")} disabled={screen === "timeout"}>
                Clear
              </button>
              <button type="button" onClick={reply} disabled={screen === "timeout"}>
                {t("u.send")}
              </button>
            </div>
          </div>

          <div className="u-budget">
            <span>{t("u.budget", { n: body.length })}</span>
            <span className={worst > LIMIT ? "is-over" : undefined}>
              {t("u.budgetWorst", { n: worst })}
            </span>
            <div className="u-meter" aria-hidden="true">
              <i style={{ width: `${Math.min(100, (worst / LIMIT) * 100)}%` }} />
            </div>
          </div>

          <div className="u-sim">
            <button type="button" onClick={() => setScreen("timeout")}>
              {t("u.showTimeout")}
            </button>
            <button type="button" onClick={restart}>
              {t("u.reset")}
            </button>
          </div>
        </section>

        <section className="u-col">
          <h2>{t("u.pushTitle")}</h2>
          <div className="u-sms">
            {(["u.smsAction", "u.smsStage", "u.smsDone"] as const).map((key) => (
              <div className="u-sms__item" key={key}>
                <div className="sms__bubble">{t(key)}</div>
                <span className="sms__from">
                  <Icon icon={Message01Icon} size={13} />
                  NPSA · 1234 · {t(key).length} / 160
                </span>
              </div>
            ))}
          </div>

          <h2 style={{ marginTop: 10 }}>Notes</h2>
          <ul className="u-notes">
            {(["u.noteOs", "u.noteKeypad", "u.noteLang", "u.noteTimeout", "u.noteBudget"] as const).map(
              (key) => (
                <li key={key}>{t(key)}</li>
              ),
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
