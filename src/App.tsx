import * as React from "react";

import { createTranslate, I18nContext, type Locale } from "@/i18n";
import { CitizenApp } from "@/screens/citizen/CitizenApp";
import { OfficerApp } from "@/screens/officer/OfficerApp";
import { FeaturePhone } from "@/screens/phone/FeaturePhone";

type View = "citizen" | "officer" | "phone";

const VIEWS: Array<{ id: View; label: string; note: string }> = [
  { id: "citizen", label: "Citizen", note: "Smartphone" },
  { id: "officer", label: "Officer", note: "Desktop" },
  { id: "phone", label: "No smartphone", note: "USSD & SMS" },
];

const IDS = VIEWS.map((option) => option.id);

function viewFromHash(): View {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return (IDS as string[]).includes(hash) ? (hash as View) : "citizen";
}

export function App() {
  const [locale, setLocale] = React.useState<Locale>("en");
  /* Each audience has its own address, so the three can be sent as three
     links rather than as one link plus an instruction. */
  const [view, setView] = React.useState<View>(viewFromHash);

  React.useEffect(() => {
    const onHashChange = () => setView(viewFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const show = (next: View) => {
    window.location.hash = `/${next}`;
    setView(next);
  };

  const i18n = React.useMemo(() => createTranslate(locale, setLocale), [locale]);

  return (
    <I18nContext.Provider value={i18n}>
      <div className="proto" lang={locale}>
        {/* Prototype chrome — the three audiences the brief asks for, side by
            side. It is not part of any of the three products. */}
        <nav className="proto__tabs" aria-label="Prototype views">
          {VIEWS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={view === option.id}
              onClick={() => show(option.id)}
            >
              <b>{option.label}</b>
              <small>{option.note}</small>
            </button>
          ))}
        </nav>

        <main className="proto__stage">
          {view === "citizen" && (
            <div className="stage">
              <div className="phone">
                <CitizenApp />
              </div>
            </div>
          )}
          {view === "officer" && <OfficerApp />}
          {view === "phone" && <FeaturePhone />}
        </main>
      </div>
    </I18nContext.Provider>
  );
}
