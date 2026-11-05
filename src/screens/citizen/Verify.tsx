import * as React from "react";
import {
  Alert02Icon,
  Call02Icon,
  Message01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Page } from "@/components/Page";
import { Sheet } from "@/components/Sheet";
import * as FancyButton from "@/components/ui/fancy-button";
import { useI18n } from "@/i18n";
import type { Application } from "@/types";

const PROTOTYPE_CODE = "12345";
const RESEND_SECONDS = 30;

type VerifyProps = {
  application: Application;
  onBack: () => void;
  onVerified: () => void;
};

/**
 * The gate sits here and nowhere earlier: status is open, documents are not.
 * Putting a code in front of a status check would keep most of the brief's
 * 62% on the phone to the office.
 */
export function Verify({ application, onBack, onVerified }: VerifyProps) {
  const { t } = useI18n();
  const [code, setCode] = React.useState("");
  const [wrong, setWrong] = React.useState(false);
  const [seconds, setSeconds] = React.useState(RESEND_SECONDS);
  const [channelOpen, setChannelOpen] = React.useState(false);
  const [channel, setChannel] = React.useState<"sms" | "call">("sms");

  React.useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.trim() === PROTOTYPE_CODE) onVerified();
    else setWrong(true);
  };

  return (
    <Page onBack={onBack} compactTitle={t("verifyTitle")}>
      <form className="form" onSubmit={submit} noValidate>
        <div className="page-head">
          <h1>{t("verifyTitle")}</h1>
          <p>{t("verifyWhy")}</p>
        </div>

        <div className="sent-to">
          <Icon icon={channel === "call" ? Call02Icon : Message01Icon} size={18} />
          <span>
            {channel === "call"
              ? t("callingYou", { phone: application.citizenPhoneMasked })
              : t("verifyBody", { phone: application.citizenPhoneMasked })}
          </span>
        </div>

        <div className="field">
          <label htmlFor="code">{t("codeLabel")}</label>
          <input
            id="code"
            className="input input--code mono"
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={5}
            aria-invalid={wrong}
            aria-describedby={wrong ? "code-error" : undefined}
            onChange={(event) => {
              setCode(event.target.value.replace(/\D/g, ""));
              setWrong(false);
            }}
          />
          {wrong && (
            <p className="field__error" id="code-error" role="alert">
              <Icon icon={Alert02Icon} size={15} strokeWidth={2} />
              <span>{t("wrongCode")}</span>
            </p>
          )}
        </div>

        <FancyButton.Root variant="primary" size="medium" type="submit" disabled={code.length < 5}>
          {t("verifyAction")}
        </FancyButton.Root>

        {/* The SMS is slow far more often than it is wrong — and for the
            person holding a borrowed handset it may never be the right
            channel at all, so a call from the office is offered beside it. */}
        <div className="resend">
          {seconds > 0 ? (
            <span>{t("resendIn", { n: seconds })}</span>
          ) : (
            <button type="button" className="linkish" onClick={() => setSeconds(RESEND_SECONDS)}>
              {t("resend")}
            </button>
          )}
          <small>{t("codeLate")}</small>
          <button type="button" className="linkish" onClick={() => setChannelOpen(true)}>
            {t("channelChange")}
          </button>
        </div>

        {/* Jean Bosco's son is the normal case, not an edge case. */}
        <div className="notice">
          <Icon icon={UserGroupIcon} size={18} />
          <div>
            <strong>{t("helperTitle")}</strong>
            <p>{t("helperBody")}</p>
          </div>
        </div>

        <div className="demo-refs">
          <span>Prototype code</span>
          <button type="button" className="mono" onClick={() => setCode(PROTOTYPE_CODE)}>
            {PROTOTYPE_CODE}
          </button>
        </div>
      </form>

      <Sheet open={channelOpen} title={t("channelTitle")} onClose={() => setChannelOpen(false)}>
        <FancyButton.Root
          variant={channel === "sms" ? "primary" : "basic"}
          size="medium"
          onClick={() => {
            setChannel("sms");
            setSeconds(RESEND_SECONDS);
            setChannelOpen(false);
          }}
        >
          <FancyButton.Icon as="span">
            <Icon icon={Message01Icon} size={18} />
          </FancyButton.Icon>
          {t("channelSms")}
        </FancyButton.Root>

        <FancyButton.Root
          variant={channel === "call" ? "primary" : "basic"}
          size="medium"
          onClick={() => {
            setChannel("call");
            setChannelOpen(false);
          }}
        >
          <FancyButton.Icon as="span">
            <Icon icon={Call02Icon} size={18} />
          </FancyButton.Icon>
          {t("channelCall")}
        </FancyButton.Root>

        <p className="field__hint">{t("channelCallNote")}</p>
      </Sheet>
    </Page>
  );
}
