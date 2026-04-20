import { useState } from "react";
import swatch from "../assets/swatch.jpeg";

export default function GaugeCalculator() {
  const [stitches, setStitches] = useState("");
  const [width, setWidth] = useState("");
  const [gauge, setGauge] = useState(null);

  function calculateGauge() {
    const s = parseFloat(stitches);
    const w = parseFloat(width);

    if (!s || !w) {
      setGauge("Please enter valid numbers.");
      return;
    }

    // basic gauge formula (stitches per inch)
    const result = (s / w).toFixed(2);

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

      {gauge && (
        <div className="gauge-result">
          {gauge}
        </div>
      )}
    </div>
  );
}