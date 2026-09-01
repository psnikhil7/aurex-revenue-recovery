function Insights() {
  return (
    <section className="insights" id="insights">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="insights-header">

        <div>
          <span className="insights-kicker">
            AUREX / REVENUE INTELLIGENCE
          </span>

          <h2>
            SEE THE<br />
            SIGNAL
          </h2>

          <p>
            AUREX turns payment behavior into actionable intelligence,
            revealing where revenue is at risk and where recovery is possible.
          </p>
        </div>

        <div className="insights-status">
          <i></i>
          INTELLIGENCE SYSTEM ONLINE
        </div>

      </div>


      {/* ============================================================
          TOP METRICS
      ============================================================ */}

      <div className="insights-metrics">

        <div className="insight-metric">
          <span>INPUT SIGNALS</span>
          <strong>05</strong>
        </div>

        <div className="insight-metric">
          <span>ACTIONS EVALUATED</span>
          <strong>04</strong>
        </div>

        <div className="insight-metric">
          <span>SELECTED ACTION</span>
          <strong>SMART_RETRY</strong>
        </div>

        <div className="insight-metric recovery">
          <span>EXPECTED RECOVERY</span>
          <strong>94.3%</strong>
        </div>

      </div>


      {/* ============================================================
          INSIGHT GRID
      ============================================================ */}

      <div className="insights-grid">

        {/* ============================================================
            01 — SIGNAL ANALYSIS
            ============================================================ */}

        <div className="insight-panel">

          <div className="insight-panel-top">
            <span>01</span>
            <span>DIAGNOSIS</span>
          </div>

          <span className="insight-label">
            FAILURE SIGNAL
          </span>

          <h3>
            CARD_DECLINED
          </h3>

          <p>
            AUREX evaluates the transaction context and identifies
            the underlying failure condition before recovery begins.
          </p>

          <div className="insight-data">

            <div>
              <span>CUSTOMER</span>
              <strong>ACTIVE</strong>
            </div>

            <div>
              <span>BANK</span>
              <strong>AVAILABLE</strong>
            </div>

            <div>
              <span>NETWORK</span>
              <strong>NORMAL</strong>
            </div>

          </div>

        </div>


        {/* ============================================================
            02 — RECOVERY PREDICTION
            ============================================================ */}

        <div className="insight-panel">

          <div className="insight-panel-top">
            <span>02</span>
            <span>PREDICTION</span>
          </div>

          <span className="insight-label">
            RECOVERY PROBABILITY
          </span>

          <h3>
            94.3%
          </h3>

          <p>
            The intelligence layer estimates the likelihood of
            successful recovery for each available action.
          </p>

          <div className="insight-progress">

            <div className="insight-progress-label">
              <span>SMART_RETRY</span>
              <strong>94.3%</strong>
            </div>

            <div className="insight-progress-track">
              <i style={{ width: "94.3%" }}></i>
            </div>

          </div>

        </div>


        {/* ============================================================
            03 — DECISION ENGINE
            ============================================================ */}

        <div className="insight-panel">

          <div className="insight-panel-top">
            <span>03</span>
            <span>DECISION</span>
          </div>

          <span className="insight-label">
            AUTONOMOUS DECISION
          </span>

          <h3>
            SMART_RETRY
          </h3>

          <p>
            Recovery strategies are compared and the action with
            the highest expected recovery outcome is selected.
          </p>

          <div className="insight-decision">

            <span>SELECTED PATH</span>

            <strong>
              SMART_RETRY
            </strong>

          </div>

        </div>


        {/* ============================================================
            04 — REVENUE IMPACT
            ============================================================ */}

        <div className="insight-panel">

          <div className="insight-panel-top">
            <span>04</span>
            <span>IMPACT</span>
          </div>

          <span className="insight-label">
            REVENUE OPPORTUNITY
          </span>

          <h3>
            ₹18,450
          </h3>

          <p>
            The selected recovery path converts an otherwise failed
            payment into measurable recovered revenue.
          </p>

          <div className="insight-decision">

            <span>EXPECTED RESULT</span>

            <strong>
              REVENUE RECOVERED
            </strong>

          </div>

        </div>

      </div>


      {/* ============================================================
          SYSTEM STATEMENT
      ============================================================ */}

      <div className="insights-system">

        <span>
          AUREX ML MODEL: ONLINE
        </span>

        <span>
          |
        </span>

        <span>
          DIAGNOSIS: CARD_DECLINED
        </span>

        <span>
          |
        </span>

        <strong>
          DECISION: RECOVER
        </strong>

      </div>

    </section>
  );
}

export default Insights;