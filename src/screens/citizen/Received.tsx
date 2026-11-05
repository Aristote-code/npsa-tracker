import { Message01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Page } from "@/components/Page";
import * as FancyButton from "@/components/ui/fancy-button";
import { useI18n } from "@/i18n";
import { formatReference } from "@/reference";
import type { Application } from "@/types";

type ReceivedProps = {
  application: Application;
  onDone: () => void;
};

/**
 * Receipt and acceptance are different events. The citizen has finished her
 * task — worth saying plainly — but no officer has accepted anything yet, and
 * blurring the two is what brings people back to the counter angry.
 */
export function Received({ application, onDone }: ReceivedProps) {
  const { t } = useI18n();

  return (
    <Page
      bare
      footer={
        <FancyButton.Root variant="primary" size="medium" onClick={onDone}>
          {t("backToStatus")}
        </FancyButton.Root>
      }
    >
      <div className="done">
        <span className="done__mark" aria-hidden="true">
          <Icon icon={Tick02Icon} size={32} strokeWidth={2.4} />
        </span>
        <h1>{t("receivedTitle")}</h1>
        <p>{t("receivedBody", { name: application.officer.name })}</p>
        <p className="done__quiet">{t("nothingElse")}</p>
      </div>

      <div className="pad" style={{ paddingTop: 4 }}>
        {/* The SMS carries the same promise to a phone that is offline most of
            the day — it is the channel that actually reaches people. */}
        <div className="section sms">
          <h2>{t("smsPreview")}</h2>
          <div className="sms__bubble">{t("smsBody", { ref: formatReference(application.reference) })}</div>
          <span className="sms__from">
            <Icon icon={Message01Icon} size={13} />
            NPSA · 1234
          </span>
        </div>
      </div>
    </Page>
  );
}
