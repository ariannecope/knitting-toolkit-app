import React, { useState } from "react";

/*
  YarnCalculator Component
  -------------------------
  This component calculates an estimated yarn yardage based on:
  - stitch gauge (stitches per inch)
  - row gauge (rows per inch)
  - project dimensions (width + length)

  It simulates how knitters estimate yarn usage in real projects.
*/

function YarnCalculator() {

  /*
    STATE VARIABLES
    ----------------
    These store user input values and calculation results.
    useState allows React to "remember" values between renders.
  */

  const [stGauge, setStGauge] = useState(""); // stitches per inch
  const [rowGauge, setRowGauge] = useState(""); // rows per inch
  const [width, setWidth] = useState(""); // project width in inches
  const [length, setLength] = useState(""); // project length in inches

  // results after calculation
  const [totalStitches, setTotalStitches] = useState(null);
  const [estimatedYardage, setEstimatedYardage] = useState(null);

  /*
    CALCULATION FUNCTION
    --------------------
    Runs when user clicks "Calculate"
    Converts inputs to numbers, validates them, then computes:
    - estimated total stitches in project
    - estimated yarn yardage
  */
  const calculateYardage = () => {
    const s = parseFloat(stGauge);
    const r = parseFloat(rowGauge);
    const w = parseFloat(width);
    const l = parseFloat(length);

    // input validation: ensures all fields are numbers
    if (isNaN(s) || isNaN(r) || isNaN(w) || isNaN(l)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

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

    // store results rounded to whole numbers for readability
    setTotalStitches(Math.round(stitches));
    setEstimatedYardage(Math.round(yardage));
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
    setTotalStitches(null);
    setEstimatedYardage(null);
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
        <label>Stitches per inch (horizontal gauge):</label>
        <input
          type="number"
          value={stGauge}
          onChange={(e) => setStGauge(e.target.value)}
        />
      </div>

      {/* INPUT: row gauge */}
      <div className="input-group">
        <label>Rows per inch (vertical gauge):</label>
        <input
          type="number"
          value={rowGauge}
          onChange={(e) => setRowGauge(e.target.value)}
        />
      </div>

      {/* INPUT: width */}
      <div className="input-group">
        <label>Project Width (inches):</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
      </div>

      {/* INPUT: length */}
      <div className="input-group">
        <label>Project Length (inches):</label>
        <input
          type="number"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
      </div>

      {/* ACTION BUTTONS */}
      <button onClick={calculateYardage}>Calculate</button>
      <button onClick={resetCalculator}>Reset</button>

      {/* CONDITIONAL RENDERING:
          Only show results if calculation has been done */}
      {totalStitches !== null && estimatedYardage !== null && (
        <div className="results">
          <p>Total Stitches: {totalStitches}</p>
          <p>Estimated Yardage: {estimatedYardage} yards</p>

          {/* Disclaimer explaining that this is an estimate */}
          <p style={{ fontStyle: "italic" }}>
            *This is a rough estimate. Actual yardage may vary with stitch type, yarn thickness, and tension.*
          </p>
        </div>
      )}
    </div>
  );
}

export default YarnCalculator;