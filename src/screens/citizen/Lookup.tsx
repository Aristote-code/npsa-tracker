import * as React from "react";
import { Alert02Icon, Search01Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/Icon";
import { Page } from "@/components/Page";
import * as FancyButton from "@/components/ui/fancy-button";
import { applications, findByReference } from "@/data";
import { useI18n } from "@/i18n";
import type { Application } from "@/types";

type LookupProps = {
  onFound: (application: Application) => void;
  onNeedHelp: () => void;
};

export function Lookup({ onFound, onNeedHelp }: LookupProps) {
  const { t } = useI18n();
  const [value, setValue] = React.useState("");
  const [notFound, setNotFound] = React.useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const match = findByReference(value);
    if (match) onFound(match);
    else setNotFound(true);
  };

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
            className="input mono"
            value={value}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            aria-invalid={notFound}
            aria-describedby={notFound ? "reference-error" : "reference-hint"}
            onChange={(event) => {
              setValue(event.target.value);
              setNotFound(false);
            }}
          />
          {notFound ? (
            <p className="field__error" id="reference-error" role="alert">
              <Icon icon={Alert02Icon} size={15} strokeWidth={2} />
              <span>
                <b>{t("notFoundTitle")}</b> {t("notFoundBody")}
              </span>
            </p>
          ) : (
            <p className="field__hint" id="reference-hint">
              {t("refHint")}
            </p>
          )}
        </div>

        <FancyButton.Root variant="primary" size="medium" type="submit" disabled={!value.trim()}>
          <FancyButton.Icon as="span">
            <Icon icon={Search01Icon} size={18} />
          </FancyButton.Icon>
          {t("lookupAction")}
        </FancyButton.Root>

        <button type="button" className="linkish" onClick={onNeedHelp}>
          {t("noReference")}
        </button>

        {/* Prototype data, so a reviewer can get in without guessing. */}
        <div className="demo-refs">
          <span>Prototype references</span>
          {applications.map((application) => (
            <button
              key={application.id}
              type="button"
              className="mono"
              onClick={() => {
                setValue(application.reference);
                setNotFound(false);
              }}
            >
              {application.reference}
            </button>
          ))}
        </div>
      </form>
    </Page>
  );
}
