import { useState } from "react";
import { getPositiveNumberError } from "../../utils/validateNumber.js";
import { formatNumber, formatMath, formatSignedMath } from "../../utils/formatNumber.js";

/*
  GaugeComparison Component
  -------------------------
  Compares the pattern's gauge with the knitter's actual gauge and estimates
  how that changes the width of a piece knit with the pattern's stitch count.

  Inputs:
  - pattern stitch gauge (stitches per 4 inches)
  - actual stitch gauge (stitches per 4 inches)
  - the pattern's stitch count for the piece

  Results are worked out as the user types (like the yarn calculators),
  so they always match the inputs on screen.
*/

// differences smaller than this (in inches) count as matching the pattern,
// so we never say "0.0 inches wider"
const MATCH_TOLERANCE = 0.05;

// stitch counts must be positive whole numbers
function getStitchCountError(value) {
  const error = getPositiveNumberError(value);
  if (error) return error;
  if (!Number.isInteger(Number(value))) return "Please enter a whole number of stitches.";
  return "";
}

/*
  CALCULATION
  -----------
  Gauge per 4 inches ÷ 4 = stitches per inch,
  so width = stitches ÷ (gauge ÷ 4), which is the same as stitches × 4 ÷ gauge.
*/
function compareGauge(patternGauge, actualGauge, stitchCount) {
  const patternWidth = (stitchCount * 4) / patternGauge;
  const actualWidth = (stitchCount * 4) / actualGauge;
  const difference = actualWidth - patternWidth;

  return {
    patternGauge,
    actualGauge,
    stitchCount,
    patternWidth,
    actualWidth,
    difference,
    // percentage is measured against the width the pattern expects
    percent: (Math.abs(difference) / patternWidth) * 100,
    matches: Math.abs(difference) < MATCH_TOLERANCE,
  };
}

// plain-language summary of the comparison
function explainComparison(r) {
  if (r.matches) {
    return "Your gauge matches the pattern closely, so your piece should come out about the size the pattern intends.";
  }

  const direction = r.difference > 0 ? "wider" : "narrower";
  const reason =
    r.difference > 0
      ? "You're getting fewer stitches per 4 inches than the pattern, so each stitch is larger and the fabric spreads out more."
      : "You're getting more stitches per 4 inches than the pattern, so each stitch is smaller and the fabric draws in.";

  return `Your piece will be about ${formatNumber(Math.abs(r.difference))} inches (${formatNumber(r.percent)}%) ${direction} than the pattern intends. ${reason}`;
}

export default function GaugeComparison() {
  const [patternGauge, setPatternGauge] = useState("");
  const [actualGauge, setActualGauge] = useState("");
  const [stitchCount, setStitchCount] = useState("");

  // a field only shows an error once something unusable has been typed in it;
  // empty fields just keep the results hidden while the user fills things in
  const errors = {
    patternGauge: patternGauge.trim() === "" ? "" : getPositiveNumberError(patternGauge),
    actualGauge: actualGauge.trim() === "" ? "" : getPositiveNumberError(actualGauge),
    stitchCount: stitchCount.trim() === "" ? "" : getStitchCountError(stitchCount),
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const isComplete = [patternGauge, actualGauge, stitchCount].every((value) => value.trim() !== "");

  // only calculate when every input is valid, so no misleading numbers are shown
  const result =
    isComplete && !hasErrors
      ? compareGauge(Number(patternGauge), Number(actualGauge), Number(stitchCount))
      : null;

  // the three inputs share the same markup; only their wording differs
  const fields = [
    {
      id: "compare-pattern-gauge",
      label: "Pattern gauge (stitches per 4 inches)",
      hint: "From the pattern's gauge line, e.g. 20 sts = 4 in.",
      value: patternGauge,
      setValue: setPatternGauge,
      error: errors.patternGauge,
    },
    {
      id: "compare-actual-gauge",
      label: "Your gauge (stitches per 4 inches)",
      hint: "Count the stitches across 4 inches of your washed swatch.",
      value: actualGauge,
      setValue: setActualGauge,
      error: errors.actualGauge,
    },
    {
      id: "compare-stitch-count",
      label: "Pattern stitch count for the piece",
      hint: "The number of stitches across, e.g. the cast-on for a sweater back.",
      value: stitchCount,
      setValue: setStitchCount,
      error: errors.stitchCount,
    },
  ];

  return (
    <section className="gauge-comparison" aria-labelledby="gauge-comparison-title">
      <h2 id="gauge-comparison-title">Compare With Your Pattern</h2>
      <p>
        See how a difference between your gauge and the pattern's changes the
        width of your piece. Results update as you type.
      </p>

      <div className="gauge-form">
        {fields.map((field) => (
          <div className="gauge-field" key={field.id}>
            <label htmlFor={field.id}>{field.label}</label>
            <input
              id={field.id}
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              aria-invalid={Boolean(field.error)}
              aria-describedby={
                field.error ? `${field.id}-hint ${field.id}-error` : `${field.id}-hint`
              }
            />
            <p id={`${field.id}-hint`} className="field-hint">{field.hint}</p>
            {field.error && (
              <p id={`${field.id}-error`} className="field-error">{field.error}</p>
            )}
          </div>
        ))}
      </div>

      {/* aria-live lets screen readers hear the updated answer */}
      <div aria-live="polite">
        {result ? (
          <div className="gauge-comparison-results">
            <p className="gauge-comparison-summary">
              {result.matches
                ? "Your gauge matches the pattern"
                : `About ${formatNumber(Math.abs(result.difference))} in ${result.difference > 0 ? "wider" : "narrower"}`}
            </p>

            <dl className="gauge-breakdown">
              <div>
                <dt>Estimated width at pattern gauge</dt>
                <dd>{formatNumber(result.patternWidth)} in</dd>
              </div>
              <div>
                <dt>Estimated width at your gauge</dt>
                <dd>{formatNumber(result.actualWidth)} in</dd>
              </div>
              <div>
                <dt>Difference</dt>
                <dd>
                  {result.matches
                    ? "None"
                    : `${result.difference > 0 ? "+" : "−"}${formatNumber(Math.abs(result.difference))} in (${formatNumber(result.percent)}%)`}
                </dd>
              </div>
            </dl>

            <p>{explainComparison(result)}</p>

            <details className="gauge-math">
              <summary>How we worked this out</summary>
              <ul>
                <li>
                  Width at pattern gauge = {formatMath(result.stitchCount)} × 4 ÷{" "}
                  {formatMath(result.patternGauge)} = {formatMath(result.patternWidth)} in
                </li>
                <li>
                  Width at your gauge = {formatMath(result.stitchCount)} × 4 ÷{" "}
                  {formatMath(result.actualGauge)} = {formatMath(result.actualWidth)} in
                </li>
                <li>
                  Difference = {formatMath(result.actualWidth)} − {formatMath(result.patternWidth)} ={" "}
                  {formatSignedMath(result.difference)} in
                </li>
                <li>
                  Percentage = {formatMath(Math.abs(result.difference))} ÷{" "}
                  {formatMath(result.patternWidth)} × 100 ={" "}
                  {formatNumber(result.percent)}% of the pattern's width
                </li>
              </ul>
            </details>

            <p className="gauge-comparison-note">
              Both widths are estimates based on the same stitch count, not guaranteed
              finished measurements. Blocking, stitch pattern and how the fabric relaxes
              all affect the final size. If you change needle size to match the pattern's
              gauge, the fabric's drape and feel will change too, so knit and measure a
              new swatch.
            </p>
          </div>
        ) : (
          <p className="calculator-placeholder">
            {hasErrors
              ? "Please check the highlighted fields to see your comparison."
              : "Fill in all three fields to compare your gauge with the pattern."}
          </p>
        )}
      </div>
    </section>
  );
}
