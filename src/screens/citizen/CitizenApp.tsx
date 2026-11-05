import * as React from "react";

import { applications } from "@/data";
import { Assisted } from "@/screens/citizen/Assisted";
import { Issue } from "@/screens/citizen/Issue";
import { Lookup } from "@/screens/citizen/Lookup";
import { Receipt } from "@/screens/citizen/Receipt";
import { Received } from "@/screens/citizen/Received";
import { Replace } from "@/screens/citizen/Replace";
import { Status } from "@/screens/citizen/Status";
import { Verify } from "@/screens/citizen/Verify";
import type { Application } from "@/types";

type Step =
  | "lookup"
  | "receipt"
  | "assisted"
  | "status"
  | "verify"
  | "issue"
  | "replace"
  | "received";

/**
 * Once the replacement is on its way the file goes back to the Records Office
 * for a fresh look. It does not skip ahead, and no new completion date is
 * promised until a person has actually opened the photo.
 */
function afterReplacement(application: Application): Application {
  return {
    ...application,
    status: "in-review",
    request: undefined,
    expectedBy: undefined,
    updatedAt: "2026-11-05T11:18:00",
    stages: application.stages.map((stage, index) =>
      index === 1 ? { ...stage, state: "current", date: "2026-11-05" } : stage,
    ),
    documents: application.documents.map((document) =>
      document.state === "rejected"
        ? { ...document, state: "replaced", replacedOn: "2026-11-05" }
        : document,
    ),
    history: [
      ...application.history,
      {
        id: "h-response",
        labelKey: "h.responded",
        actor: application.citizenName,
        at: "2026-11-05T11:18:00",
      },
    ],
  };
}

export function CitizenApp() {
  const [step, setStep] = React.useState<Step>("lookup");
  const [application, setApplication] = React.useState<Application | null>(null);
  const [verified, setVerified] = React.useState(false);

  const open = (next: Application) => {
    setApplication(next);
    setStep("status");
  };

  if (step === "receipt") {
    // The receipt is reached from the submission flow in real life, and from
    // the confirmation SMS afterwards; the prototype links to it directly.
    const submitted = application ?? applications[0];
    return (
      <Receipt
        application={submitted}
        onBack={() => setStep("lookup")}
        onTrack={() => {
          setApplication(submitted);
          setStep("status");
        }}
      />
    );
  }

  if (step === "lookup" || !application) {
    return (
      <Lookup
        onFound={open}
        onNeedHelp={() => setStep("assisted")}
        onShowReceipt={() => setStep("receipt")}
      />
    );
  }

  if (step === "assisted") {
    return <Assisted onBack={() => setStep(application ? "status" : "lookup")} />;
  }

  if (step === "verify") {
    return (
      <Verify
        application={application}
        onBack={() => setStep("status")}
        onVerified={() => {
          setVerified(true);
          setStep("issue");
        }}
      />
    );
  }

  if (step === "issue") {
    return (
      <Issue
        application={application}
        onBack={() => setStep("status")}
        onReplace={() => setStep("replace")}
      />
    );
  }

  if (step === "replace") {
    return (
      <Replace
        application={application}
        onBack={() => setStep("issue")}
        onReceived={() => {
          setApplication(afterReplacement(application));
          setStep("received");
        }}
      />
    );
  }

  if (step === "received") {
    return <Received application={application} onDone={() => setStep("status")} />;
  }

  return (
    <Status
      application={application}
      verified={verified}
      onBack={() => {
        setApplication(null);
        setVerified(false);
        setStep("lookup");
      }}
      onSeeWhatIsNeeded={() => setStep(verified ? "issue" : "verify")}
    />
  );
}
