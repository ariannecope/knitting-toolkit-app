import React, { useState } from "react";

function YarnCalculator() {
  const [stGauge, setStGauge] = useState("");
  const [rowGauge, setRowGauge] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [totalStitches, setTotalStitches] = useState(null);
  const [estimatedYardage, setEstimatedYardage] = useState(null);

  const calculateYardage = () => {
    const s = parseFloat(stGauge);
    const r = parseFloat(rowGauge);
    const w = parseFloat(width);
    const l = parseFloat(length);

    if (isNaN(s) || isNaN(r) || isNaN(w) || isNaN(l)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    // Total stitches
    const stitches = s * w * r * l;

    // Average stitch length in inches (rough estimate)
    const avgStitchLength = 0.25;

    // Total yardage
    const yardage = (stitches * avgStitchLength) / 36;

    setTotalStitches(Math.round(stitches));
    setEstimatedYardage(Math.round(yardage));
  };

  const resetCalculator = () => {
    setStGauge("");
    setRowGauge("");
    setWidth("");
    setLength("");
    setTotalStitches(null);
    setEstimatedYardage(null);
  };

  return (
    <div className="yarn-calculator">
      <h2>Yarn Yardage Calculator</h2>
      <div className="input-group">
        <label>Stitches per inch (horizontal gauge):</label>
        <input
          type="number"
          value={stGauge}
          onChange={(e) => setStGauge(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Rows per inch (vertical gauge):</label>
        <input
          type="number"
          value={rowGauge}
          onChange={(e) => setRowGauge(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Project Width (inches):</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Project Length (inches):</label>
        <input
          type="number"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        />
      </div>

      <button onClick={calculateYardage}>Calculate</button>
      <button onClick={resetCalculator}>Reset</button>

      {totalStitches !== null && estimatedYardage !== null && (
        <div className="results">
          <p>Total Stitches: {totalStitches}</p>
          <p>Estimated Yardage: {estimatedYardage} yards</p>
          <p style={{ fontStyle: "italic" }}>
            *This is a rough estimate. Actual yardage may vary with stitch type, yarn thickness, and tension.*
          </p>
        </div>
      )}
    </div>
  );
}

export default YarnCalculator;