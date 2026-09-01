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
<footer className="aurex-footer">
  <div className="footer-line"></div>

  <div className="footer-content">
    <div>
      <div className="footer-brand">AUREX</div>
      <div className="footer-subtitle">
        AUTONOMOUS REVENUE RECOVERY AGENT
      </div>
    </div>

    <div className="footer-creator">
      <span>DESIGNED & BUILT BY</span>
      <strong>NIKHIL</strong>
      <a href="mailto:nikhilprabhakaran2005@gmail.com">
        nikhilprabhakaran2005@gmail.com
      </a>
    </div>
  </div>

  <div className="footer-bottom">
    <span>© 2026 AUREX</span>
    <span>REVENUE RECOVERY INTELLIGENCE</span>
  </div>
</footer>

    </div>
  );
}

export default App;