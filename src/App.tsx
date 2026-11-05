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

export function App() {
  const [locale, setLocale] = React.useState<Locale>("en");
  const [view, setView] = React.useState<View>("citizen");

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
              onClick={() => setView(option.id)}
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
