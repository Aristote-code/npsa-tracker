import * as React from "react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Sheet } from "@/components/Sheet";
import { LOCALES, useI18n } from "@/i18n";

/** Deliberately in all three languages: it is read by someone who cannot yet
    read the interface. */
const GROUP_LABEL = "Ururimi / Language / Langue";

type LanguageSwitcherProps = {
  /**
   * "full" shows all three. "compact" shows the current one and opens the
   * rest in a sheet.
   */
  variant?: "full" | "compact";
};

/**
 * Three languages, and where to put them.
 *
 * On the front door all three stay visible: visible beats discoverable when
 * someone cannot read the interface, and that is a live problem exactly once.
 * Past that point the person has chosen a language and so has demonstrated
 * they can read it — the discoverability has already been paid for — while
 * the control keeps costing 30% of a 375px header and visually outweighing
 * Back. So inner screens collapse it to the current code and open the choice
 * in a sheet.
 *
 * It does not move to a settings screen. "Settings" is itself an English word
 * to decode, which assumes the literacy the control exists to provide, and
 * our SMS links land people mid-flow having passed no setup step at all.
 */
export function LanguageSwitcher({ variant = "full" }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = React.useState(false);

  if (variant === "full") {
    return (
      <div className="lang" role="group" aria-label={GROUP_LABEL}>
        {LOCALES.map((option) => (
          <button
            key={option.code}
            type="button"
            lang={option.code}
            aria-pressed={locale === option.code}
            onClick={() => setLocale(option.code)}
          >
            <span className="sr-only">{option.native}</span>
            <span aria-hidden="true">{option.label}</span>
          </button>
        ))}
      </div>
    );
  }

  const current = LOCALES.find((option) => option.code === locale) ?? LOCALES[1];

  return (
    <>
      <button
        type="button"
        className="lang-compact"
        aria-haspopup="dialog"
        aria-label={`${GROUP_LABEL}: ${current.native}`}
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">{current.label}</span>
      </button>

      <Sheet open={open} title={GROUP_LABEL} onClose={() => setOpen(false)}>
        {/* Full names here. The two-letter code is a fine label for the
            current state and a poor one for a menu. */}
        <div className="lang-list" role="group" aria-label={GROUP_LABEL}>
          {LOCALES.map((option) => (
            <button
              key={option.code}
              type="button"
              lang={option.code}
              aria-pressed={locale === option.code}
              onClick={() => {
                setLocale(option.code);
                setOpen(false);
              }}
            >
              {option.native}
              {locale === option.code && <Icon icon={Tick02Icon} size={18} strokeWidth={2.4} />}
            </button>
          ))}
        </div>
      </Sheet>
    </>
  );
}
