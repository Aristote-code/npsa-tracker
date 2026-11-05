import { Alert02Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n";
import type { Stage, StageState } from "@/types";

const DOT: Record<StageState, string> = {
  done: "step__dot step__dot--done",
  current: "step__dot step__dot--current",
  paused: "step__dot step__dot--paused",
  waiting: "step__dot step__dot--waiting",
};

/**
 * Vertical, because five department names do not fit across a 320px screen
 * without truncating the one piece of information the citizen came for.
 */
export function Stepper({ stages }: { stages: Stage[] }) {
  const { t, d } = useI18n();
  const nextUp = stages.findIndex((stage) => stage.state === "waiting");

  return (
    <ol className="steps" aria-label={t("progress")}>
      {stages.map((stage, index) => (
          <li key={stage.labelKey} className={`step step--${stage.state}`}>
            <div className="step__rail" aria-hidden="true">
              <span className={DOT[stage.state]}>
                {stage.state === "done" && <Icon icon={Tick02Icon} size={15} strokeWidth={2.4} />}
                {stage.state === "paused" && <Icon icon={Alert02Icon} size={14} strokeWidth={2.2} />}
                {stage.state === "current" && <span className="step__dot-core" />}
                {stage.state === "waiting" && <i />}
              </span>
              <span
                className={`step__line${stage.state === "done" ? " step__line--done" : ""}`}
              />
            </div>

            <div className="step__body">
              <strong>{t(stage.labelKey)}</strong>
              <span className="step__dept">{t(stage.deptKey)}</span>
              <span className={`step__when step__when--${stage.state}`}>
                {stage.state === "done" && stage.date && `${t("stageDone")} · ${d(stage.date)}`}
                {stage.state === "current" &&
                  `${t("stageNow")}${stage.date ? ` · ${t("startedOn", { date: d(stage.date) })}` : ""}`}
                {stage.state === "paused" && t("stagePaused")}
                {stage.state === "waiting" && index === nextUp && stage.typicalDays
                  ? stage.typicalDays === 1
                    ? t("usuallyTakesOne")
                    : t("usuallyTakes", { days: stage.typicalDays })
                  : null}
              </span>
            </div>
          </li>
      ))}
    </ol>
  );
}
