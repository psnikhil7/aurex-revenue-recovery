function Capabilities() {
  return (
    <section className="capabilities" id="capabilities">

      {/* HEADER */}
      <div className="capabilities-header">

        <div>
          <span className="capabilities-kicker">
            AUREX / SYSTEM CAPABILITIES
          </span>

          <h2>
            BUILT TO<br />
            RECOVER
          </h2>

          <p>
            AUREX combines payment intelligence, predictive analysis,
            and autonomous recovery to protect revenue at every stage.
          </p>
        </div>

        <div className="capabilities-status">
          <i></i>
          RECOVERY SYSTEM ACTIVE
        </div>

      </div>


      {/* CAPABILITY GRID */}
      <div className="capabilities-grid">

        {/* 01 */}
        <div className="capability-card">

          <div className="capability-top">
            <span>01</span>
            <span>DETECT</span>
          </div>

          <div className="capability-icon">
            !
          </div>

          <span className="capability-label">
            FAILURE INTELLIGENCE
          </span>

          <h3>
            UNDERSTAND<br />
            EVERY FAILURE
          </h3>

          <p>
            Identify failed payment events and determine
            the underlying reason before revenue is lost.
          </p>

          <div className="capability-data">
            <span>SIGNAL TYPES</span>
            <strong>CARD / BANK / NETWORK</strong>
          </div>

        </div>


        {/* 02 */}
        <div className="capability-card">

          <div className="capability-top">
            <span>02</span>
            <span>ANALYZE</span>
          </div>

          <div className="capability-icon">
            ◉
          </div>

          <span className="capability-label">
            RECOVERY PREDICTION
          </span>

          <h3>
            PREDICT<br />
            SUCCESS
          </h3>

          <p>
            Evaluate transaction and customer signals
            to estimate the probability of successful recovery.
          </p>

          <div className="capability-data">
            <span>OUTPUT</span>
            <strong>RECOVERY PROBABILITY</strong>
          </div>

        </div>


        {/* 03 */}
        <div className="capability-card">

          <div className="capability-top">
            <span>03</span>
            <span>DECIDE</span>
          </div>

          <div className="capability-icon ai">
            AI
          </div>

          <span className="capability-label">
            SMART RETRY
          </span>

          <h3>
            SELECT<br />
            THE BEST PATH
          </h3>

          <p>
            Compare recovery strategies and select
            the action with the highest expected outcome.
          </p>

          <div className="capability-data">
            <span>ACTION</span>
            <strong>SMART_RETRY</strong>
          </div>

        </div>


        {/* 04 */}
        <div className="capability-card">

          <div className="capability-top">
            <span>04</span>
            <span>ASSESS</span>
          </div>

          <div className="capability-icon">
            ◇
          </div>

          <span className="capability-label">
            RISK ANALYSIS
          </span>

          <h3>
            MEASURE<br />
            TRANSACTION RISK
          </h3>

          <p>
            Assess transaction conditions and customer
            history to determine recovery suitability.
          </p>

          <div className="capability-data">
            <span>OUTPUT</span>
            <strong>RISK LEVEL</strong>
          </div>

        </div>


        {/* 05 */}
        <div className="capability-card">

          <div className="capability-top">
            <span>05</span>
            <span>EXECUTE</span>
          </div>

          <div className="capability-icon">
            →
          </div>

          <span className="capability-label">
            AUTONOMOUS EXECUTION
          </span>

          <h3>
            ACT<br />
            AUTOMATICALLY
          </h3>

          <p>
            Execute the selected recovery strategy
            without requiring manual intervention.
          </p>

          <div className="capability-data">
            <span>MODE</span>
            <strong>AUTONOMOUS</strong>
          </div>

        </div>


        {/* 06 */}
        <div className="capability-card">

          <div className="capability-top">
            <span>06</span>
            <span>MONITOR</span>
          </div>

          <div className="capability-icon success">
            ✓
          </div>

          <span className="capability-label">
            REVENUE MONITORING
          </span>

          <h3>
            TRACK<br />
            RECOVERY
          </h3>

          <p>
            Continuously monitor recovered revenue,
            outstanding opportunities, and system performance.
          </p>

          <div className="capability-data">
            <span>METRIC</span>
            <strong>REVENUE RECOVERED</strong>
          </div>

        </div>

      </div>


      {/* BOTTOM STATEMENT */}
      <div className="capabilities-bottom">

        <span>
          AUREX / AUTONOMOUS REVENUE INFRASTRUCTURE
        </span>

        <strong>
          DETECT → DIAGNOSE → PREDICT → RECOVER
        </strong>

      </div>

    </section>
  );
}

export default Capabilities;