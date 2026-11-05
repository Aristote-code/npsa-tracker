import * as React from "react";
import {
  Alert02Icon,
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  File01Icon,
  Image01Icon,
  LockPasswordIcon,
  Tick02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { SidePanel } from "@/components/SidePanel";
import { StatusPill } from "@/components/StatusPill";
import * as FancyButton from "@/components/ui/fancy-button";
import { createTranslate, useI18n } from "@/i18n";
import { formatReference } from "@/reference";
import type { StringKey } from "@/i18n/strings";
import { citizenAnswer } from "@/screens/officer/answer";
import type { Application, OfficerRole } from "@/types";

const REASON_KEYS: StringKey[] = [
  "reason.tooDark",
  "reason.cornersMissing",
  "reason.unsigned",
  "reason.expired",
  "reason.wrongDocument",
];

type Panel = "none" | "status" | "request" | "response";

type OfficerFileProps = {
  application: Application;
  role: OfficerRole;
  onBack: () => void;
};

export function OfficerFile({ application, role, onBack }: OfficerFileProps) {
  const i18n = useI18n();
  const { t, d, time, since } = i18n;

  const [panel, setPanel] = React.useState<Panel>("none");
  const [assisted, setAssisted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<"documents" | "history">("documents");

  const answer = citizenAnswer(application, i18n);
  const canChange = role === "processing";

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* The sentence is on screen; copying is a convenience. */
    }
  };

  const announce = (message: string) => {
    setPanel("none");
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  return (
    <div className="o-screen o-file">
      <button type="button" className="o-back" onClick={onBack}>
        <Icon icon={ArrowLeft02Icon} size={16} />
        {t("o.backToList")}
      </button>

      <header className="o-file__head">
        <span className="o-person o-person--lg">
          <i>{application.citizenInitials}</i>
          <span>
            <b>{application.citizenName}</b>
            <small>
              <span className="mono">{formatReference(application.reference)}</span> · {t(application.serviceKey)}
            </small>
          </span>
        </span>
        <div className="o-file__meta">
          <span>
            {t("o.citizenPhone")} <b className="mono">{application.citizenPhone}</b>
          </span>
          <span>
            {t("o.lastUpdate")} <b>{since(application.updatedAt)}</b>
          </span>
          <StatusPill status={application.status} />
        </div>
      </header>

      {assisted && (
        <div className="o-assisted">
          <Icon icon={UserGroupIcon} size={17} />
          <div>
            <strong>{t("o.assistedTitle")}</strong>
            <p>{t("o.assistedBody")}</p>
          </div>
          <button type="button" onClick={() => setAssisted(false)}>
            {t("o.endAssisted")}
          </button>
        </div>
      )}

      {/* Aline's job is to give an answer in seconds, not to read a table and
          assemble one. This is the citizen's own wording, ready to read out. */}
      <section className="o-answer">
        <div className="o-answer__head">
          <strong>{t("o.answer")}</strong>
          <span>{t("o.answerHint")}</span>
        </div>
        <p lang={application.citizenLocale === "rw" ? undefined : application.citizenLocale}>
          {answer}
        </p>
        <button type="button" className="o-copy" onClick={copyAnswer} data-copied={copied}>
          <Icon icon={copied ? Tick02Icon : Copy01Icon} size={14} strokeWidth={2} />
          {copied ? t("o.answerCopied") : t("o.copyAnswer")}
        </button>
      </section>

      <div className="o-cols">
        <div className="o-col">
          {/* Tabs are right for Aline and wrong for the citizen: she is an
              expert user doing this fifty times a day, and a tab keeps the
              view addressable for a colleague she hands the file to. */}
          <section className="o-block">
            <div className="o-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "documents"}
                onClick={() => setTab("documents")}
              >
                {t("o.documents")}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "history"}
                onClick={() => setTab("history")}
              >
                {t("o.timeline")}
              </button>
            </div>

            {tab === "documents" ? (
              <div className="o-tabpanel" role="tabpanel">
                {application.documents.map((document) => {
              const bad = document.state === "rejected";
              const replaced = document.state === "replaced";
              return (
                <div className="doc-row" key={document.id}>
                  <span className={`doc-row__icon${bad ? " doc-row__icon--bad" : ""}`}>
                    <Icon icon={bad || replaced ? Image01Icon : File01Icon} size={18} />
                  </span>
                  <span className="doc-row__text">
                    <strong>{t(document.nameKey)}</strong>
                    <span>
                      {replaced && document.replacedOn
                        ? t("o.response.received", { date: d(document.replacedOn) })
                        : d(document.sentOn)}
                    </span>
                  </span>
                  <span className={`doc-row__flag doc-row__flag--${bad ? "bad" : "ok"}`}>
                    <Icon
                      icon={bad ? Alert02Icon : CheckmarkCircle02Icon}
                      size={19}
                      strokeWidth={2}
                    />
                  </span>
                </div>
              );
            })}
              </div>
            ) : (
              <div className="o-tabpanel" role="tabpanel">
                <ol className="o-history">
              {application.history.map((event) => (
                <li key={event.id}>
                  <span className="o-history__dot" aria-hidden="true" />
                  <div>
                    <strong>
                      {t(event.labelKey)}
                      {event.detail ? ` — ${t(event.detail as StringKey)}` : ""}
                    </strong>
                    <small>
                      {event.actor} · {d(event.at)} {time(event.at)}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
              </div>
            )}
          </section>
        </div>

        <aside className="o-col o-actions">
          <h2>{t("o.actions")}</h2>

          <FancyButton.Root
            variant={canChange ? "primary" : "basic"}
            size="medium"
            onClick={() => setPanel("status")}
          >
            {t("o.updateStatus")}
          </FancyButton.Root>

          <FancyButton.Root variant="basic" size="medium" onClick={() => setPanel("request")}>
            {t("o.requestDocument")}
          </FancyButton.Root>

          {application.response && (
            <FancyButton.Root variant="basic" size="medium" onClick={() => setPanel("response")}>
              {t("o.viewResponse")}
            </FancyButton.Root>
          )}

          <FancyButton.Root variant="basic" size="medium" onClick={() => setAssisted(true)}>
            <FancyButton.Icon as="span">
              <Icon icon={UserGroupIcon} size={18} />
            </FancyButton.Icon>
            {t("o.startAssisted")}
          </FancyButton.Root>

          {/* The brief never defines officer permissions, so the prototype
              proposes a split and shows it rather than assuming it away. */}
          <p className="o-rolenote">
            <Icon icon={LockPasswordIcon} size={14} />
            {t("o.roleNote")}
          </p>
        </aside>
      </div>

      <StatusPanel
        open={panel === "status"}
        application={application}
        canChange={canChange}
        onClose={() => setPanel("none")}
        onSaved={(stage) => announce(t("h.stageChanged", { stage }))}
      />

      <RequestPanel
        open={panel === "request"}
        application={application}
        onClose={() => setPanel("none")}
        onSent={() => announce(t("o.request.sent", { name: application.citizenName }))}
      />

      <ResponsePanel
        open={panel === "response"}
        application={application}
        onClose={() => setPanel("none")}
        onDecided={(message) => announce(message)}
      />

      {toast && (
        <div className="o-toast" role="status">
          <Icon icon={CheckmarkCircle02Icon} size={17} strokeWidth={2} />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function StatusPanel({
  open,
  application,
  canChange,
  onClose,
  onSaved,
}: {
  open: boolean;
  application: Application;
  canChange: boolean;
  onClose: () => void;
  onSaved: (stage: string) => void;
}) {
  const { t } = useI18n();
  const [target, setTarget] = React.useState(application.stages[2].labelKey);

  return (
    <SidePanel
      open={open}
      title={t("o.status.title")}
      onClose={onClose}
      footer={
        <FancyButton.Root
          variant="primary"
          size="medium"
          disabled={!canChange}
          onClick={() => onSaved(t(target))}
        >
          {t("o.status.save")}
        </FancyButton.Root>
      }
    >
      {!canChange && (
        <div className="o-denied">
          <Icon icon={LockPasswordIcon} size={17} />
          <span>{t("o.permissionDenied")}</span>
        </div>
      )}

      <fieldset className="o-fieldset" disabled={!canChange}>
        <legend>{t("o.status.moveTo")}</legend>
        {application.stages.map((stage) => (
          <label className="o-radio" key={stage.labelKey}>
            <input
              type="radio"
              name="stage"
              checked={target === stage.labelKey}
              onChange={() => setTarget(stage.labelKey)}
            />
            <span>
              <b>{t(stage.labelKey)}</b>
              <small>{t(stage.deptKey)}</small>
            </span>
          </label>
        ))}
      </fieldset>

      <p className="o-hint">{t("o.status.note")}</p>
    </SidePanel>
  );
}

/* ------------------------------------------------------------------------ */

function RequestPanel({
  open,
  application,
  onClose,
  onSent,
}: {
  open: boolean;
  application: Application;
  onClose: () => void;
  onSent: () => void;
}) {
  const { t, d, languageName, locale } = useI18n();
  const [documentId, setDocumentId] = React.useState(application.documents[0].id);
  const [reasons, setReasons] = React.useState<StringKey[]>(["reason.tooDark"]);
  const [note, setNote] = React.useState("");
  const [due, setDue] = React.useState("2026-11-25");

  // The preview is rendered with the citizen's own dictionary, which is how
  // Aline can see that her reason codes land in Kinyarwanda or French.
  const asCitizen = React.useMemo(
    () => createTranslate(application.citizenLocale, () => {}),
    [application.citizenLocale],
  );

  const chosen = application.documents.find((item) => item.id === documentId);

  const toggle = (key: StringKey) =>
    setReasons((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );

  return (
    <SidePanel
      open={open}
      title={t("o.request.title")}
      onClose={onClose}
      footer={
        <FancyButton.Root
          variant="primary"
          size="medium"
          disabled={reasons.length === 0}
          onClick={onSent}
        >
          {t("o.request.send")}
        </FancyButton.Root>
      }
    >
      <div className="o-field">
        <label htmlFor="which">{t("o.request.which")}</label>
        <select
          id="which"
          className="o-select"
          value={documentId}
          onChange={(event) => setDocumentId(event.target.value)}
        >
          {application.documents.map((document) => (
            <option key={document.id} value={document.id}>
              {t(document.nameKey)}
            </option>
          ))}
        </select>
      </div>

      <div className="o-field">
        <label>{t("o.request.why")}</label>
        <p className="o-hint">{t("o.request.whyHint")}</p>
        <div className="o-checks">
          {REASON_KEYS.map((key) => (
            <label className="o-check" key={key}>
              <input type="checkbox" checked={reasons.includes(key)} onChange={() => toggle(key)} />
              <span>{t(key)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="o-field">
        <label htmlFor="note">
          {t("o.request.note")} <em>{t("o.request.optional")}</em>
        </label>
        <textarea
          id="note"
          className="o-textarea"
          rows={3}
          value={note}
          placeholder={t("o.request.notePlaceholder")}
          onChange={(event) => setNote(event.target.value)}
        />
        <p className="o-hint">{t("o.request.noteLang", { language: languageName(locale) })}</p>
      </div>

      <div className="o-field">
        <label htmlFor="due">{t("o.request.due")}</label>
        <input
          id="due"
          type="date"
          className="o-select"
          value={due}
          onChange={(event) => setDue(event.target.value)}
        />
      </div>

      <div className="o-preview">
        <span className="o-preview__label">
          {t("o.request.preview", { language: languageName(application.citizenLocale) })}
        </span>
        <div className="o-preview__card" lang={application.citizenLocale}>
          <strong>{asCitizen.t("issueTitle")}</strong>
          <small>{chosen ? asCitizen.t(chosen.nameKey) : ""}</small>
          <ul>
            {reasons.map((key) => (
              <li key={key}>{asCitizen.t(key)}</li>
            ))}
          </ul>
          {note && (
            <p className="o-preview__note">
              <em>{asCitizen.t("noteWrittenIn", { language: languageName(locale) })}</em>
              {note}
            </p>
          )}
          <span className="o-preview__due">
            {asCitizen.t("replyBefore", { date: asCitizen.d(due) })}
          </span>
        </div>
      </div>
    </SidePanel>
  );
}

/* ------------------------------------------------------------------------ */

function ResponsePanel({
  open,
  application,
  onClose,
  onDecided,
}: {
  open: boolean;
  application: Application;
  onClose: () => void;
  onDecided: (message: string) => void;
}) {
  const { t, d } = useI18n();
  const response = application.response;
  const document = application.documents.find((item) => item.id === response?.documentId);

  return (
    <SidePanel
      open={open}
      title={t("o.response.title")}
      onClose={onClose}
      footer={
        <>
          <FancyButton.Root
            variant="success"
            size="medium"
            onClick={() => onDecided(t("o.response.accept"))}
          >
            {t("o.response.accept")}
          </FancyButton.Root>
          <FancyButton.Root
            variant="basic"
            size="medium"
            onClick={() => onDecided(t("o.response.reject"))}
          >
            {t("o.response.reject")}
          </FancyButton.Root>
        </>
      }
    >
      {response && (
        <>
          <div className="preview__frame" role="img" aria-label={t("o.response.title")}>
            <div className="preview__paper">
              <i style={{ top: "14%" }} />
              <i style={{ top: "28%", right: "34%" }} />
              <i style={{ top: "42%" }} />
              <i style={{ top: "56%", right: "22%" }} />
              <i className="sig" style={{ top: "74%" }} />
            </div>
          </div>
          <div className="o-field">
            <strong>{document ? t(document.nameKey) : ""}</strong>
            <span className="o-hint">{t("o.response.received", { date: d(response.receivedAt) })}</span>
            <span className="o-hint">
              {t("o.response.replaces", { date: d(response.replacesSentOn) })}
            </span>
          </div>
          {/* The brief's "1 in 4 delayed" number is made of files that went
              round twice on the same vague wording. */}
          <p className="o-hint o-hint--warn">{t("o.response.rejectHint")}</p>
        </>
      )}
    </SidePanel>
  );
}
