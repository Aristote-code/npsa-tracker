import * as React from "react";
import { Search01Icon } from "@hugeicons/core-free-icons";

import { avatarColour } from "@/avatar";
import { Icon } from "@/components/Icon";
import { StatusPill } from "@/components/StatusPill";
import { searchApplications } from "@/data";
import { useI18n } from "@/i18n";
import { formatReference } from "@/reference";
import { useStore } from "@/store";
import type { Application, OfficerRole } from "@/types";

type OfficerQueueProps = {
  role: OfficerRole;
  onOpen: (application: Application) => void;
};

export function OfficerQueue({ role, onOpen }: OfficerQueueProps) {
  const { t, since } = useI18n();
  const { applications } = useStore();
  const [query, setQuery] = React.useState("");
  const search = React.useRef<HTMLInputElement>(null);

  // Fifty inquiries a day: "/" puts the cursor in the search box from
  // anywhere, the way every tool these officers already use behaves.
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.target instanceof HTMLInputElement) return;
      event.preventDefault();
      search.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = searchApplications(query, applications);
  const awaiting = applications.filter((item) => item.status === "action-needed").length;
  const done = applications.filter((item) => item.status === "approved").length;

  return (
    <div className="o-screen">
      <div className="o-head">
        <h1>{t("o.title")}</h1>
        <div className="queue-counts">
          <span>
            <strong>{awaiting}</strong> {t("o.awaiting")}
          </span>
          <i />
          <span>
            <strong>{done + 21}</strong> {t("o.completed")}
          </span>
        </div>
      </div>

      <div className="o-toolbar">
        <div className="o-search__control">
          <Icon icon={Search01Icon} size={17} />
          <input
            ref={search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("o.search")}
            aria-label={t("o.search")}
          />
          <kbd>/</kbd>
        </div>
        <span className={`o-role o-role--${role}`}>
          {t(role === "processing" ? "o.role.processing" : "o.role.frontDesk")}
        </span>
      </div>

      {results.length === 0 ? (
        <div className="o-empty">
          <strong>{t("o.noResults", { q: query })}</strong>
          <p>{t("o.noResultsHint")}</p>
        </div>
      ) : (
        /* Geometry carried over from the source design: every cell draws its
           top and left border only, the last column adds a right and the last
           row a bottom, so the grid never doubles a line. */
        <div className="queue-table">
          <div className="queue-row queue-table-head">
            <span>{t("o.col.citizen")}</span>
            <span>{t("o.col.application")}</span>
            <span>{t("o.col.stage")}</span>
            <span>{t("o.col.status")}</span>
            <span>{t("o.col.updated")}</span>
          </div>

          {results.map((application) => {
            const stage =
              application.stages.find(
                (item) => item.state === "current" || item.state === "paused",
              ) ?? application.stages[application.stages.length - 1];

            return (
              <button
                type="button"
                className="queue-row"
                key={application.id}
                onClick={() => onOpen(application)}
              >
                <span className="citizen-cell">
                  <i style={{ backgroundImage: avatarColour(application.citizenName) }}>
                    {application.citizenInitials}
                  </i>
                  <span>
                    <b>{application.citizenName}</b>
                    <small className="mono">{application.citizenPhone}</small>
                  </span>
                </span>
                <span className="claim-cell">
                  <b className="mono">{formatReference(application.reference)}</b>
                  <small>{t(application.serviceKey)}</small>
                </span>
                <span className="claim-cell">
                  <b>{t(stage.labelKey)}</b>
                  <small>{t(stage.deptKey)}</small>
                </span>
                <span>
                  <StatusPill status={application.status} />
                </span>
                <span className="o-when">{since(application.updatedAt)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
