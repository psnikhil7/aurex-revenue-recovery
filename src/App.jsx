import { useState } from "react";
import "./App.css";

import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Capabilities from "./components/Capabilities";
import ControlRoom from "./components/ControlRoom";
import Insights from "./components/Insights";
import RecoveryIntelligence from "./components/RecoveryIntelligence";


function App() {
  const [activityRefresh, setActivityRefresh] = useState(0);

  const handleRecoveryComplete = () => {
    setActivityRefresh((prev) => prev + 1);
  };

  return (
    <div className="aurex-page">

      <Hero />

      <HowItWorks />

      <Capabilities />

      <ControlRoom
        onRecoveryComplete={handleRecoveryComplete}
      />

      <Insights />

      <RecoveryIntelligence />


    </div>
  );
}

export default App;