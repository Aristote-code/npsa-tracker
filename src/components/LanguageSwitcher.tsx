import { LOCALES, useI18n } from "@/i18n";

/**
 * Three languages, one tap each. A dropdown would hide two of them behind a
 * menu, which is the wrong trade for a low-digital-literacy audience.
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="lang" role="group" aria-label="Language / Ururimi / Langue">
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
