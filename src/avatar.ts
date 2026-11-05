/**
 * Identity chips in the officer queue.
 *
 * The polish pass flattened these to one neutral, which was right while the
 * table held three rows — three unrelated hues on three people is decoration.
 * At thirteen rows it is the opposite: a stable colour per person is what
 * lets an officer find the row she was just looking at without re-reading
 * every name. The gradient and the 70.711% stop are carried over from the
 * source design rather than approximated.
 *
 * Scope is the queue. The citizen's "who is handling your file" avatar is a
 * different element on a different screen and stays flat and neutral.
 */
const PAIRS: Array<[string, string]> = [
  ["#80d9e5", "#59a6d9"],
  ["#ffb273", "#f28073"],
  ["#a7e3b0", "#4fb286"],
  ["#c9b6ff", "#8a6ff0"],
  ["#ffd089", "#e39a2b"],
  ["#9fd7ff", "#4a90d9"],
  ["#ffb3c7", "#e0607e"],
];

/** Derived from the name, so a person keeps their colour everywhere. */
export function avatarColour(name: string): string {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 31 + name.charCodeAt(index)) >>> 0;
  }
  const [from, to] = PAIRS[hash % PAIRS.length];
  return `linear-gradient(135deg, ${from} 0%, ${to} 70.711%)`;
}
