import { useState } from "react";
import Mittens from "../assets/Mittens.jpeg";

export default function ProjectEstimator() {
  const [gauge, setGauge] = useState("");
  const [stitches, setStitches] = useState("");
  const [result, setResult] = useState(null);

  function calculateEstimate() {
    const g = parseFloat(gauge);
    const s = parseFloat(stitches);

    if (!g || !s) {
      setResult("Please enter valid numbers.");
      return;
    }

    // VERY simple placeholder formula (you'll improve later)
    const estimate = Math.round((s / g) * 10);

    setResult(`Estimated yardage: ${estimate} yards`);
  }

  return (
    <div className="estimator-page">
      <h1>Project Estimator</h1>
      <p>Estimate yarn usage for your project.</p>
      <img src={Mittens} alt="A pair of mittens being knit on double-pointed needles"/>

      <div className="estimator-form">
        <input
          type="number"
          placeholder="Gauge (stitches per inch)"
          value={gauge}
          onChange={(e) => setGauge(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total stitches"
          value={stitches}
          onChange={(e) => setStitches(e.target.value)}
        />

        <button onClick={calculateEstimate}>
          Calculate
        </button>
      </div>

      {result && (
        <div className="estimator-result">
          {result}
        </div>
      )}
    </div>
  );
}