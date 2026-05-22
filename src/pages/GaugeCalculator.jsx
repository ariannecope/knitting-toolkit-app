import { useState } from "react";
import swatch from "../assets/swatch.jpeg";

export default function GaugeCalculator() {
  const [stitches, setStitches] = useState("");
  const [width, setWidth] = useState("");
  // null works well for conditional rendering value that comes later
  const [gauge, setGauge] = useState(null);

  //parseFloat converts text into a decimal number--needed because input values come in as strings
  function calculateGauge() {
    const s = parseFloat(stitches);
    const w = parseFloat(width);

//     "If s OR w is invalid/falsy, / show an error and stop the function." ! means: “NOT” It flips truthiness.
    if (!s || !w) {
      setGauge("Please enter valid numbers.");
      return;
    }

    // basic gauge formula stitches divided by width (stitches per inch) .toFixed(2) rounds to two decimal places.
    const result = (s / w).toFixed(2);

    //rendering of results
    setGauge(`Gauge: ${result} stitches per inch`);
  }

  return (
    <div className="gauge-page">
      <h1>Gauge Calculator</h1>
      <p>Calculate your knitting gauge (stitches per inch).</p>
      <img src={swatch} alt="A small swatch being knit on circular needles"/>

      <div className="gauge-form">
        <input
          type="number"
          placeholder="Total stitches"
          value={stitches}
          onChange={(e) => setStitches(e.target.value)}
        />

        <input
          type="number"
          placeholder="Width (in inches)"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />

        <button onClick={calculateGauge}>
          Calculate Gauge
        </button>
      </div>

{/* IF gauge exists,
show the result box. */}
      {gauge && (
        <div className="gauge-result">
          {gauge}
        </div>
      )}
    </div>
  );
}

// User types
// ↓
// onChange fires
// ↓
// State updates
// ↓
// React rerenders
// ↓
// User clicks button
// ↓
// calculateGauge runs
// ↓
// Strings converted to numbers
// ↓
// Math performed
// ↓
// Gauge state updates
// ↓
// React rerenders again
// ↓
// Result appears