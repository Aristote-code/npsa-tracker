import * as React from "react";
import {
  Alert02Icon,
  Camera01Icon,
  CheckmarkCircle02Icon,
  Image01Icon,
  Loading03Icon,
  WifiOff01Icon,
  ZoomInAreaIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Page } from "@/components/Page";
import { Sheet } from "@/components/Sheet";
import * as FancyButton from "@/components/ui/fancy-button";
import { useI18n } from "@/i18n";
import type { Application, UploadState } from "@/types";

type ReplaceProps = {
  application: Application;
  onBack: () => void;
  onReceived: () => void;
};

const RAW_SIZE = "3.8 MB";
const SENT_SIZE = "190 KB";

/**
 * Two ideas carry this screen.
 *
 * First, the photo is checked on the handset before a single byte leaves it.
 * The brief's "1 in 4 delayed because a bad document is found after about two
 * weeks" is a feedback-latency problem: a local darkness check moves that
 * discovery from two weeks to two seconds, and costs no data to be wrong.
 *
 * Second, data cost is a design constraint rather than an error state: the
 * image is compressed before sending, the size is disclosed before she
 * commits, and the send is queued when there is no signal. "Received" is
 * never claimed before NPSA confirms it.
 */
export function Replace({ application, onBack, onReceived }: ReplaceProps) {
  const { t } = useI18n();
  const [state, setState] = React.useState<UploadState>("idle");
  const [attempt, setAttempt] = React.useState(0);
  const [sourceOpen, setSourceOpen] = React.useState(false);
  const [offline, setOffline] = React.useState(false);
  const [dropMidSend, setDropMidSend] = React.useState(false);
  const [interrupted, setInterrupted] = React.useState(false);

  const request = application.request;
  const document = application.documents.find((item) => item.id === request?.documentId);

  // The first capture is the one she would really have taken — the same dark
  // photo as before. Catching it here is the whole point of the screen.
  const capture = () => {
    setSourceOpen(false);
    setState("checking");
    const next = attempt + 1;
    setAttempt(next);
    window.setTimeout(() => setState(next === 1 ? "rejected" : "ready"), 900);
  };

  const send = () => {
    setInterrupted(false);
    if (offline) {
      setState("saved");
      return;
    }
    setState("sending");
    window.setTimeout(() => {
      if (dropMidSend) {
        setInterrupted(true);
        setState("saved");
        return;
      }
      setState("received");
      window.setTimeout(onReceived, 650);
    }, 1600);
  };

  const order: UploadState[] = ["saved", "sending", "received"];
  const reached = (key: UploadState) => order.indexOf(key) <= order.indexOf(state);
  const showSendStates = state === "saved" || state === "sending" || state === "received";
  const bad = state === "rejected";

  const footer = (() => {
    if (state === "idle" || state === "checking") return null;
    if (bad) {
      return (
        <FancyButton.Root variant="primary" size="medium" onClick={() => setSourceOpen(true)}>
          <FancyButton.Icon as="span">
            <Icon icon={Camera01Icon} size={18} />
          </FancyButton.Icon>
          {t("retakePhoto")}
        </FancyButton.Root>
      );
    }
    return (
      <>
        <FancyButton.Root
          variant="primary"
          size="medium"
          onClick={send}
          disabled={state === "sending" || state === "received"}
        >
          {state === "saved"
            ? t("sendWhenOnline")
            : state === "sending"
              ? t("stateSending")
              : t("sendDocument")}
        </FancyButton.Root>
        {state === "ready" && (
          <FancyButton.Root variant="basic" size="medium" onClick={() => setSourceOpen(true)}>
            {t("retake")}
          </FancyButton.Root>
        )}
        <div className="sim-row">
          <button
            type="button"
            className="sim"
            aria-pressed={offline}
            onClick={() => setOffline((value) => !value)}
          >
            <Icon icon={WifiOff01Icon} size={13} />
            No network
          </button>
          <button
            type="button"
            className="sim"
            aria-pressed={dropMidSend}
            onClick={() => setDropMidSend((value) => !value)}
          >
            <Icon icon={Alert02Icon} size={13} />
            Drop mid-send
          </button>
        </div>
      </>
    );
  })();

  return (
    <Page onBack={onBack} compactTitle={t("replaceTitle")} bare footer={footer}>
      <div className="pad pad--head">
        <div className="page-head">
          <h1>{t("replaceTitle")}</h1>
          {document && <p>{t(document.nameKey)}</p>}
        </div>
      </div>

      {state === "idle" && (
        <div className="pad">
          <FancyButton.Root variant="primary" size="medium" onClick={() => setSourceOpen(true)}>
            <FancyButton.Icon as="span">
              <Icon icon={Camera01Icon} size={18} />
            </FancyButton.Icon>
            {t("chooseSource")}
          </FancyButton.Root>
          <p className="field__hint">{t("checkedHere")}</p>
        </div>
      )}

      {state === "checking" && (
        <div className="pad">
          <div className="checking">
            <Icon icon={Loading03Icon} size={20} className="spin" />
            <span>{t("checking")}</span>
          </div>
        </div>
      )}

      {state !== "idle" && state !== "checking" && (
        <>
          {/* The verdict sits directly above the photo it is about. */}
          {bad ? (
            <div className="pad pad--tight">
              <div className="verdict verdict--bad" role="alert">
                <Icon icon={Alert02Icon} size={19} strokeWidth={2} />
                <div>
                  <strong>{t("checkFailTitle")}</strong>
                  <p>{t("checkFailBody")}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="pad pad--tight">
              <div className="verdict verdict--good">
                <Icon icon={CheckmarkCircle02Icon} size={19} strokeWidth={2} />
                <div>
                  <strong>{t("checkPass")}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Full-bleed, because she is being asked to judge a photograph. */}
          <div className="bleed">
            <div
              className={`shot${bad ? " shot--bad" : ""}`}
              role="img"
              aria-label={bad ? t("checkFailTitle") : t("photoReady")}
            >
              <div className="shot__paper">
                <i style={{ top: "14%" }} />
                <i style={{ top: "28%", right: "34%" }} />
                <i style={{ top: "42%" }} />
                <i style={{ top: "56%", right: "22%" }} />
                {!bad && <i className="sig" style={{ top: "74%" }} />}
              </div>
              <button type="button" className="shot__zoom">
                <Icon icon={ZoomInAreaIcon} size={14} />
                {t("enlarge")}
              </button>
            </div>
          </div>

          <div className="pad">
            {bad ? (
              <p className="field__hint">{t("checkedHere")}</p>
            ) : (
              <div className="sizes">
                <span className="sizes__shrink">
                  {t("compressedNote", { from: RAW_SIZE, to: SENT_SIZE })}
                </span>
                <span className="sizes__cost">{t("dataNote", { size: SENT_SIZE })}</span>
              </div>
            )}

            {showSendStates && (
              <ol className="send-states" aria-live="polite">
                {order.map((key) => (
                  <li
                    key={key}
                    className={reached(key) ? "is-reached" : undefined}
                    aria-current={state === key ? "step" : undefined}
                  >
                    <span className="send-states__dot">
                      {key === "sending" && state === "sending" ? (
                        <Icon icon={Loading03Icon} size={13} strokeWidth={2.4} className="spin" />
                      ) : reached(key) ? (
                        <Icon icon={CheckmarkCircle02Icon} size={13} strokeWidth={2.4} />
                      ) : null}
                    </span>
                    {t(
                      key === "saved" ? "stateSaved" : key === "sending" ? "stateSending" : "stateReceived",
                    )}
                  </li>
                ))}
              </ol>
            )}

            {state === "saved" && (
              <div className="offline">
                <Icon icon={interrupted ? Alert02Icon : WifiOff01Icon} size={18} />
                <div>
                  <strong>{interrupted ? t("interrupted") : t("offlineTitle")}</strong>
                  <p>{t("savedBody")}</p>
                </div>
              </div>
            )}

            {state === "sending" && <p className="field__hint">{t("sendingBody")}</p>}
          </div>
        </>
      )}

      <Sheet open={sourceOpen} title={t("chooseSource")} onClose={() => setSourceOpen(false)}>
        <FancyButton.Root variant="primary" size="medium" onClick={capture}>
          <FancyButton.Icon as="span">
            <Icon icon={Camera01Icon} size={18} />
          </FancyButton.Icon>
          {t("takePhoto")}
        </FancyButton.Root>
        <FancyButton.Root variant="basic" size="medium" onClick={capture}>
          <FancyButton.Icon as="span">
            <Icon icon={Image01Icon} size={18} />
          </FancyButton.Icon>
          {t("chooseFromPhone")}
        </FancyButton.Root>
      </Sheet>
    </Page>
  );
}
