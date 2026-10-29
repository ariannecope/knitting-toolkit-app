import { useState } from "react";
import ToolPageLayout from "../components/ToolPageLayout";

import GaugeText from "../components/YarnCalculatorComponents/GaugeText.jsx";
import MistakesTest from "../components/YarnCalculatorComponents/MistakesText.jsx";
import YardageText from "../components/YarnCalculatorComponents/YardageText.jsx";
import YarnCalculatorComponent from "../components/YarnCalculatorComponents/YarnCalculator.jsx";
import SkeinCalculator from "../components/YarnCalculatorComponents/SkeinCalculator.jsx";

import YarnOne from '../assets/YarnOne.JPG';
import YarnTwo from '../assets/YarnTwo.JPG';

export default function YarnCalculator() {
  // required yardage is kept here so the yardage estimator can fill in the skein calculator;
  // it stays a string like any input value, and the user can still edit it
  const [requiredYardage, setRequiredYardage] = useState("");

  return (
    <ToolPageLayout title="Yarn Calculator">
      <img
        src={YarnOne}
        alt="Basket holding dried flowers and a handknit shawl"
        className="image-standard"
      />

      <YardageText />
      <GaugeText />
      <MistakesTest />

      <img
        src={YarnTwo}
        alt="Three fluffy skeins of yarn"
        className="image-standard"
      />

      <YarnCalculatorComponent
        onEstimate={(yards) => setRequiredYardage(String(yards))}
      />

      <SkeinCalculator
        requiredYardage={requiredYardage}
        onRequiredYardageChange={setRequiredYardage}
      />
    </ToolPageLayout>
  );
}