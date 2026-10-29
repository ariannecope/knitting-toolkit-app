import { useState } from "react";
import { getPositiveNumberError } from "../../utils/validateNumber.js";
import { formatNumber } from "../../utils/formatNumber.js";

/*
  BlockingCalculator Component
  ----------------------------
  Compares a swatch's width and height before and after blocking, and shows
  how much each dimension grew or shrank, in inches and as a percentage.

  Results are worked out as the user types (like GaugeComparison),
  so they always match the inputs on screen.
*/

// changes smaller than this (as a percentage) are labelled "about the same";
// the measured numbers and signed changes are still shown in full
const SAME_THRESHOLD_PERCENT = 1;

// inches use up to 3 decimals so eighths of an inch (4.125, 4.375) show exactly
const formatInches = (number) => formatNumber(number, 3);

// percentages use up to 2 decimals so small changes are still visible
const formatPercent = (number) => formatNumber(number, 2);

// signed version: "+0.5" or "−0.25" (true minus sign), and plain "0" when it rounds to nothing
function formatSigned(number, format) {
  const text = format(Math.abs(number));
  if (text === "0") return "0";
  return `${number < 0 ? "−" : "+"}${text}`;
}

/*
  CALCULATION
  -----------
  For each dimension:
  change = after − before
  percentage = change ÷ before × 100 (relative to the unblocked swatch)
*/
function measureChange(before, after) {
  const change = after - before;
  // rounded to 6 decimals so floating-point noise (0.9999999%) can't flip a label at exactly 1%
  const percent = Math.round((change / before) * 100 * 1e6) / 1e6;

  let status = "same";
  if (percent >= SAME_THRESHOLD_PERCENT) status = "grew";
  if (percent <= -SAME_THRESHOLD_PERCENT) status = "shrank";

  return { before, after, change, percent, status };
}

const STATUS_LABELS = { grew: "Grew", shrank: "Shrank", same: "About the same" };

// headline, e.g. "Grew in width and height" or "Grew in width, height about the same"
function summarize(width, height) {
  if (width.status === height.status) {
    return width.status === "same"
      ? "Stayed about the same size"
      : `${STATUS_LABELS[width.status]} in width and height`;
  }

  const part = (dimension, name) =>
    dimension.status === "same" ? `${name} about the same` : `${dimension.status} in ${name}`;
  const text = `${part(width, "width")}, ${part(height, "height")}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// plain-language clause for one dimension, e.g. "width grew by 0.5 inches (12.5%), from 4 to 4.5 inches."
function describe(dimension, name) {
  const from = `from ${formatInches(dimension.before)} to ${formatInches(dimension.after)} inches`;
  const amount = `${formatInches(Math.abs(dimension.change))} inches (${formatPercent(Math.abs(dimension.percent))}%)`;

  if (dimension.status === "grew") return `${name} grew by ${amount}, ${from}.`;
  if (dimension.status === "shrank") return `${name} shrank by ${amount}, ${from}.`;
  if (dimension.change === 0) return `${name} stayed the same, at ${formatInches(dimension.before)} inches.`;
  return `${name} stayed about the same (${from}, a change of under ${SAME_THRESHOLD_PERCENT}%, which is within normal measuring variation).`;
}

export default function BlockingCalculator() {
  const [beforeWidth, setBeforeWidth] = useState("");
  const [beforeHeight, setBeforeHeight] = useState("");
  const [afterWidth, setAfterWidth] = useState("");
  const [afterHeight, setAfterHeight] = useState("");

  // a field only shows an error once something unusable has been typed in it;
  // empty fields just keep the results hidden while the user fills things in
  const fieldError = (value) => (value.trim() === "" ? "" : getPositiveNumberError(value));

  // the four inputs, grouped into "before" and "after" fieldsets below
  const groups = [
    {
      legend: "Before blocking",
      fields: [
        { id: "blocking-before-width", label: "Width (inches)", value: beforeWidth, setValue: setBeforeWidth },
        { id: "blocking-before-height", label: "Height (inches)", value: beforeHeight, setValue: setBeforeHeight },
      ],
    },
    {
      legend: "After blocking",
      fields: [
        { id: "blocking-after-width", label: "Width (inches)", value: afterWidth, setValue: setAfterWidth },
        { id: "blocking-after-height", label: "Height (inches)", value: afterHeight, setValue: setAfterHeight },
      ],
    },
  ];

  const allFields = groups.flatMap((group) => group.fields);
  const hasErrors = allFields.some((field) => fieldError(field.value));
  const isComplete = allFields.every((field) => field.value.trim() !== "");

  // only calculate when every input is valid, so no misleading numbers are shown
  const result =
    isComplete && !hasErrors
      ? {
          width: measureChange(Number(beforeWidth), Number(afterWidth)),
          height: measureChange(Number(beforeHeight), Number(afterHeight)),
        }
      : null;

  const dimensions = result
    ? [
        { name: "width", label: "Width", ...result.width },
        { name: "height", label: "Height", ...result.height },
      ]
    : [];

  return (
    <section className="blocking-calculator" aria-labelledby="blocking-calculator-title">
      <h2 id="blocking-calculator-title">Before and After Blocking</h2>
      <p>
        Measure your swatch edge to edge, lying flat and unstretched, before and
        after you block it. Results update as you type.
      </p>

      <div className="blocking-groups">
        {groups.map((group) => (
          <fieldset className="blocking-group" key={group.legend}>
            <legend>{group.legend}</legend>
            <div className="gauge-form">
              {group.fields.map((field) => {
                const error = fieldError(field.value);
                return (
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
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${field.id}-error` : undefined}
                    />
                    {error && (
                      <p id={`${field.id}-error`} className="field-error">{error}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {/* aria-live lets screen readers hear the updated answer */}
      <div aria-live="polite">
        {result ? (
          <div className="blocking-results">
            <p className="blocking-summary">{summarize(result.width, result.height)}</p>

            <dl className="gauge-breakdown">
              {dimensions.map((d) => (
                <div key={d.name}>
                  <dt>
                    {d.label}{" "}
                    <span className={`blocking-status blocking-status-${d.status}`}>
                      {STATUS_LABELS[d.status]}
                    </span>
                  </dt>
                  <dd>
                    {formatInches(d.before)} in → {formatInches(d.after)} in
                    <br />
                    <span className="blocking-change">
                      {formatSigned(d.change, formatInches)} in ({formatSigned(d.percent, formatPercent)}%)
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <p>
              After blocking, your swatch's {describe(result.width, "width")} Its{" "}
              {describe(result.height, "height")} Most patterns give their gauge
              after blocking, so measure your stitches and rows on the blocked swatch
              before comparing them with the pattern.
            </p>

            <details className="gauge-math">
              <summary>How we worked this out</summary>
              <ul>
                {dimensions.map((d) => (
                  <li key={d.name}>
                    {d.label} change = {formatInches(d.after)} − {formatInches(d.before)} ={" "}
                    {formatSigned(d.change, formatInches)} in; {formatSigned(d.change, formatInches)} ÷{" "}
                    {formatInches(d.before)} × 100 = {formatSigned(d.percent, formatPercent)}%
                  </li>
                ))}
                <li>
                  Changes under {SAME_THRESHOLD_PERCENT}% either way are labelled "about the same".
                </li>
              </ul>
            </details>

            <p className="blocking-note">
              These results apply to the swatch you measured. A finished piece may
              block differently depending on the yarn, fiber, stitch pattern and
              blocking method (wet blocking, steam or spray), so block your swatch the
              same way you plan to block the finished piece.
            </p>
          </div>
        ) : (
          <p className="calculator-placeholder">
            {hasErrors
              ? "Please check the highlighted fields to see your results."
              : "Fill in all four measurements to see how your swatch changed."}
          </p>
        )}
      </div>
    </section>
  );
}
