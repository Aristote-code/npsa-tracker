# NPSA — "Where is my application?"

Interactive prototype for the UI/UX practical assessment. Three audiences from the
brief, side by side behind the tabs at the top of the page.

```bash
npm install
npm run dev
```

## What is here

**Citizen — smartphone.** Reference lookup → status → identity check → document
issue → replace → received. Status is open to anyone holding the reference
(stage, department, whether anything is needed, when it was last true); a code is
required only for documents and uploads. The photo is checked on the handset
before anything is sent — the first capture fails, which is the point.

**Officer — desktop.** Search by reference, phone number *or* name. Each file
leads with "What the citizen sees": the exact sentence to read back, copyable.
Side panels for updating status, requesting a document (pre-translated reason
codes plus free text labelled with its language) and reviewing a citizen's reply.
Role switch in the header shows the front-desk / processing permission split.

**No smartphone — USSD & SMS.** The dialog is drawn as the handset draws it:
an OS modal over whatever was on screen, centred white system text, `N)`
numbering, numeric keypad only. Every response is written to the 182-character
budget and counted in Kinyarwanda, which runs longest. Session timeout included.

Language switches between Kinyarwanda, English and French everywhere, with real
strings in all three.

## Prototype controls

Quiet, grey affordances marked as prototype furniture: reference chips on the
lookup screen, the verification code `12345`, "No network" and "Drop mid-send"
on the upload screen, the role switch, and the USSD session-timeout button.

## Source

The design system — Certia type, `#335CFF`, `#EBEBEB` hairlines, AlignUI
FancyButton, Hugeicons — is carried over from `Aristote-code/verification-workspace`.
`reference/ussd-real-momo-rwanda.webp` is the MTN MoMo Rwanda screen the USSD
dialog is matched against.
