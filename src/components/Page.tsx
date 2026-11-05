import * as React from "react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n";

type PageProps = {
  /** Shown in the nav bar only once the large heading has scrolled away. */
  compactTitle?: string;
  onBack?: () => void;
  footer?: React.ReactNode;
  /** Skip the standard content padding, for full-bleed screens. */
  bare?: boolean;
  children: React.ReactNode;
};

/**
 * The citizen shell.
 *
 * The nav bar holds only back and language — no centred 17px title. The real
 * title is a large heading in the content, which is worth far more to someone
 * who finds reading effortful, and the nav bar picks up a compact version of
 * it once it scrolls away.
 *
 * Back is "up", not history: every screen is given an explicit parent by its
 * caller, so a system back button on Android lands in the right place even
 * when the history stack is empty — which it is whenever someone arrives from
 * an SMS link.
 */
export function Page({ compactTitle, onBack, footer, bare, children }: PageProps) {
  const { t } = useI18n();
  const [scrolled, setScrolled] = React.useState(false);
  const scroller = React.useRef<HTMLDivElement>(null);

  // Arriving on a screen means arriving at its top, however the browser
  // feels about restoring a previous scroll position.
  React.useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="screen">
      <header className="topbar">
        {onBack ? (
          <button type="button" className="topbar__back" onClick={onBack} aria-label={t("back")}>
            <Icon icon={ArrowLeft02Icon} size={22} />
          </button>
        ) : (
          <div className="topbar__brand">
            <span className="topbar__mark" aria-hidden="true">
              N
            </span>
            <span className="topbar__name">
              <b>{t("agencyShort")}</b>
              <span>{t("agency")}</span>
            </span>
          </div>
        )}

        {compactTitle && (
          <span className={`topbar__compact${scrolled ? " is-shown" : ""}`} aria-hidden="true">
            {compactTitle}
          </span>
        )}

        <LanguageSwitcher />
      </header>

      <div
        ref={scroller}
        className="scroll"
        onScroll={(event) => {
          const next = event.currentTarget.scrollTop > 36;
          setScrolled((current) => (current === next ? current : next));
        }}
      >
        {bare ? children : <div className="pad">{children}</div>}
      </div>

      {footer && <div className="sticky-foot">{footer}</div>}
    </div>
  );
}
