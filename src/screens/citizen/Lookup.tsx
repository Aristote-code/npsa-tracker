import * as React from "react";
import { Alert02Icon, Search01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Page } from "@/components/Page";
import * as FancyButton from "@/components/ui/fancy-button";
import { applications, findByReference } from "@/data";
import { useI18n } from "@/i18n";
import { checkReference, formatReference, normalizeReference, REFERENCE_LENGTH } from "@/reference";
import type { Application } from "@/types";

type LookupProps = {
  onFound: (application: Application) => void;
  onNeedHelp: () => void;
};

type Problem = "incomplete" | "mistyped" | "notFound" | null;

export function Lookup({ onFound, onNeedHelp }: LookupProps) {
  const { t } = useI18n();
  const [value, setValue] = React.useState("");
  const [problem, setProblem] = React.useState<Problem>(null);

  const digits = normalizeReference(value);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    // Checked on the handset. A mistyped number is caught here, free, rather
    // than after a round trip the citizen paid for.
    const check = checkReference(value);
    if (check === "incomplete" || check === "empty") {
      setProblem("incomplete");
      return;
    }
    if (check === "mistyped") {
      setProblem("mistyped");
      return;
    }

    const match = findByReference(value);
    if (match) onFound(match);
    else setProblem("notFound");
  };

  const message =
    problem === "incomplete"
      ? { body: t("refIncomplete") }
      : problem === "mistyped"
        ? { body: t("refMistyped") }
        : problem === "notFound"
          ? { title: t("notFoundTitle"), body: t("notFoundBody") }
          : null;

  return (
    <Page>
      <form className="form" onSubmit={submit} noValidate>
        <div className="page-head">
          <h1>{t("lookupTitle")}</h1>
          <p>{t("lookupSub")}</p>
        </div>

        <div className="field">
          <label htmlFor="reference">{t("refLabel")}</label>
          <input
            id="reference"
            name="reference"
            className="input input--ref mono"
            value={value}
            /* Digits only, so an Android raises the number pad, not QWERTY. */
            inputMode="numeric"
            pattern="[0-9 ]*"
            autoComplete="off"
            spellCheck={false}
            maxLength={REFERENCE_LENGTH + 2}
            aria-invalid={problem !== null}
            aria-describedby={problem ? "reference-problem" : "reference-hint"}
            onChange={(event) => {
              setValue(formatReference(event.target.value.replace(/\D/g, "")));
              setProblem(null);
            }}
          />
          {message ? (
            <p className="field__error" id="reference-problem" role="alert">
              <Icon icon={Alert02Icon} size={15} strokeWidth={2} />
              <span>
                {message.title && <b>{message.title} </b>}
                {message.body}
              </span>
            </p>
          ) : (
            <p className="field__hint" id="reference-hint">
              {t("refHint")}
            </p>
          )}
        </div>

        <FancyButton.Root
          variant="primary"
          size="medium"
          type="submit"
          disabled={digits.length < REFERENCE_LENGTH}
        >
          <FancyButton.Icon as="span">
            <Icon icon={Search01Icon} size={18} />
          </FancyButton.Icon>
          {t("lookupAction")}
        </FancyButton.Root>

        <button type="button" className="linkish" onClick={onNeedHelp}>
          {t("noReference")}
        </button>

        {/* Prototype data, so a reviewer can get in without guessing. The last
            chip is a valid-looking number with a bad check digit. */}
        <div className="demo-refs">
          <span>Prototype numbers</span>
          {applications.map((application) => (
            <button
              key={application.id}
              type="button"
              className="mono"
              onClick={() => {
                setValue(formatReference(application.reference));
                setProblem(null);
              }}
            >
              {formatReference(application.reference)}
            </button>
          ))}
          <button
            type="button"
            className="mono"
            onClick={() => {
              setValue(formatReference("260051320"));
              setProblem(null);
            }}
          >
            260 051 320
          </button>
        </div>
      </form>
    </Page>
  );
}
