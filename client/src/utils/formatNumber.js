/*
  Shared number formatting for the gauge calculators.
*/

// rounds to at most one decimal place by default: 36.3636 -> "36.4"
export function formatNumber(number, digits = 1) {
  return number.toLocaleString("en-US", { maximumFractionDigits: digits });
}

// the working in "How we worked this out" uses 2 decimals so the rounded figures still add up
export const formatMath = (number) => formatNumber(number, 2);

// signed version for the working: a true minus sign (−) to match the figures above,
// and no sign at all when the value rounds to 0, so it never shows "-0"
export function formatSignedMath(number) {
  const text = formatMath(Math.abs(number));
  return number < 0 && text !== "0" ? `−${text}` : text;
}
