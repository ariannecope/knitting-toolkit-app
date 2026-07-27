import React from "react";

function YardageText() {
  return (
    <div className="yardage-text">
      <h2>Yarn Yardage--know what you need for your next project</h2>
      <p>
        Yarn yardage is the total length of yarn you need to make something. 
        Knowing this can ensure you buy (or spin) enough yarn for your next knitted creation. (Then you won't end up like the pitiful knitters who run out half-way through!)
      </p>
      <p>
        {/* Optional: add extra tips or examples */}
        A scarf may require 300-400 yards depending on stitch type and width.
      </p>
    </div>
  );
}

export default YardageText;