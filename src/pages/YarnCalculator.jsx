import ToolPageLayout from "../components/ToolPageLayout";

import GaugeText from "../components/YarnCalculatorComponents/GaugeText.jsx";
import MistakesTest from "../components/YarnCalculatorComponents/MistakesText.jsx";
import YardageText from "../components/YarnCalculatorComponents/YardageText.jsx";
import YarnCalculatorComponent from "../components/YarnCalculatorComponents/YarnCalculator.jsx";

import YarnOne from '../assets/YarnOne.JPG';
import YarnTwo from '../assets/YarnTwo.JPG';

export default function YarnCalculator() {
  return (
    <ToolPageLayout title="Yarn Calculator Toolkit">

      <img src={YarnOne} alt="Basket holding dried flowers and a handknit shawl" />

      <YardageText />
      <GaugeText />
      <MistakesTest />

      <img src={YarnTwo} alt="Three fluffy skeins of yarn" />

      <YarnCalculatorComponent />

    </ToolPageLayout>
  );
}