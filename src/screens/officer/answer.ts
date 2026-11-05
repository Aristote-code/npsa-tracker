import type { Translate } from "@/i18n";
import { formatReference } from "@/reference";
import type { Application } from "@/types";

/**
 * The one line Aline reads back to a caller.
 *
 * It is assembled from the same strings the citizen app renders, so the
 * counter and the phone never tell two different stories — and so she does
 * not have to read a table and synthesise an answer while someone waits.
 */
export function citizenAnswer(application: Application, i18n: Translate): string {
  const { t, d } = i18n;

  const index = application.stages.findIndex(
    (stage) => stage.state === "current" || stage.state === "paused",
  );
  const stage = index >= 0 ? application.stages[index] : application.stages.at(-1)!;
  const position = `${index >= 0 ? index + 1 : application.stages.length}/${application.stages.length}`;

  const parts = [
    `${formatReference(application.reference)} — ${t(application.serviceKey)}.`,
    `${position}: ${t(stage.labelKey)} (${t(stage.deptKey)}).`,
  ];

  if (application.request) {
    const document = application.documents.find((item) => item.id === application.request!.documentId);
    const reasons = application.request.reasonKeys.map((key) => t(key).toLowerCase()).join("; ");
    parts.push(
      `${t("status.actionNeeded")}: ${document ? t(document.nameKey) : ""} — ${reasons}.`,
      `${t("replyBefore", { date: d(application.request.respondBy) })}.`,
    );
  } else if (application.expectedBy) {
    parts.push(`${t("nothingToDo")}. ${t("expectedBy")} ${d(application.expectedBy)}.`);
  } else {
    parts.push(`${t("nothingToDo")}.`);
  }

  // The "as of" time is carried by the panel's header band, not by the
  // sentence: what is displayed and what the Copy button puts on the
  // clipboard have to be the same string, or this panel is lying about
  // being what the citizen sees.
  return parts.join(" ");
}
