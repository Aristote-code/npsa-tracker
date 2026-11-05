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

/** The iOS symbol layout, as the reference screenshot shows it. */
const KEY_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["-", "/", ":", ";", "(", ")", "$", "&", "@", "”"],
];

/**
 * The fourth deliverable, designed rather than described.
 *
 * USSD is the pull channel: free, no data, works on any handset, and
 * menu-driven, so a citizen presses a digit instead of composing a correctly
 * formatted SMS. SMS is the push channel. Neither can resolve a document
 * problem, which is why the assisted path at any NPSA counter is a designed
 * route rather than a footnote.
 *
 * The dialog matches a real MTN Rwanda session on iOS: the system dims the
 * screen behind it to a mid grey, draws its own chrome, its own keyboard and
 * its own type. None of our design system appears here, because none of it
 * would survive the channel — we supply the text and nothing else, which is
 * what makes the text the entire design.
 */
export function FeaturePhone() {
  const { t, setLocale } = useI18n();
  const [screen, setScreen] = React.useState<Screen>("lang");
  const [entry, setEntry] = React.useState("");

  const body = t(SCREEN_KEY[screen]);
  const live = screen !== "timeout";

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
        <h1>{t("u.title")}</h1>
        <LanguageSwitcher />
      </header>

      <div className="u-cols">
        <section className="u-col">
          <h2>{t("u.pullTitle")}</h2>
          <p className="u-dial mono">{t("u.dial", { code: "*123#" })}</p>

          <div className="iphone">
            <div className={`ios${live ? " ios--dimmed" : ""}`}>
              <div className="ios__statusbar">
                <span>11:43</span>
                <span className="ios__signal">
                  ılıl 3G <b>52</b>
                </span>
              </div>

              {live ? (
                <>
                  <div className="ios__chrome">
                    <button type="button" className="ios__pill" onClick={() => setScreen("timeout")}>
                      Cancel
                    </button>
                    <span className="ios__title">Reply</span>
                    <button type="button" className="ios__pill" onClick={reply}>
                      Reply
                    </button>
                  </div>

                  <pre className="ios__menu">{body}</pre>

                  <div className="ios__field">
                    <i className="ios__caret" />
                    <span>{entry}</span>
                  </div>
                  <div className="ios__count">
                    {t("u.charsLeft", { n: Math.max(0, LIMIT - entry.length) })}
                  </div>

                  {/* The handset's own keyboard. */}
                  <div className="ios__keyboard">
                    {KEY_ROWS.map((row, index) => (
                      <div className="ios__krow" key={index}>
                        {row.map((key) => (
                          <button key={key} type="button" onClick={() => press(key)}>
                            {key}
                          </button>
                        ))}
                      </div>
                    ))}
                    <div className="ios__krow">
                      <button type="button" className="ios__kwide">
                        #+=
                      </button>
                      {[".", ",", "?", "!", "’"].map((key) => (
                        <button key={key} type="button" onClick={() => press(key)}>
                          {key}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="ios__kwide"
                        onClick={() => setEntry((value) => value.slice(0, -1))}
                      >
                        ⌫
                      </button>
                    </div>
                    <div className="ios__krow">
                      <button type="button" className="ios__kabc">
                        ABC
                      </button>
                      <button type="button" className="ios__kspace" onClick={() => press(" ")}>
                        <em>EN FR</em>
                      </button>
                      <button type="button" className="ios__kreturn" onClick={reply}>
                        ⏎
                      </button>
                    </div>
                    <div className="ios__ktray">
                      <span>☺</span>
                      <span>🎤</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="ios__home">
                  <div className="ios__clock">11:43</div>
                  <div className="ios__alert">
                    <p>{t("ussd.timeout")}</p>
                    <button type="button" onClick={restart}>
                      {t("u.reset")}
                    </button>
                  </div>
                </div>
              )}
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
