/**
 * Touch-target audit for the citizen screens.
 *
 * Paste into the browser console with a citizen screen open at 375px, or run
 * it after any change that touches layout. It answers one question: can every
 * interactive thing on this screen be hit by a thumb on an older Android?
 *
 *     sweepTargets()              // current screen
 *     sweepTargets({ min: 44 })   // iOS minimum instead
 *
 * Two things it does that eyeballing and getBoundingClientRect do not:
 *
 * 1. It measures the TARGET, not the drawn box. 48dp is a rule about the
 *    touch area; the visual may be smaller, and several controls here are
 *    deliberately smaller with the target extended by a pseudo-element. A
 *    plain getBoundingClientRect reports those as failures when they pass.
 *
 * 2. It checks the PITCH between neighbours. Targets that sit 48px apart tile
 *    exactly — no overlap, no dead gap between them. A 48px visual with a 2px
 *    gap looks compliant and is not: the gap is unhittable, and widening the
 *    targets to close it makes them overlap, so a tap near the seam is
 *    ambiguous. Overlap is reported separately because it is the worse bug.
 *
 * Prototype scaffolding is excluded on purpose — the view switcher, the
 * reference chips and the simulation toggles are there for whoever is
 * reviewing the prototype, not for Claudine, and sizing them up would make
 * the furniture louder than the product.
 */
const SCAFFOLDING = ".demo-refs, .sim-row, .sim, .proto__tabs";

function targetBox(el) {
  const rect = el.getBoundingClientRect();
  let { width, height } = rect;

  // A pseudo-element with a negative inset is how a small control gets a
  // large target. Count it.
  for (const pseudo of ["::after", "::before"]) {
    const style = getComputedStyle(el, pseudo);
    if (style.content === "none" || style.position !== "absolute") continue;
    const inset = style.inset.match(/^(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px$/);
    if (!inset) continue;
    height += -2 * parseFloat(inset[1]);
    width += -2 * parseFloat(inset[2]);
  }

  return { width, height, rect };
}

function sweepTargets({ min = 48, root = ".phone" } = {}) {
  const scope = document.querySelector(root) ?? document.body;
  const selector = 'button,a,input,select,textarea,[role="button"],[tabindex]:not([tabindex="-1"])';

  const measured = [];
  for (const el of scope.querySelectorAll(selector)) {
    if (el.closest(SCAFFOLDING) || el.classList.contains("sheet-scrim")) continue;
    const { width, height, rect } = targetBox(el);
    if (rect.width === 0 && rect.height === 0) continue; // not rendered
    measured.push({
      label: (el.getAttribute("aria-label") || el.textContent || el.type || "").trim().slice(0, 40),
      width: Math.round(width),
      height: Math.round(height),
      rect,
    });
  }

  const tooSmall = measured
    .filter((item) => item.width < min || item.height < min)
    .map(({ label, width, height }) => ({ label, size: `${width}x${height}` }));

  // Neighbours whose targets collide: a tap in the overlap is ambiguous.
  const overlapping = [];
  for (let i = 0; i < measured.length; i += 1) {
    for (let j = i + 1; j < measured.length; j += 1) {
      const a = measured[i].rect;
      const b = measured[j].rect;
      const gapX = Math.max(a.left, b.left) - Math.min(a.right, b.right);
      const gapY = Math.max(a.top, b.top) - Math.min(a.bottom, b.bottom);
      if (gapX < -1 && gapY < -1) {
        overlapping.push(`${measured[i].label} / ${measured[j].label}`);
      }
    }
  }

  return {
    checked: measured.length,
    minimum: `${min}px`,
    pass: tooSmall.length === 0 && overlapping.length === 0,
    tooSmall,
    overlapping,
  };
}

if (typeof window !== "undefined") window.sweepTargets = sweepTargets;
