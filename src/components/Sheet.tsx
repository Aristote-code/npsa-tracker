import * as React from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n";

type SheetProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * Bottom sheet for a short, reversible choice. Escape closes it and focus
 * returns to whatever opened it.
 */
export function Sheet({ open, title, onClose, children }: SheetProps) {
  const { t } = useI18n();
  const panel = React.useRef<HTMLDivElement>(null);
  const opener = React.useRef<Element | null>(null);

  React.useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    panel.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet-layer">
      <button type="button" className="sheet-scrim" aria-label={t("close")} onClick={onClose} />
      <div
        ref={panel}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header>
          <strong>{title}</strong>
          <button type="button" onClick={onClose} aria-label={t("close")}>
            <Icon icon={Cancel01Icon} size={18} />
          </button>
        </header>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  );
}
