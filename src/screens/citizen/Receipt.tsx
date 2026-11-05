import * as React from "react";
import {
  Copy01Icon,
  Message01Icon,
  PrinterIcon,
  SecurityCheckIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Page } from "@/components/Page";
import * as FancyButton from "@/components/ui/fancy-button";
import { useI18n } from "@/i18n";
import { formatReference } from "@/reference";
import type { Application } from "@/types";

type ReceiptProps = {
  application: Application;
  onBack: () => void;
  onTrack: () => void;
};

/**
 * The moment the file number is issued.
 *
 * Everything else in this service depends on the citizen still having this
 * number weeks later, so the number is the screen rather than a line of
 * confirmation copy — it is set large, grouped in threes to be read aloud,
 * repeated on a paper slip for the counter, and sent by SMS so it survives a
 * lost phone or a cleared browser.
 */
export function Receipt({ application, onBack, onTrack }: ReceiptProps) {
  const { t, d } = useI18n();
  const [copied, setCopied] = React.useState(false);
  const reference = formatReference(application.reference);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* The number is on screen; copying is a convenience. */
    }
  };

  return (
    <Page
      onBack={onBack}
      compactTitle={t("receiptTitle")}
      footer={
        <FancyButton.Root variant="primary" size="medium" onClick={onTrack}>
          {t("trackThis")}
        </FancyButton.Root>
      }
    >
      <div className="receipt-head">
        <span className="done__mark" aria-hidden="true">
          <Icon icon={Tick02Icon} size={28} strokeWidth={2.4} />
        </span>
        <h1>{t("receiptTitle")}</h1>
        <p>{t(application.serviceKey)}</p>
      </div>

      {/* The number is the screen. */}
      <div className="number-card">
        <span className="number-card__label">{t("yourFileNumber")}</span>
        <strong className="number-card__value mono">{reference}</strong>
        <button type="button" className="ref-copy" onClick={copy} data-copied={copied}>
          <Icon icon={copied ? Tick02Icon : Copy01Icon} size={14} strokeWidth={2} />
          {copied ? t("copied") : t("copyReference")}
        </button>
      </div>

      <div className="notice">
        <Icon icon={SecurityCheckIcon} size={18} />
        <div>
          <strong>{t("writeItDown")}</strong>
          <p>{t("writeItDownBody")}</p>
        </div>
      </div>

      {/* Paper is the most reliable storage a citizen without a smartphone
          has, so the counter hands over the same number on a printed slip. */}
      <div className="section">
        <h2>{t("paperSlipTitle")}</h2>
        <div className="slip">
          <div className="slip__head">
            <b>{t("agencyShort")}</b>
            <span>{t(application.serviceKey)}</span>
          </div>
          <div className="slip__number mono">{reference}</div>
          <dl className="slip__meta">
            <div>
              <dt>{t("issuedOn")}</dt>
              <dd>{d(application.submittedOn)}</dd>
            </div>
            <div>
              <dt>{t("officeLabel")}</dt>
              <dd>{t("officeName")}</dd>
            </div>
          </dl>
          <div className="slip__foot">*123# · {t("freeServiceTitle")}</div>
        </div>
        <p className="field__hint">{t("paperSlipBody")}</p>
        <FancyButton.Root variant="basic" size="small" onClick={() => window.print()}>
          <FancyButton.Icon as="span">
            <Icon icon={PrinterIcon} size={16} />
          </FancyButton.Icon>
          {t("printSlip")}
        </FancyButton.Root>
      </div>

      <div className="section">
        <h2>{t("whatNext")}</h2>
        <div className="card">
          <ol className="fixlist">
            {(["next.1", "next.2", "next.3"] as const).map((key, index) => (
              <li key={key}>
                <span aria-hidden="true">{index + 1}</span>
                <p>{t(key)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* The same number again, on the channel that survives a lost phone. */}
      <div className="section sms">
        <h2>{t("smsPreview")}</h2>
        <div className="sms__bubble">{t("receiptSmsBody", { ref: reference })}</div>
        <span className="sms__from">
          <Icon icon={Message01Icon} size={13} />
          NPSA · 1234
        </span>
      </div>
    </Page>
  );
}
