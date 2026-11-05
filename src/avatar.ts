import { applications, signedInOfficer } from "@/data";

/**
 * Identity chips: one hue per person, everywhere they appear.
 *
 * The polish pass flattened these, which was right while the queue held three
 * rows — three unrelated hues on three people is decoration. At thirteen it
 * is the opposite: a stable colour per person is what lets an officer find
 * the row she was just looking at without re-reading every name. The gradient
 * and the 70.711% stop come from the source design rather than being
 * approximated.
 *
 * The hue is assigned by position in a fixed roster, not by hashing the name.
 * A hash looked fine and was not: multiply-by-31 over Latin names of similar
 * length clusters hard, and it put six hues across sixteen people with
 * Claudine and Jean Bosco — the top two rows — identical. Position guarantees
 * the spread, and the roster is stable, so a person keeps their colour across
 * the queue, the file, the rail and the citizen's own screen.
 */
const PAIRS: Array<[string, string]> = [
  ["#80d9e5", "#59a6d9"],
  ["#ffb273", "#f28073"],
  ["#a7e3b0", "#4fb286"],
  ["#c9b6ff", "#8a6ff0"],
  ["#ffd089", "#e39a2b"],
  ["#9fd7ff", "#4a90d9"],
  ["#ffb3c7", "#e0607e"],
  ["#b9e2a0", "#6aa84f"],
  ["#f5b7e0", "#c061b0"],
  ["#9fc9c4", "#4e8f88"],
  ["#d3c0a0", "#a5854f"],
  ["#aab8f0", "#6b7fd0"],
  ["#b8b3e8", "#5d55b8"],
  ["#f2b8a2", "#cf6a3c"],
  ["#b0c4d4", "#5f7d94"],
  ["#dbe79a", "#93a63a"],
];

/** Citizens in queue order, then the officers who handle their files. */
const ROSTER: string[] = [
  ...new Set([
    ...applications.map((application) => application.citizenName),
    ...applications.map((application) => application.officer.name),
    signedInOfficer.name,
  ]),
];

export function avatarColour(name: string): string {
  const index = ROSTER.indexOf(name);
  // A name outside the roster still needs a stable colour; only the fixture
  // should ever take this path.
  const slot = index >= 0 ? index : name.length + name.charCodeAt(0);
  const [from, to] = PAIRS[slot % PAIRS.length];
  return `linear-gradient(135deg, ${from} 0%, ${to} 70.711%)`;
}
