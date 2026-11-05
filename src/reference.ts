/**
 * The file number.
 *
 * Nine digits, no letters, shown in threes: 260 051 230. One identifier works
 * unchanged on the paper receipt, in the SMS, on a USSD keypad, in the citizen
 * app and in an officer's search box — there is no mapping step anywhere, and
 * nothing about it needs a QWERTY keyboard.
 *
 * The last digit is a Luhn check digit, which the app can verify on the
 * handset before any lookup: a mistyped number is caught instantly instead of
 * costing a network round trip. That matters on a metered connection, and it
 * matters more over USSD, where every screen is a timed round trip. It is also
 * the failure this service actually has — someone reads digits off a paper
 * slip down the phone, and Luhn catches every single-digit slip and almost
 * every transposition.
 */

export const REFERENCE_LENGTH = 9;

/** Digits only, so "260 051 230" and "260051230" are the same number. */
export function normalizeReference(input: string): string {
  return input.replace(/\D/g, "");
}

/** Display form: 260 051 230. */
export function formatReference(reference: string): string {
  const digits = normalizeReference(reference);
  if (digits.length !== REFERENCE_LENGTH) return digits;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

/** Luhn, over the whole number including its check digit. */
export function hasValidCheckDigit(reference: string): boolean {
  const digits = normalizeReference(reference);
  if (digits.length !== REFERENCE_LENGTH) return false;

  let sum = 0;
  let double = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let value = Number(digits[index]);
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
}

/** What the lookup screen needs to know before it asks the network. */
export type ReferenceCheck = "empty" | "incomplete" | "mistyped" | "ok";

export function checkReference(input: string): ReferenceCheck {
  const digits = normalizeReference(input);
  if (digits.length === 0) return "empty";
  if (digits.length < REFERENCE_LENGTH) return "incomplete";
  if (!hasValidCheckDigit(digits)) return "mistyped";
  return "ok";
}
