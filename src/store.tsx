import * as React from "react";

import { applications as seed } from "@/data";
import type { StringKey } from "@/i18n/strings";
import type { Application, DocumentRequest, Stage } from "@/types";

/**
 * One copy of the files, shared by both products.
 *
 * The citizen app and the officer desktop are two views of the same records,
 * which is the whole point of the brief's third deliverable — "update an
 * application's status, request a missing document, and see the citizen's
 * response". Holding the data in a module-level const and letting each screen
 * capture its own reference made that loop a veneer: a save had nowhere to
 * write and nothing to re-render. There is no backend here, and none is
 * needed; shared mock state closes the loop honestly.
 */

type Action =
  | { type: "officer/move-stage"; id: string; labelKey: StringKey; actor: string }
  | { type: "officer/request-document"; id: string; request: Omit<DocumentRequest, "requestedOn">; actor: string }
  | { type: "officer/accept"; id: string; actor: string }
  | { type: "officer/reject"; id: string; reasonKeys: StringKey[]; respondBy: string; actor: string }
  | { type: "officer/assisted"; id: string; actor: string }
  | { type: "citizen/replace-document"; id: string; actor: string };

type State = {
  applications: Application[];
  /** The prototype's clock, advanced by a minute on every write. */
  clock: string;
};

const START = "2026-11-05T11:20:00";

/** Local time throughout: toISOString would shift the clock by the UTC
    offset, and the prototype's "as of 11:21" would read 09:21 in Kigali. */
function tick(clock: string): string {
  const next = new Date(clock);
  next.setMinutes(next.getMinutes() + 1);
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}` +
    `T${pad(next.getHours())}:${pad(next.getMinutes())}:${pad(next.getSeconds())}`
  );
}

function dayOf(iso: string) {
  return iso.slice(0, 10);
}

/** Everything before the target is done, the target is current, the rest wait. */
function stagesMovedTo(stages: Stage[], labelKey: StringKey, at: string): Stage[] {
  const target = stages.findIndex((stage) => stage.labelKey === labelKey);
  if (target < 0) return stages;

  return stages.map((stage, index) => {
    if (index < target) return { ...stage, state: "done", date: stage.date ?? dayOf(at) };
    if (index === target) return { ...stage, state: "current", date: dayOf(at) };
    return { ...stage, state: "waiting", date: undefined };
  });
}

function update(state: State, id: string, change: (app: Application, at: string) => Application): State {
  const clock = tick(state.clock);
  return {
    clock,
    applications: state.applications.map((app) =>
      app.id === id ? { ...change(app, clock), updatedAt: clock } : app,
    ),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "officer/move-stage":
      return update(state, action.id, (app, at) => ({
        ...app,
        status: "in-review",
        request: undefined,
        stages: stagesMovedTo(app.stages, action.labelKey, at),
        history: [
          ...app.history,
          { id: `h${app.history.length + 1}`, labelKey: "h.stageChanged", actor: action.actor, at },
        ],
      }));

    case "officer/request-document":
      return update(state, action.id, (app, at) => ({
        ...app,
        status: "action-needed",
        expectedBy: undefined,
        response: undefined,
        request: { ...action.request, requestedOn: dayOf(at) },
        documents: app.documents.map((doc) =>
          doc.id === action.request.documentId ? { ...doc, state: "rejected" } : doc,
        ),
        stages: app.stages.map((stage, index) =>
          index === 1 ? { ...stage, state: "paused" } : stage,
        ),
        history: [
          ...app.history,
          {
            id: `h${app.history.length + 1}`,
            labelKey: "h.requested",
            actor: action.actor,
            at,
            detail: app.documents.find((doc) => doc.id === action.request.documentId)?.nameKey,
          },
        ],
      }));

    // Receipt is not acceptance: the citizen's task is done, the officer's is
    // not, and the file waits with the Records Office until someone looks.
    case "citizen/replace-document":
      return update(state, action.id, (app, at) => ({
        ...app,
        status: "in-review",
        request: undefined,
        expectedBy: undefined,
        documents: app.documents.map((doc) =>
          doc.state === "rejected" ? { ...doc, state: "replaced", replacedOn: dayOf(at) } : doc,
        ),
        response: {
          documentId: app.request?.documentId ?? "lease",
          receivedAt: at,
          replacesSentOn:
            app.documents.find((doc) => doc.state === "rejected")?.sentOn ?? app.submittedOn,
        },
        stages: app.stages.map((stage, index) =>
          index === 1 ? { ...stage, state: "current", date: dayOf(at) } : stage,
        ),
        history: [
          ...app.history,
          { id: `h${app.history.length + 1}`, labelKey: "h.responded", actor: action.actor, at },
        ],
      }));

    case "officer/accept":
      return update(state, action.id, (app, at) => ({
        ...app,
        status: "in-review",
        response: undefined,
        documents: app.documents.map((doc) =>
          doc.state === "replaced" ? { ...doc, state: "accepted" } : doc,
        ),
        history: [
          ...app.history,
          { id: `h${app.history.length + 1}`, labelKey: "h.checked", actor: action.actor, at },
        ],
      }));

    case "officer/reject":
      return update(state, action.id, (app, at) => ({
        ...app,
        status: "action-needed",
        response: undefined,
        request: app.response
          ? {
              documentId: app.response.documentId,
              reasonKeys: action.reasonKeys,
              requestedOn: dayOf(at),
              respondBy: action.respondBy,
              officer: app.officer,
            }
          : app.request,
        documents: app.documents.map((doc) =>
          doc.state === "replaced" ? { ...doc, state: "rejected" } : doc,
        ),
        stages: app.stages.map((stage, index) =>
          index === 1 ? { ...stage, state: "paused" } : stage,
        ),
        history: [
          ...app.history,
          { id: `h${app.history.length + 1}`, labelKey: "h.requested", actor: action.actor, at },
        ],
      }));

    case "officer/assisted":
      return update(state, action.id, (app, at) => ({
        ...app,
        history: [
          ...app.history,
          { id: `h${app.history.length + 1}`, labelKey: "h.assisted", actor: action.actor, at },
        ],
      }));

    default:
      return state;
  }
}

type Store = {
  applications: Application[];
  dispatch: React.Dispatch<Action>;
};

const StoreContext = React.createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { applications: seed, clock: START });
  const value = React.useMemo(
    () => ({ applications: state.applications, dispatch }),
    [state.applications],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const value = React.useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside <StoreProvider>");
  return value;
}

/** Live view of one file, so a screen never holds a stale copy. */
export function useApplication(id: string | null): Application | null {
  const { applications } = useStore();
  if (!id) return null;
  return applications.find((application) => application.id === id) ?? null;
}
