import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  File01Icon,
  Image01Icon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Page } from "@/components/Page";
import * as FancyButton from "@/components/ui/fancy-button";
import { useI18n } from "@/i18n";
import type { Application } from "@/types";

type IssueProps = {
  application: Application;
  onBack: () => void;
  onReplace: () => void;
};

export function Issue({ application, onBack, onReplace }: IssueProps) {
  const { t, d, languageName } = useI18n();
  const request = application.request;
  const document = application.documents.find((item) => item.id === request?.documentId);

  return (
    <Page
      onBack={onBack}
      compactTitle={t("issueTitle")}
      footer={
        <FancyButton.Root variant="primary" size="medium" onClick={onReplace}>
          {t("replaceDocument")}
        </FancyButton.Root>
      }
    >
      <div className="page-head">
        <h1>{t("issueTitle")}</h1>
        {document && (
          <p>
            {t(document.nameKey)} · {t("issueSentOn", { date: d(document.sentOn) })}
          </p>
        )}
      </div>

      {/* The citizen's own photo with the unusable area marked. Telling
          someone a document is "unclear" without showing where is how the
          same rejection happens twice. */}
      <div className="evidence" role="img" aria-label={t("whyRejected")}>
        <div className="evidence__paper">
          <i style={{ top: "14%" }} />
          <i style={{ top: "28%", right: "34%" }} />
          <i style={{ top: "42%" }} />
          <i style={{ top: "56%", right: "22%" }} />
        </div>
        <span
          className="evidence__zone"
          style={{ left: "50%", right: "14%", bottom: "18%", height: "20%" }}
        />
        <span className="evidence__tag">
          <Icon icon={Image01Icon} size={13} />
          {document ? t(document.nameKey) : ""}
        </span>
      </div>

      <div className="section">
        <h2>{t("whyRejected")}</h2>
        <div className="card reason">
          {/* Reason codes, not sentences: already written in all three
              languages before the officer ever clicked. */}
          <ul className="reasons">
            {request?.reasonKeys.map((key) => (
              <li key={key}>
                <Icon icon={Alert02Icon} size={17} strokeWidth={2} />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>

          {request?.note && (
            <div className="note">
              <span className="note__label">
                {t("officerNote")} ·{" "}
                <em>{t("noteWrittenIn", { language: languageName(request.note.locale) })}</em>
              </span>
              <p lang={request.note.locale}>{request.note.text}</p>
            </div>
          )}

          <span className="reason__by">
            <Icon icon={UserIcon} size={13} />
            {t("checkedBy", {
              name: application.officer.name,
              dept: t(application.officer.deptKey),
            })}
          </span>
        </div>
      </div>

      {/* Pass/fail pairs rather than neutral advice: what counts, and what
          gets a photo sent back. Stated before she opens the camera. */}
      <div className="section">
        <h2>{t("reqTitle")}</h2>
        <div className="card">
          <ul className="reqs">
            {(["req.ok.1", "req.ok.2", "req.ok.3"] as const).map((key) => (
              <li className="reqs__ok" key={key}>
                <Icon icon={Tick02Icon} size={16} strokeWidth={2.6} />
                <span>{t(key)}</span>
              </li>
            ))}
            {(["req.no.1", "req.no.2"] as const).map((key) => (
              <li className="reqs__no" key={key}>
                <Icon icon={Cancel01Icon} size={16} strokeWidth={2.6} />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* People assume a rejected document means starting again. */}
      <div className="section">
        <h2>{t("otherDocsFine")}</h2>
        <div className="card">
          {application.documents.map((item) => {
            const bad = item.state === "rejected";
            return (
              <div className="doc-row" key={item.id}>
                <span className={`doc-row__icon${bad ? " doc-row__icon--bad" : ""}`}>
                  <Icon icon={bad ? Image01Icon : File01Icon} size={18} />
                </span>
                <span className="doc-row__text">
                  <strong>{t(item.nameKey)}</strong>
                  <span>{d(item.sentOn)}</span>
                </span>
                <span className={`doc-row__flag doc-row__flag--${bad ? "bad" : "ok"}`}>
                  <Icon icon={bad ? Alert02Icon : CheckmarkCircle02Icon} size={19} strokeWidth={2} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
}
