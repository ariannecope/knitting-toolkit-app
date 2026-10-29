import React, { useState } from "react";
import { getPositiveNumberError } from "../../utils/validateNumber.js";

/*
  SkeinCalculator Component
  -------------------------
  Works out how many skeins to buy from:
  - required yardage (typed in, or filled in by the yardage estimator above)
  - yardage per skein (from the yarn label)
  - an optional extra-yarn allowance, as a percentage

  The required yardage lives in the page so the estimator can fill it in;
  it arrives here as a prop and is still editable.

  Results are worked out on every render instead of on a button click,
  so they always match the inputs on screen and are never stale.
*/

// rounds to at most one decimal place and adds thousands separators: 1100 -> "1,100"
function formatYards(yards) {
  return yards.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

// the extra allowance is optional: empty means 0%, otherwise it must be between 0 and 100
function getExtraPercentError(value) {
  const text = value.trim();
  if (text === "") return "";

  const number = Number(text);
  if (!Number.isFinite(number) || number < 0) {
    return "Please enter 0 or a positive number.";
  }
  if (number > 100) {
    return "Please enter 100% or less.";
  }
  return "";
}

const skeinWord = (count) => (count === 1 ? "skein" : "skeins");

/*
  Builds the plain-language summary, e.g.
  "Your project needs about 1,000 yd. Adding 10% extra (100 yd) brings that to 1,100 yd. ..."
  Amounts under 0.05 yd count as nothing, so we never say "0 yd from rounding".
*/
function explainResult(r) {
  const yd = (n) => `${formatYards(n)} yd`;
  const sentences = [`Your project needs about ${yd(r.required)}.`];

  if (r.extra > 0) {
    sentences.push(`Adding ${formatYards(r.extra)}% extra (${yd(r.allowance)}) brings that to ${yd(r.needed)}.`);
  } else {
    sentences.push("You haven't added any extra, so there's no cushion if your gauge or pattern uses more.");
  }

  sentences.push(`Buying ${r.skeins} ${skeinWord(r.skeins)} of ${yd(r.perSkein)} gives you ${yd(r.purchased)}.`);

  // where the leftover comes from: the extra allowance, rounding up to a whole skein, or both
  const sources = [];
  if (r.allowance >= 0.05) sources.push(`${yd(r.allowance)} from the extra allowance`);
  if (r.roundingExtra >= 0.05) sources.push(`${yd(r.roundingExtra)} from rounding up to a whole skein`);

  if (r.leftover < 0.05) {
    sentences.push(`If the project uses ${yd(r.required)}, you'll have little or nothing left over.`);
  } else {
    sentences.push(
      `If the project uses ${yd(r.required)}, you'll have about ${yd(r.leftover)} left over (${sources.join(" and ")}).`
    );
  }

  return sentences.join(" ");
}

function SkeinCalculator({ requiredYardage, onRequiredYardageChange }) {
  const [yardsPerSkein, setYardsPerSkein] = useState("");
  const [extraPercent, setExtraPercent] = useState("10"); // default 10% extra

  /*
    VALIDATION
    ----------
    Empty fields don't show an error while the user is still filling things in;
    they just keep the results hidden. Anything typed that isn't usable does.
  */
  const requiredError =
    requiredYardage.trim() === "" ? "" : getPositiveNumberError(requiredYardage);
  const perSkeinError =
    yardsPerSkein.trim() === "" ? "" : getPositiveNumberError(yardsPerSkein);
  const extraError = getExtraPercentError(extraPercent);

  const hasErrors = Boolean(requiredError || perSkeinError || extraError);
  const isComplete = requiredYardage.trim() !== "" && yardsPerSkein.trim() !== "";

  /*
    CALCULATION
    -----------
    Only runs when every input is valid, so no misleading numbers are shown.
  */
  let result = null;

  if (isComplete && !hasErrors) {
    const required = Number(requiredYardage);
    const perSkein = Number(yardsPerSkein);
    const extra = extraPercent.trim() === "" ? 0 : Number(extraPercent);

    /*
      STEP 1: Add the extra allowance
      --------------------------------
      required × (100 + extra%) ÷ 100, rounded to 2 decimals so tiny
      floating-point errors (like 1100.0000000000002) can't add a skein
    */
    const needed = Math.round(required * (100 + extra)) / 100;

    /*
      STEP 2: Round up to whole skeins
      ---------------------------------
      Skeins are sold whole, so any fraction means one more skein.
      The tiny subtraction stops a result like 5.000000000000001 rounding up to 6.
    */
    const skeins = Math.ceil(needed / perSkein - 1e-9);

    /*
      STEP 3: Yardage purchased and leftover
      ---------------------------------------
      Leftover is measured against the original required yardage,
      so it includes the extra allowance plus anything gained by rounding up.
    */
    const purchased = skeins * perSkein;

    result = {
      required,
      perSkein,
      extra,
      needed,
      skeins,
      purchased,
      allowance: needed - required,
      roundingExtra: purchased - needed,
      leftover: purchased - required,
      // true when the yardage divides evenly, so nothing was rounded up
      isExact: skeins - needed / perSkein < 1e-9,
    };
  }

  return (
    <div className="yarn-calculator skein-calculator">
      <h2>How Many Skeins?</h2>

      {/* INPUT: required yardage (can be filled in by the estimator above) */}
      <div className="input-group">
        <label htmlFor="skein-required">Required yardage (yards):</label>
        <input
          id="skein-required"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={requiredYardage}
          onChange={(e) => onRequiredYardageChange(e.target.value)}
          aria-invalid={Boolean(requiredError)}
          aria-describedby={
            requiredError ? "skein-required-hint skein-required-error" : "skein-required-hint"
          }
        />
        <p id="skein-required-hint" className="field-hint">
          Use your pattern's yardage, or calculate an estimate above and it will appear here.
        </p>
        {requiredError && (
          <p id="skein-required-error" className="field-error">{requiredError}</p>
        )}
      </div>

      {/* INPUT: yardage per skein */}
      <div className="input-group">
        <label htmlFor="skein-per-skein">Yardage per skein (yards):</label>
        <input
          id="skein-per-skein"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          value={yardsPerSkein}
          onChange={(e) => setYardsPerSkein(e.target.value)}
          aria-invalid={Boolean(perSkeinError)}
          aria-describedby={
            perSkeinError ? "skein-per-skein-hint skein-per-skein-error" : "skein-per-skein-hint"
          }
        />
        <p id="skein-per-skein-hint" className="field-hint">
          You'll find this on the yarn label.
        </p>
        {perSkeinError && (
          <p id="skein-per-skein-error" className="field-error">{perSkeinError}</p>
        )}
      </div>

      {/* INPUT: extra-yarn allowance */}
      <div className="input-group">
        <label htmlFor="skein-extra">Extra yarn allowance (%):</label>
        <input
          id="skein-extra"
          type="number"
          min="0"
          max="100"
          step="any"
          inputMode="decimal"
          value={extraPercent}
          onChange={(e) => setExtraPercent(e.target.value)}
          aria-invalid={Boolean(extraError)}
          aria-describedby={extraError ? "skein-extra-hint skein-extra-error" : "skein-extra-hint"}
        />
        <p id="skein-extra-hint" className="field-hint">
          A cushion for swatching, gauge changes and weaving in ends. Leave empty for none.
        </p>
        {extraError && <p id="skein-extra-error" className="field-error">{extraError}</p>}
      </div>

      {/* RESULTS: aria-live lets screen readers hear the updated answer */}
      <div aria-live="polite">
        {result ? (
          <div className="results skein-results">
            <p className="skein-summary">
              Buy <strong>{result.skeins} {skeinWord(result.skeins)}</strong>
            </p>

            <dl className="skein-breakdown">
              <div>
                <dt>Yardage needed (with {formatYards(result.extra)}% extra)</dt>
                <dd>{formatYards(result.needed)} yd</dd>
              </div>
              <div>
                <dt>
                  Yardage purchased ({result.skeins} × {formatYards(result.perSkein)} yd)
                </dt>
                <dd>{formatYards(result.purchased)} yd</dd>
              </div>
              <div>
                <dt>Estimated leftover</dt>
                <dd>{formatYards(result.leftover)} yd</dd>
              </div>
            </dl>

            {/* plain-language explanation of the numbers above */}
            <p>{explainResult(result)}</p>

            <details className="skein-math">
              <summary>How we worked this out</summary>
              <ul>
                <li>
                  Yardage needed = {formatYards(result.required)} × (1 + {formatYards(result.extra)} ÷ 100)
                  {" "}= {formatYards(result.needed)} yd
                </li>
                <li>
                  Skeins = {formatYards(result.needed)} ÷ {formatYards(result.perSkein)} ={" "}
                  {result.isExact
                    ? `${result.skeins} whole ${skeinWord(result.skeins)}`
                    : `${(result.needed / result.perSkein).toLocaleString("en-US", { maximumFractionDigits: 2 })}, rounded up to ${result.skeins} whole ${skeinWord(result.skeins)}`}
                </li>
                <li>
                  Purchased = {result.skeins} × {formatYards(result.perSkein)} ={" "}
                  {formatYards(result.purchased)} yd
                </li>
                <li>
                  Leftover = {formatYards(result.purchased)} − {formatYards(result.required)} ={" "}
                  {formatYards(result.leftover)} yd
                </li>
              </ul>
            </details>
          </div>
        ) : (
          <p className="calculator-placeholder">
            {hasErrors
              ? "Please check the highlighted fields to see your results."
              : "Enter your required yardage and the yardage per skein to see how many skeins to buy. Results update as you type."}
          </p>
        )}
      </div>
    </div>
  );
}

export default SkeinCalculator;
