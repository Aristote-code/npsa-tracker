# NPSA — "Where is my application?"

Interactive prototype for the UI/UX practical assessment. Three audiences from the
brief, side by side behind the tabs at the top of the page.

**Live:**
[Citizen (phone)](https://aristote-code.github.io/npsa-tracker/#/citizen) ·
[Officer (desktop)](https://aristote-code.github.io/npsa-tracker/#/officer) ·
[No smartphone (USSD & SMS)](https://aristote-code.github.io/npsa-tracker/#/phone)

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

## The file number

The number is issued on the **submission receipt** — reachable from the lookup
screen's prototype strip as "Just submitted". It is the hinge of the whole
design, so the number is the screen rather than a line of confirmation copy:
set large and grouped for reading aloud, repeated on a printable paper slip for
counter applicants, and sent by SMS so it survives a lost phone.


Nine digits, no letters, shown in threes: `260 051 230`. The last digit is a Luhn
check digit, so a mistyped number is caught on the handset before any lookup —
free, and before a USSD round trip. One identifier works unchanged on the paper
receipt, in the SMS, on a USSD keypad, in the citizen app and in Aline's search
box, with no mapping step anywhere.

## Prototype controls

Quiet, grey affordances marked as prototype furniture: reference chips on the
lookup screen (including `260 051 320`, which fails the check digit), the
verification code `12345`, "No network" and "Drop mid-send" on the upload screen,
the role switch, and the USSD session-timeout button.

## Source

The design system — Certia type, `#335CFF`, `#EBEBEB` hairlines, AlignUI
FancyButton, Hugeicons — is carried over from `Aristote-code/verification-workspace`.
`reference/ussd-real-momo-rwanda.webp` is the MTN MoMo Rwanda screen the USSD
dialog is matched against.
