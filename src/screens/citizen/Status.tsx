import * as React from "react";
import {
  Alert02Icon,
  Call02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Copy01Icon,
  LockPasswordIcon,
  SecurityCheckIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Page } from "@/components/Page";
import { StatusPill } from "@/components/StatusPill";
import { Stepper } from "@/components/Stepper";
import * as FancyButton from "@/components/ui/fancy-button";
import { useI18n } from "@/i18n";
import { formatReference } from "@/reference";
import type { Application } from "@/types";

type StatusProps = {
  application: Application;
  /** True once the citizen has proved who they are on this device. */
  verified: boolean;
  onBack: () => void;
  onSeeWhatIsNeeded: () => void;
};

/**
 * The public tier. A reference number alone is enough to see this, because
 * the brief's expensive problem is people phoning and queuing for exactly
 * these four facts: stage, department, whether anything is needed from them,
 * and when it was last true.
 */
export function Status({ application, verified, onBack, onSeeWhatIsNeeded }: StatusProps) {
  const { t, d, time, since } = useI18n();
  const [copied, setCopied] = React.useState(false);

  const needsAction = application.status === "action-needed";
  const activeStage = application.stages.find(
    (stage) => stage.state === "current" || stage.state === "paused",
  );

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(formatReference(application.reference));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Not available in every embedded browser; the number is on screen. */
    }
  };

  return (
    <Page onBack={onBack} compactTitle={t(application.serviceKey)}>
      {/* The reference sits with the title because it is what people read out
          on the phone and quote at the counter. */}
      <div className="page-head">
        <h1>{t(application.serviceKey)}</h1>
        <div className="ref-row">
          <b className="mono">{formatReference(application.reference)}</b>
          <button type="button" className="ref-copy" onClick={copyReference} data-copied={copied}>
            <Icon icon={copied ? Tick02Icon : Copy01Icon} size={14} strokeWidth={2} />
            {copied ? t("copied") : t("copyReference")}
          </button>
        </div>
      </div>

      {/* Plain sentence first, stepper underneath as corroboration. */}
      <div className="card hero">
        <div className="hero__eyebrow">{t("whereItIs")}</div>
        <StatusPill status={application.status} />
        <p className="hero__answer">
          {needsAction
            ? t("pausedWith")
            : t("nowWith", { dept: activeStage ? t(activeStage.deptKey) : "" })}
        </p>
        <p className="hero__meta">
          <Icon icon={Clock01Icon} size={14} />
          {application.expectedBy ? (
            <span>
              {t("expectedBy")} <b>{d(application.expectedBy)}</b>
            </span>
          ) : (
            <span>{t("expectedAfter")}</span>
          )}
        </p>
      </div>

      <div className="section">
        <h2>{t("whatToDo")}</h2>
        {needsAction ? (
          <div className="todo todo--act">
            <span className="todo__icon">
              <Icon icon={Alert02Icon} size={21} strokeWidth={2} />
            </span>
            <div className="todo__body">
              <strong>{t("actionTitle")}</strong>
              <p>{t("actionSub")}</p>
              {application.request && (
                <span className="todo__due">
                  <Icon icon={Clock01Icon} size={14} strokeWidth={2} />
                  {t("replyBefore", { date: d(application.request.respondBy) })}
                </span>
              )}
              {/* Status is open; the document itself is not. */}
              {!verified && (
                <span className="todo__locked">
                  <Icon icon={LockPasswordIcon} size={13} />
                  {t("actionLocked")}
                </span>
              )}
              <FancyButton.Root variant="primary" size="medium" onClick={onSeeWhatIsNeeded}>
                {t("seeWhatIsNeeded")}
              </FancyButton.Root>
            </div>
          </div>
        ) : (
          <div className="todo todo--calm">
            <span className="todo__icon">
              <Icon icon={CheckmarkCircle02Icon} size={21} strokeWidth={2} />
            </span>
            <div className="todo__body">
              <strong>{t("nothingToDo")}</strong>
              <p>{t("nothingToDoSub")}</p>
            </div>
          </div>
        )}
      </div>

      <div className="section">
        <h2>{t("progress")}</h2>
        <div className="card card--flush">
          <Stepper stages={application.stages} />
        </div>
      </div>

      <div className="section">
        <h2>{t("whoIsHandling")}</h2>
        <div className="card officer">
          <div className="officer__who">
            <span className="officer__avatar" aria-hidden="true">
              {application.officer.initials}
            </span>
            <div>
              <strong>{application.officer.name}</strong>
              <span>{t(application.officer.deptKey)}</span>
            </div>
          </div>
          <span className="officer__hours">
            <Icon icon={Clock01Icon} size={13} />
            {t("officeHours")}
          </span>
          <FancyButton.Root variant="basic" size="medium" asChild>
            <a href={`tel:${application.officer.phone}`}>
              <FancyButton.Icon as="span">
                <Icon icon={Call02Icon} size={18} />
              </FancyButton.Icon>
              {t("callOffice")}
            </a>
          </FancyButton.Root>
        </div>
      </div>

      <div className="notice">
        <Icon icon={SecurityCheckIcon} size={18} />
        <div>
          <strong>{t("freeServiceTitle")}</strong>
          <p>{t("freeServiceBody")}</p>
        </div>
      </div>

      {/* Every status carries the moment it was true, so a cached or stale
          screen can never pass itself off as live. */}
      <div className="updated">
        <Icon icon={Clock01Icon} size={13} />
        {t("asOf", { time: time(application.updatedAt) })} · {since(application.updatedAt)}
      </div>
    </Page>
  );
}
