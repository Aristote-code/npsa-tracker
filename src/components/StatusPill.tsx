import { useI18n } from "@/i18n";
import type { StringKey } from "@/i18n/strings";
import type { ApplicationStatus } from "@/types";

/**
 * Colour only where it carries meaning.
 *
 * "In review" is the ordinary state and needs no highlight — making it a
 * coloured pill forced "Action needed" to shout over it. Amber now means one
 * thing: we need something from you.
 */
const MAP: Record<ApplicationStatus, { className: string; key: StringKey }> = {
  "in-review": { className: "pill pill--quiet", key: "status.inReview" },
  "action-needed": { className: "pill pill--action", key: "status.actionNeeded" },
  approved: { className: "pill pill--approved", key: "status.approved" },
};

export function StatusPill({ status }: { status: ApplicationStatus }) {
  const { t } = useI18n();
  const { className, key } = MAP[status];

  return <span className={className}>{t(key)}</span>;
}
