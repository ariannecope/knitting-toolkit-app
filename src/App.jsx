import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home.jsx'; 
import BreedExplorer from './pages/BreedExplorer';
import Shop from './pages/Shop';
import YarnCalculator from './pages/YarnCalculator';
import ProjectTracker from './pages/ProjectTracker';
import ProjectEstimator from './pages/ProjectEstimator';
import GaugeCalculator from './pages/GaugeCalculator';

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breed-explorer" element={<BreedExplorer />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/yarn-calculator" element={<YarnCalculator />} />
        <Route path="/project-tracker" element={<ProjectTracker />} />
        <Route path="/project-estimator" element={<ProjectEstimator />} />
        <Route path="/gauge-calculator" element={<GaugeCalculator />} />
        {/* future pages go here */}
      </Routes>
    </div>
  );
}

export default App;

