import * as React from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n";

type SidePanelProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * Officer actions open beside the file, never on top of it: Aline needs the
 * citizen's details in view while she writes about them. Only one panel is
 * ever open, so dialogs never stack.
 */
export function SidePanel({ open, title, onClose, children, footer }: SidePanelProps) {
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
    <div className="o-panel-layer">
      <button type="button" className="o-panel-scrim" aria-label={t("close")} onClick={onClose} />
      <aside
        ref={panel}
        className="o-panel"
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
        <div className="o-panel__body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </aside>
    </div>
  );
}
