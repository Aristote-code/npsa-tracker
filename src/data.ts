import { normalizeReference } from "@/reference";
import type { Application, Officer, OfficerRole } from "@/types";

/** The officer signed in to the desktop side of the prototype. */
export const signedInOfficer: Officer & { role: OfficerRole } = {
  name: "Aline Mukiza",
  initials: "A",
  deptKey: "dept.records",
  phone: "+250788300100",
  role: "front-desk",
};

const records: Officer = {
  name: "Aline Mukiza",
  initials: "A",
  deptKey: "dept.records",
  phone: "+250788300100",
};

const lands: Officer = {
  name: "Jean-Paul Habimana",
  initials: "J",
  deptKey: "dept.lands",
  phone: "+250788300100",
};

export const applications: Application[] = [
  {
    id: "business",
    reference: "260051230",
    serviceKey: "service.business",
    citizenName: "Claudine Ishimwe",
    citizenInitials: "C",
    citizenPhone: "+250 78 123 4567",
    citizenPhoneMasked: "+250 78 ••• 4567",
    citizenLocale: "rw",
    submittedOn: "2026-10-28",
    status: "action-needed",
    expectedBy: undefined,
    updatedAt: "2026-11-05T07:40:00",
    officer: records,
    stages: [
      { labelKey: "stage.received", deptKey: "dept.reception", state: "done", date: "2026-10-28" },
      { labelKey: "stage.documents", deptKey: "dept.records", state: "paused", date: "2026-11-02" },
      { labelKey: "stage.nameCheck", deptKey: "dept.registrar", state: "waiting", typicalDays: 3 },
      { labelKey: "stage.approval", deptKey: "dept.director", state: "waiting", typicalDays: 2 },
      { labelKey: "stage.issued", deptKey: "dept.issuing", state: "waiting", typicalDays: 1 },
    ],
    documents: [
      { id: "id", nameKey: "doc.id", sentOn: "2026-10-28", state: "accepted" },
      { id: "lease", nameKey: "doc.lease", sentOn: "2026-10-28", state: "rejected" },
      { id: "tax", nameKey: "doc.tax", sentOn: "2026-10-28", state: "accepted" },
    ],
    request: {
      documentId: "lease",
      reasonKeys: ["reason.tooDark", "reason.unsigned"],
      note: {
        // Written by Aline in her own language; the citizen reads it labelled.
        text: "Fata ifoto urupapuro rwose rugaragara, umukono wa nyir'inzu nawo ugaragare.",
        locale: "rw",
      },
      requestedOn: "2026-11-02",
      respondBy: "2026-11-18",
      officer: records,
    },
    history: [
      { id: "h1", labelKey: "h.received", actor: "Reception desk", at: "2026-10-28T09:12:00" },
      { id: "h2", labelKey: "h.checked", actor: "Aline Mukiza", at: "2026-11-02T11:03:00" },
      {
        id: "h3",
        labelKey: "h.requested",
        actor: "Aline Mukiza",
        at: "2026-11-02T11:06:00",
        detail: "doc.lease",
      },
    ],
  },
  {
    id: "permit",
    reference: "260048178",
    serviceKey: "service.permit",
    citizenName: "Jean Bosco Nkurunziza",
    citizenInitials: "J",
    citizenPhone: "+250 72 884 2210",
    citizenPhoneMasked: "+250 72 ••• 2210",
    citizenLocale: "rw",
    submittedOn: "2026-09-15",
    status: "in-review",
    expectedBy: "2026-11-21",
    updatedAt: "2026-11-04T14:20:00",
    officer: lands,
    stages: [
      { labelKey: "stage.received", deptKey: "dept.reception", state: "done", date: "2026-09-15" },
      { labelKey: "stage.documents", deptKey: "dept.records", state: "done", date: "2026-09-19" },
      { labelKey: "stage.technical", deptKey: "dept.lands", state: "current", date: "2026-10-30" },
      { labelKey: "stage.approval", deptKey: "dept.director", state: "waiting", typicalDays: 4 },
      { labelKey: "stage.issued", deptKey: "dept.issuing", state: "waiting", typicalDays: 1 },
    ],
    documents: [
      { id: "id", nameKey: "doc.id", sentOn: "2026-09-15", state: "accepted" },
      { id: "tax", nameKey: "doc.tax", sentOn: "2026-09-15", state: "accepted" },
    ],
    history: [
      { id: "h1", labelKey: "h.received", actor: "Reception desk", at: "2026-09-15T08:40:00" },
      { id: "h2", labelKey: "h.checked", actor: "Aline Mukiza", at: "2026-09-19T10:15:00" },
    ],
  },
  {
    // A citizen who has already answered: the officer's third required task is
    // to look at what came back and decide.
    id: "responded",
    reference: "260050612",
    serviceKey: "service.business",
    citizenName: "Marie Ingabire",
    citizenInitials: "M",
    citizenPhone: "+250 73 442 9080",
    citizenPhoneMasked: "+250 73 ••• 9080",
    citizenLocale: "fr",
    submittedOn: "2026-10-20",
    status: "in-review",
    expectedBy: undefined,
    updatedAt: "2026-11-05T09:05:00",
    officer: records,
    stages: [
      { labelKey: "stage.received", deptKey: "dept.reception", state: "done", date: "2026-10-20" },
      { labelKey: "stage.documents", deptKey: "dept.records", state: "current", date: "2026-11-05" },
      { labelKey: "stage.nameCheck", deptKey: "dept.registrar", state: "waiting", typicalDays: 3 },
      { labelKey: "stage.approval", deptKey: "dept.director", state: "waiting", typicalDays: 2 },
      { labelKey: "stage.issued", deptKey: "dept.issuing", state: "waiting", typicalDays: 1 },
    ],
    documents: [
      { id: "id", nameKey: "doc.id", sentOn: "2026-10-20", state: "accepted" },
      {
        id: "lease",
        nameKey: "doc.lease",
        sentOn: "2026-10-20",
        state: "replaced",
        replacedOn: "2026-11-05",
      },
    ],
    response: {
      documentId: "lease",
      receivedAt: "2026-11-05T09:05:00",
      replacesSentOn: "2026-10-20",
    },
    history: [
      { id: "h1", labelKey: "h.received", actor: "Reception desk", at: "2026-10-20T13:25:00" },
      { id: "h2", labelKey: "h.checked", actor: "Aline Mukiza", at: "2026-10-27T09:40:00" },
      {
        id: "h3",
        labelKey: "h.requested",
        actor: "Aline Mukiza",
        at: "2026-10-27T09:44:00",
        detail: "doc.lease",
      },
      { id: "h4", labelKey: "h.responded", actor: "Marie Ingabire", at: "2026-11-05T09:05:00" },
    ],
  },
];

/** Spaces are display sugar, so "260 051 230" and "260051230" both match. */
export function findByReference(input: string, list: Application[]): Application | undefined {
  const needle = normalizeReference(input);
  return list.find((application) => application.reference === needle);
}

/** Officer search: reference, phone number or name — a caller rarely has all three. */
export function searchApplications(query: string, list: Application[]): Application[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return list;
  const digits = needle.replace(/\D/g, "");

  return list.filter((application) => {
    // The caller may read the number out with or without its spaces, and may
    // give a phone number or a name instead — all three have to land.
    if (digits.length >= 3 && application.reference.includes(digits)) return true;
    if (application.citizenName.toLowerCase().includes(needle)) return true;
    if (digits.length >= 3 && application.citizenPhone.replace(/\D/g, "").includes(digits)) return true;
    return false;
  });
}
