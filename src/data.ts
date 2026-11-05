import type { Locale, StringKey } from "@/i18n/strings";
import { normalizeReference, withCheckDigit } from "@/reference";
import type { Application, ApplicationStatus, Officer, OfficerRole, Stage } from "@/types";

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

const registrar: Officer = {
  name: "Claude Nsabimana",
  initials: "C",
  deptKey: "dept.registrar",
  phone: "+250788300100",
};

/** The five desks each service passes through, in order. */
type Route = "business" | "permit" | "land";

const ROUTES: Record<Route, Array<{ labelKey: StringKey; deptKey: StringKey; typicalDays: number }>> = {
  business: [
    { labelKey: "stage.received", deptKey: "dept.reception", typicalDays: 1 },
    { labelKey: "stage.documents", deptKey: "dept.records", typicalDays: 3 },
    { labelKey: "stage.nameCheck", deptKey: "dept.registrar", typicalDays: 3 },
    { labelKey: "stage.approval", deptKey: "dept.director", typicalDays: 2 },
    { labelKey: "stage.issued", deptKey: "dept.issuing", typicalDays: 1 },
  ],
  permit: [
    { labelKey: "stage.received", deptKey: "dept.reception", typicalDays: 1 },
    { labelKey: "stage.documents", deptKey: "dept.records", typicalDays: 3 },
    { labelKey: "stage.technical", deptKey: "dept.lands", typicalDays: 4 },
    { labelKey: "stage.approval", deptKey: "dept.director", typicalDays: 2 },
    { labelKey: "stage.issued", deptKey: "dept.issuing", typicalDays: 1 },
  ],
  land: [
    { labelKey: "stage.received", deptKey: "dept.reception", typicalDays: 1 },
    { labelKey: "stage.documents", deptKey: "dept.records", typicalDays: 3 },
    { labelKey: "stage.technical", deptKey: "dept.lands", typicalDays: 5 },
    { labelKey: "stage.approval", deptKey: "dept.director", typicalDays: 2 },
    { labelKey: "stage.issued", deptKey: "dept.issuing", typicalDays: 1 },
  ],
};

function stagesFor(kind: Route, current: number, status: ApplicationStatus, from: string): Stage[] {
  const day = (offset: number) => {
    const date = new Date(`${from}T00:00:00`);
    date.setDate(date.getDate() + offset * 4);
    return date.toISOString().slice(0, 10);
  };

  return ROUTES[kind].map((step, index) => {
    if (status === "approved") return { ...step, state: "done", date: day(index) };
    if (index < current) return { ...step, state: "done", date: day(index) };
    if (index === current) {
      return {
        ...step,
        state: status === "action-needed" ? "paused" : "current",
        date: day(index),
      };
    }
    return { ...step, state: "waiting" };
  });
}

/**
 * The rest of Aline's queue. A table with three rows in it reads as a stub
 * rather than a working desk, and the spread of stages and statuses is what
 * shows the five-step route doing its job.
 *
 * References are built through reference.ts rather than typed, so the fixture
 * can never contain a number the prototype's own lookup would reject.
 */
function entry(options: {
  id: string;
  payload: string;
  kind: Route;
  serviceKey: StringKey;
  name: string;
  phone: string;
  locale: Locale;
  submittedOn: string;
  current: number;
  status: ApplicationStatus;
  updatedAt: string;
  expectedBy?: string;
  officer: Officer;
}): Application {
  const [first] = options.name.split(" ");
  return {
    id: options.id,
    reference: withCheckDigit(options.payload),
    serviceKey: options.serviceKey,
    citizenName: options.name,
    citizenInitials: first.charAt(0),
    citizenPhone: options.phone,
    citizenPhoneMasked: `${options.phone.slice(0, 10)} ••• ${options.phone.slice(-4)}`,
    citizenLocale: options.locale,
    submittedOn: options.submittedOn,
    status: options.status,
    expectedBy: options.expectedBy,
    updatedAt: options.updatedAt,
    officer: options.officer,
    stages: stagesFor(options.kind, options.current, options.status, options.submittedOn),
    documents: [
      { id: "id", nameKey: "doc.id", sentOn: options.submittedOn, state: "accepted" },
      { id: "tax", nameKey: "doc.tax", sentOn: options.submittedOn, state: "accepted" },
    ],
    history: [
      { id: "h1", labelKey: "h.received", actor: "Reception desk", at: `${options.submittedOn}T09:00:00` },
    ],
  };
}

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

  entry({
    id: "mugisha",
    payload: "26005208",
    kind: "land",
    serviceKey: "service.land",
    name: "Eric Mugisha",
    phone: "+250 78 445 1190",
    locale: "rw",
    submittedOn: "2026-09-28",
    current: 3,
    status: "in-review",
    updatedAt: "2026-11-05T08:10:00",
    expectedBy: "2026-11-19",
    officer: lands,
  }),
  entry({
    id: "uwase",
    payload: "26004962",
    kind: "business",
    serviceKey: "service.business",
    name: "Alice Uwase",
    phone: "+250 72 331 7745",
    locale: "en",
    submittedOn: "2026-09-02",
    current: 4,
    status: "approved",
    updatedAt: "2026-11-04T16:45:00",
    officer: registrar,
  }),
  entry({
    id: "niyonzima",
    payload: "26005317",
    kind: "permit",
    serviceKey: "service.permit",
    name: "Patrick Niyonzima",
    phone: "+250 78 902 3318",
    locale: "rw",
    submittedOn: "2026-11-04",
    current: 0,
    status: "in-review",
    updatedAt: "2026-11-05T10:55:00",
    expectedBy: "2026-11-27",
    officer: records,
  }),
  entry({
    id: "mukamana",
    payload: "26004851",
    kind: "land",
    serviceKey: "service.land",
    name: "Solange Mukamana",
    phone: "+250 73 118 6620",
    locale: "rw",
    submittedOn: "2026-10-12",
    current: 1,
    status: "action-needed",
    updatedAt: "2026-11-03T11:30:00",
    officer: records,
  }),
  entry({
    id: "bizimana",
    payload: "26005440",
    kind: "business",
    serviceKey: "service.business",
    name: "Thierry Bizimana",
    phone: "+250 78 664 2087",
    locale: "fr",
    submittedOn: "2026-10-18",
    current: 2,
    status: "in-review",
    updatedAt: "2026-11-05T07:05:00",
    expectedBy: "2026-11-20",
    officer: registrar,
  }),
  entry({
    id: "umutoni",
    payload: "26004733",
    kind: "permit",
    serviceKey: "service.permit",
    name: "Grace Umutoni",
    phone: "+250 72 540 9913",
    locale: "en",
    submittedOn: "2026-09-21",
    current: 2,
    status: "in-review",
    updatedAt: "2026-11-02T14:20:00",
    expectedBy: "2026-11-24",
    officer: lands,
  }),
  entry({
    id: "habimana",
    payload: "26005126",
    kind: "land",
    serviceKey: "service.land",
    name: "Emmanuel Habimana",
    phone: "+250 78 277 4451",
    locale: "rw",
    submittedOn: "2026-08-25",
    current: 4,
    status: "approved",
    updatedAt: "2026-10-30T09:40:00",
    officer: lands,
  }),
  entry({
    id: "uwimana",
    payload: "26004688",
    kind: "business",
    serviceKey: "service.business",
    name: "Chantal Uwimana",
    phone: "+250 73 806 5572",
    locale: "rw",
    submittedOn: "2026-10-26",
    current: 1,
    status: "action-needed",
    updatedAt: "2026-11-05T06:15:00",
    officer: records,
  }),
  entry({
    id: "rwema",
    payload: "26005372",
    kind: "permit",
    serviceKey: "service.permit",
    name: "Didier Rwema",
    phone: "+250 78 019 3364",
    locale: "fr",
    submittedOn: "2026-09-08",
    current: 3,
    status: "in-review",
    updatedAt: "2026-11-01T15:50:00",
    expectedBy: "2026-11-18",
    officer: lands,
  }),
  entry({
    id: "mukantwari",
    payload: "26004917",
    kind: "land",
    serviceKey: "service.land",
    name: "Josiane Mukantwari",
    phone: "+250 72 762 8806",
    locale: "rw",
    submittedOn: "2026-10-05",
    current: 2,
    status: "in-review",
    updatedAt: "2026-10-29T13:05:00",
    expectedBy: "2026-11-26",
    officer: lands,
  }),
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
