import * as React from "react";
import { Search01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { StatusPill } from "@/components/StatusPill";
import { applications, searchApplications } from "@/data";
import { useI18n } from "@/i18n";
import { formatReference } from "@/reference";
import type { Application, OfficerRole } from "@/types";

type OfficerQueueProps = {
  role: OfficerRole;
  onOpen: (application: Application) => void;
};

export function OfficerQueue({ role, onOpen }: OfficerQueueProps) {
  const { t, since } = useI18n();
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
  const results = searchApplications(query);

  const awaiting = applications.filter((item) => item.status === "action-needed").length;

  return (
    <div className="o-screen">
      <div className="o-head">
        <div>
          <h1>{t("o.title")}</h1>
          <p>{t("o.sub")}</p>
        </div>
        <div className="o-counts">
          <span>
            <strong>{awaiting}</strong>
            {t("o.awaiting")}
          </span>
          <i />
          <span>
            <strong>23</strong>
            {t("o.completed")}
          </span>
        </div>
      </div>

      <div className="o-toolbar">
        <div className="o-search">
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
          {/* Callers ring precisely because they have lost the reference. */}
          <span className="o-search__hint">{t("o.searchHint")}</span>
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
        <table className="o-table">
          <thead>
            <tr>
              <th>{t("o.col.citizen")}</th>
              <th>{t("o.col.application")}</th>
              <th>{t("o.col.stage")}</th>
              <th>{t("o.col.status")}</th>
              <th>{t("o.col.updated")}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((application) => {
              const stage = application.stages.find(
                (item) => item.state === "current" || item.state === "paused",
              );
              return (
                <tr key={application.id} onClick={() => onOpen(application)} tabIndex={0}
                    onKeyDown={(event) => event.key === "Enter" && onOpen(application)}>
                  <td>
                    <span className="o-person">
                      <i>{application.citizenInitials}</i>
                      <span>
                        <b>{application.citizenName}</b>
                        <small className="mono">{application.citizenPhone}</small>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="o-claim">
                      <b className="mono">{formatReference(application.reference)}</b>
                      <small>{t(application.serviceKey)}</small>
                    </span>
                  </td>
                  <td>
                    <span className="o-stage">
                      <b>{stage ? t(stage.labelKey) : "—"}</b>
                      <small>{stage ? t(stage.deptKey) : ""}</small>
                    </span>
                  </td>
                  <td>
                    <StatusPill status={application.status} />
                  </td>
                  <td className="o-when">{since(application.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
