import * as React from "react";

import { Assisted } from "@/screens/citizen/Assisted";
import { Issue } from "@/screens/citizen/Issue";
import { Lookup } from "@/screens/citizen/Lookup";
import { Receipt } from "@/screens/citizen/Receipt";
import { Received } from "@/screens/citizen/Received";
import { Replace } from "@/screens/citizen/Replace";
import { Status } from "@/screens/citizen/Status";
import { Verify } from "@/screens/citizen/Verify";
import { useApplication, useStore } from "@/store";
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

export function CitizenApp() {
  const { applications, dispatch } = useStore();
  const [step, setStep] = React.useState<Step>("lookup");
  /* The id, not the record: the officer may change this file while the
     citizen has it open, and the citizen must see that, not a snapshot. */
  const [currentId, setCurrentId] = React.useState<string | null>(null);
  const [verified, setVerified] = React.useState(false);

  const application = useApplication(currentId);

  const open = (next: Application) => {
    setCurrentId(next.id);
    setStep("status");
  };

  // Screens that do not need a file come first, so the entry screen's own
  // escape hatch is reachable before anything has been looked up.
  if (step === "assisted") {
    return <Assisted onBack={() => setStep(currentId ? "status" : "lookup")} />;
  }

  if (step === "receipt") {
    const submitted = application ?? applications[0];
    return (
      <Receipt
        application={submitted}
        onBack={() => setStep("lookup")}
        onTrack={() => {
          setCurrentId(submitted.id);
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
          dispatch({
            type: "citizen/replace-document",
            id: application.id,
            actor: application.citizenName,
          });
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
        setCurrentId(null);
        setVerified(false);
        setStep("lookup");
      }}
      onSeeWhatIsNeeded={() => setStep(verified ? "issue" : "verify")}
    />
  );
}
