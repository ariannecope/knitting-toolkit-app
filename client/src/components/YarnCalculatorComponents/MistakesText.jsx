import React from "react";

function MistakesText() {
  return (
    <div className="mistakes-text">
      <h2>Common Yardage Mistakes:</h2>
      <ul>
        <li>Not measuring your gauge accurately</li>
        <li>Ignoring stitch pattern variations</li>
        <li>Underestimating fringe, borders, or extra details</li>
      </ul>
      <p>
        {/* Optional extra advice */}
        Double-check your calculations and consider buying a little extra yarn—it's safer than running out!
      </p>
    </div>
  );
}

export default MistakesText;