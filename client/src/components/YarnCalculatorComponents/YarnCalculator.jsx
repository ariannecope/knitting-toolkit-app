import React, { useState } from "react";
import { getPositiveNumberError } from "../../utils/validateNumber.js";

/*
  YarnCalculator Component
  -------------------------
  This component calculates an estimated yarn yardage based on:
  - stitch gauge (stitches per inch)
  - row gauge (rows per inch)
  - project dimensions (width + length)

  It simulates how knitters estimate yarn usage in real projects.

  Results are worked out as the user types (like the skein calculator),
  so they always match the inputs on screen.

  onEstimate (optional) receives the estimated yardage whenever a new
  estimate is worked out, so the page can pass it on to the skein calculator.
*/

/*
  CALCULATION FUNCTION
  --------------------
  Converts inputs to numbers, validates them, then computes:
  - estimated total stitches in project
  - estimated yarn yardage
  Returns null when any input is missing or invalid, so no result is shown.
*/
function estimateYardage({ stGauge, rowGauge, width, length }) {
  // input validation: every field must be a number greater than 0
  // (empty, zero and negative values would give a meaningless estimate)
  if ([stGauge, rowGauge, width, length].some((value) => getPositiveNumberError(value))) {
    return null;
  }

  const s = parseFloat(stGauge);
  const r = parseFloat(rowGauge);
  const w = parseFloat(width);
  const l = parseFloat(length);

  /*
    STEP 1: Estimate total stitches
    --------------------------------
    Uses a simplified formula:
    stitches per inch × width × rows per inch × length

    This approximates total stitch volume of the project.
  */
  const stitches = s * w * r * l;

  /*
    STEP 2: Estimate yarn usage per stitch
    --------------------------------------
    This is a rough constant:
    average stitch ≈ 0.25 inches of yarn
    (varies in real life depending on stitch type)
  */
  const avgStitchLength = 0.25;

  /*
    STEP 3: Convert total stitch length into yards
    -----------------------------------------------
    36 inches = 1 yard, so we divide by 36
  */
  const yardage = (stitches * avgStitchLength) / 36;

  // results rounded to whole numbers for readability
  return {
    totalStitches: Math.round(stitches),
    estimatedYardage: Math.round(yardage),
  };
}

// a field only shows an error once something unusable has been typed in it;
// empty fields just keep the results hidden while the user fills things in
const fieldError = (value) => (value.trim() === "" ? "" : getPositiveNumberError(value));

function YarnCalculator({ onEstimate }) {

  /*
    STATE VARIABLES
    ----------------
    These store user input values; results and error messages are
    worked out from them on every render.
    useState allows React to "remember" values between renders.
  */

  const [stGauge, setStGauge] = useState(""); // stitches per inch
  const [rowGauge, setRowGauge] = useState(""); // rows per inch
  const [width, setWidth] = useState(""); // project width in inches
  const [length, setLength] = useState(""); // project length in inches

  // results (null until every field is valid)
  const result = estimateYardage({ stGauge, rowGauge, width, length });

  // validation messages shown beside each field ("" means no error)
  const errors = {
    stGauge: fieldError(stGauge),
    rowGauge: fieldError(rowGauge),
    width: fieldError(width),
    length: fieldError(length),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  /*
    INPUT HANDLER
    -------------
    Updates one input, and if the new values give a valid estimate,
    passes it on (e.g. to fill in the skein calculator).
  */
  const updateField = (setValue, field) => (e) => {
    const value = e.target.value;
    setValue(value);

    const next = estimateYardage({ stGauge, rowGauge, width, length, [field]: value });
    if (next) {
      onEstimate?.(next.estimatedYardage);
    }
  };

  /*
    RESET FUNCTION
    --------------
    Clears all inputs and results so the user can start over
  */
  const resetCalculator = () => {
    setStGauge("");
    setRowGauge("");
    setWidth("");
    setLength("");
  };

  /*
    UI / RENDER SECTION
    -------------------
    This is what the user sees on the screen.
    Each input updates its corresponding state variable.
  */
  return (
    <div className="yarn-calculator">
      <h2>Yarn Yardage Calculator</h2>

      {/* INPUT: stitch gauge */}
      <div className="input-group">
        <label htmlFor="yarn-st-gauge">Stitches per inch (horizontal gauge):</label>
        <input
          id="yarn-st-gauge"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={stGauge}
          onChange={updateField(setStGauge, "stGauge")}
          aria-invalid={Boolean(errors.stGauge)}
          aria-describedby={errors.stGauge ? "yarn-st-gauge-error" : undefined}
        />
        {errors.stGauge && (
          <p id="yarn-st-gauge-error" className="field-error">{errors.stGauge}</p>
        )}
      </div>

      {/* INPUT: row gauge */}
      <div className="input-group">
        <label htmlFor="yarn-row-gauge">Rows per inch (vertical gauge):</label>
        <input
          id="yarn-row-gauge"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={rowGauge}
          onChange={updateField(setRowGauge, "rowGauge")}
          aria-invalid={Boolean(errors.rowGauge)}
          aria-describedby={errors.rowGauge ? "yarn-row-gauge-error" : undefined}
        />
        {errors.rowGauge && (
          <p id="yarn-row-gauge-error" className="field-error">{errors.rowGauge}</p>
        )}
      </div>

      {/* INPUT: width */}
      <div className="input-group">
        <label htmlFor="yarn-width">Project Width (inches):</label>
        <input
          id="yarn-width"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={width}
          onChange={updateField(setWidth, "width")}
          aria-invalid={Boolean(errors.width)}
          aria-describedby={errors.width ? "yarn-width-error" : undefined}
        />
        {errors.width && (
          <p id="yarn-width-error" className="field-error">{errors.width}</p>
        )}
      </div>

      {/* INPUT: length */}
      <div className="input-group">
        <label htmlFor="yarn-length">Project Length (inches):</label>
        <input
          id="yarn-length"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={length}
          onChange={updateField(setLength, "length")}
          aria-invalid={Boolean(errors.length)}
          aria-describedby={errors.length ? "yarn-length-error" : undefined}
        />
        {errors.length && (
          <p id="yarn-length-error" className="field-error">{errors.length}</p>
        )}
      </div>

      {/* ACTION BUTTON */}
      <button type="button" onClick={resetCalculator}>Reset</button>

      {/* CONDITIONAL RENDERING:
          Only show results once every field is valid.
          aria-live lets screen readers hear the updated answer */}
      <div aria-live="polite">
        {result ? (
          <div className="results">
            <p>Total Stitches: {result.totalStitches}</p>
            <p>Estimated Yardage: {result.estimatedYardage} yards</p>

            {/* Disclaimer explaining that this is an estimate */}
            <p style={{ fontStyle: "italic" }}>
              *This is a rough estimate. Actual yardage may vary with stitch type, yarn thickness, and tension.*
            </p>
          </div>
        ) : (
          <p className="calculator-placeholder">
            {hasErrors
              ? "Please check the highlighted fields to see your estimate."
              : "Fill in all four fields to see your estimate. Results update as you type."}
          </p>
        )}
      </div>
    </div>
  );
}

export default YarnCalculator;