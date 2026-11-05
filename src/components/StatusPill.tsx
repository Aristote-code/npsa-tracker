import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { useI18n } from "@/i18n";
import type { StringKey } from "@/i18n/strings";
import type { ApplicationStatus } from "@/types";

const MAP: Record<ApplicationStatus, { className: string; icon: typeof Alert02Icon; key: StringKey }> = {
  "in-review": { className: "pill pill--review", icon: Clock01Icon, key: "status.inReview" },
  "action-needed": { className: "pill pill--action", icon: Alert02Icon, key: "status.actionNeeded" },
  approved: { className: "pill pill--approved", icon: CheckmarkCircle02Icon, key: "status.approved" },
};

export function StatusPill({ status }: { status: ApplicationStatus }) {
  const { t } = useI18n();
  const { className, icon, key } = MAP[status];

  return (
    <span className={className}>
      <Icon icon={icon} size={13} strokeWidth={2} />
      {t(key)}
    </span>
  );
}
