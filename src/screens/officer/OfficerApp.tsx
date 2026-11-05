import * as React from "react";
import { File01Icon, Home01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { signedInOfficer } from "@/data";
import { useI18n } from "@/i18n";
import { OfficerFile } from "@/screens/officer/OfficerFile";
import { OfficerQueue } from "@/screens/officer/OfficerQueue";
import { useApplication } from "@/store";
import type { OfficerRole } from "@/types";

export function OfficerApp() {
  const { t } = useI18n();
  /* The id, not the record: a save has to be visible immediately. */
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<OfficerRole>("front-desk");
  const open = useApplication(openId);

  return (
    <div className="o-app">
      <nav className="rail" aria-label={t("agencyShort")}>
        <span className="brand" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}brand/mark.svg`} alt="" />
        </span>
        <div className="rail__nav">
          <button type="button" className="active" aria-label={t("o.title")}>
            <Icon icon={File01Icon} size={19} />
          </button>
          <button type="button" aria-label={t("agencyShort")}>
            <Icon icon={Home01Icon} size={19} />
          </button>
        </div>
        <span className="rail__profile" title={signedInOfficer.name}>
          {signedInOfficer.initials}
        </span>
      </nav>

      <div className="o-main">
        <header className="o-topbar">
          <span className="o-topbar__who">
            <b>{signedInOfficer.name}</b>
            <span>{t(signedInOfficer.deptKey)}</span>
          </span>

          {/* Prototype control: the permission split only reads as a design
              decision if you can stand on both sides of it. */}
          <div className="o-roleswitch" role="group" aria-label="Role">
            {(["front-desk", "processing"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={role === option}
                onClick={() => setRole(option)}
              >
                {t(option === "processing" ? "o.role.processing" : "o.role.frontDesk")}
              </button>
            ))}
          </div>

          <LanguageSwitcher />
        </header>

        <div className="o-body">
          {open ? (
            <OfficerFile application={open} role={role} onBack={() => setOpenId(null)} />
          ) : (
            <OfficerQueue role={role} onOpen={(application) => setOpenId(application.id)} />
          )}
        </div>
      </div>
    </div>
  );
}
