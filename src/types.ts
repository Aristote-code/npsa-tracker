import type { Locale, StringKey } from "@/i18n/strings";

export type ApplicationStatus = "in-review" | "action-needed" | "approved";

export type StageState = "done" | "current" | "paused" | "waiting";

export interface Stage {
  labelKey: StringKey;
  deptKey: StringKey;
  state: StageState;
  /** ISO date the stage completed or started. */
  date?: string;
  /** Typical working days, shown on stages that have not started. */
  typicalDays?: number;
}

export interface SubmittedDocument {
  id: string;
  nameKey: StringKey;
  sentOn: string;
  state: "accepted" | "rejected" | "replaced";
  /** Set once the citizen has sent a replacement. */
  replacedOn?: string;
}

export interface Officer {
  name: string;
  initials: string;
  deptKey: StringKey;
  phone: string;
}

export type OfficerRole = "front-desk" | "processing";

/**
 * What an officer asked for. Reasons are codes, not sentences, so the citizen
 * reads them in their own language the moment they open the app. Free text is
 * carried separately and always shown with the language it was written in.
 */
export interface DocumentRequest {
  documentId: string;
  reasonKeys: StringKey[];
  note?: { text: string; locale: Locale };
  requestedOn: string;
  respondBy: string;
  officer: Officer;
}

/** A replacement the citizen has sent that no officer has looked at yet. */
export interface CitizenResponse {
  documentId: string;
  receivedAt: string;
  replacesSentOn: string;
}

export interface HistoryEvent {
  id: string;
  /** Already-translated label key, with the actor appended at render time. */
  labelKey: StringKey;
  actor: string;
  at: string;
  detail?: string;
}

export interface Application {
  id: string;
  reference: string;
  serviceKey: StringKey;
  citizenName: string;
  citizenInitials: string;
  citizenPhone: string;
  /** Shown before the citizen has proved who they are. */
  citizenPhoneMasked: string;
  /** The language this citizen reads, which is rarely the officer's. */
  citizenLocale: Locale;
  submittedOn: string;
  status: ApplicationStatus;
  stages: Stage[];
  documents: SubmittedDocument[];
  officer: Officer;
  request?: DocumentRequest;
  response?: CitizenResponse;
  expectedBy?: string;
  /** ISO datetime of the last change, shown with every status. */
  updatedAt: string;
  history: HistoryEvent[];
}

export type UploadState =
  | "idle"
  | "checking"
  | "rejected"
  | "ready"
  | "saved"
  | "sending"
  | "received";
