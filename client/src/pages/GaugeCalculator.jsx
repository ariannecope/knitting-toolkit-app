import { useState } from "react";
// square crop of swatch.jpeg, framed around the knitting for the round photo
import swatch from "../assets/swatchCircle.jpg";
// pencil-style drawing of stockinette stitch, shown above the calculator inputs
import stockinetteSwatch from "../assets/stockinetteSwatch.svg";

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
      <img
        src={swatch}
        alt="A small swatch being knit on circular needles"
        className="image-standard gauge-hero"
      />

      <h2>What is Gauge?</h2>
      <p>
        Gauge is the number of stitches (and rows) that fit into a set
        measurement of knitted fabric, usually written as stitches per inch or
        stitches per 4 inches (10 cm). It depends on your yarn, your needles,
        the stitch pattern, and how tightly or loosely you knit.
      </p>

      <h2>Why Gauge Matters</h2>
      <p>
        Patterns are written for a specific gauge. If yours is different, the
        finished piece will be a different size. For example, a sweater body
        of 200 stitches is meant to measure 40 inches at 5 stitches per inch,
        but at 5.5 stitches per inch it comes out closer to 36 inches.
      </p>
      <p>
        Gauge also changes how the fabric feels and drapes, and how much yarn
        you'll use, so checking it first saves time and yarn.
      </p>

      <h2>How to Use This Calculator</h2>
      <ol className="gauge-steps">
        <li>
          Knit a swatch at least 4 to 6 inches wide, using the yarn, needles,
          and stitch pattern from your project.
        </li>
        <li>
          Wash and dry the swatch the way you'll treat the finished piece, then
          lay it flat.
        </li>
        <li>
          Measure a section across the middle, away from the edges, and count
          the stitches in it, including half stitches.
        </li>
        <li>
          Enter the number of stitches and the width you measured in inches,
          then click Calculate Gauge.
        </li>
        <li>
          Compare your result with the pattern. If it lists stitches per 4
          inches, divide that number by 4. More stitches per inch than the
          pattern means you're knitting tighter, so try larger needles; fewer
          means try smaller needles.
        </li>
      </ol>

      <img
        src={stockinetteSwatch}
        alt="Pencil sketch of a knitted swatch in stockinette stitch, showing columns of V-shaped stitches"
        className="gauge-swatch-sketch"
      />

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

        <button onClick={calculateGauge}>Calculate Gauge</button>
      </div>

      {/* IF gauge exists,
show the result box. */}
      {gauge && <div className="gauge-result">{gauge}</div>}
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