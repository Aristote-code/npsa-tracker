import { Call02Icon, SecurityCheckIcon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Page } from "@/components/Page";
import * as FancyButton from "@/components/ui/fancy-button";
import { useI18n } from "@/i18n";

/**
 * The answer to "some citizens pay intermediaries": a named, official, free
 * alternative, stated plainly on the screen where people get stuck.
 */
export function Assisted({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();

  return (
    <Page onBack={onBack} compactTitle={t("assistedTitle")}>
      <div className="page-head">
        <h1>{t("assistedTitle")}</h1>
        <p>{t("assistedBody")}</p>
      </div>

      <div className="card">
        <ol className="fixlist">
          {(["assisted.1", "assisted.2", "assisted.3"] as const).map((key, index) => (
            <li key={key}>
              <span aria-hidden="true">{index + 1}</span>
              <p>{t(key)}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="notice">
        <Icon icon={SecurityCheckIcon} size={18} />
        <div>
          <strong>{t("assistedFree")}</strong>
          <p>{t("freeServiceBody")}</p>
        </div>
      </div>

      <FancyButton.Root variant="basic" size="medium" asChild>
        <a href="tel:+250788300100">
          <FancyButton.Icon as="span">
            <Icon icon={Call02Icon} size={18} />
          </FancyButton.Icon>
          {t("callOffice")}
        </a>
      </FancyButton.Root>
    </Page>
  );
}
