function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="how-header">

        <div>
          <span className="how-kicker">
            AUREX / AUTONOMOUS WORKFLOW
          </span>

          <h2>
            HOW IT<br />
            WORKS
          </h2>

          <p>
            AUREX transforms failed payments into recoverable revenue
            through an autonomous decision pipeline.
          </p>
        </div>

        <div className="how-status">
          <i></i>
          AUTONOMOUS RECOVERY ACTIVE
        </div>

      </div>


      {/* ============================================================
          SYSTEM FLOW
      ============================================================ */}

      <div className="how-flow">

        {/* STEP 01 */}

        <div className="how-step">

          <div className="how-step-top">
            <span>01</span>
            <span className="how-state">INPUT</span>
          </div>

          <div className="how-icon danger">
            !
          </div>

          <span className="how-label">
            PAYMENT EVENT
          </span>

          <h3>
            PAYMENT<br />
            FAILED
          </h3>

          <p>
            A failed transaction is detected
            before revenue is permanently lost.
          </p>

          <div className="how-data">
            <span>EVENT</span>
            <strong>CARD_DECLINED</strong>
          </div>

        </div>


        {/* CONNECTOR */}

        <div className="how-connector">
          <span>DETECT</span>
          →
        </div>


        {/* STEP 02 */}

        <div className="how-step">

          <div className="how-step-top">
            <span>02</span>
            <span className="how-state">ANALYZE</span>
          </div>

          <div className="how-icon">
            ◉
          </div>

          <span className="how-label">
            SIGNAL INTELLIGENCE
          </span>

          <h3>
            UNDERSTAND<br />
            THE CAUSE
          </h3>

          <p>
            AUREX evaluates customer, bank,
            network and transaction signals.
          </p>

          <div className="how-data">
            <span>SIGNALS</span>
            <strong>12 ANALYZED</strong>
          </div>

        </div>


        {/* CONNECTOR */}

        <div className="how-connector">
          <span>DIAGNOSE</span>
          →
        </div>


        {/* STEP 03 */}

        <div className="how-step ai-step">

          <div className="how-step-top">
            <span>03</span>
            <span className="how-state">PREDICT</span>
          </div>

          <div className="how-icon ai">
            AI
          </div>

          <span className="how-label">
            DECISION ENGINE
          </span>

          <h3>
            SELECT<br />
            RECOVERY
          </h3>

          <p>
            The AI engine evaluates recovery
            actions and selects the optimal path.
          </p>

          <div className="how-data">
            <span>DECISION</span>
            <strong>SMART_RETRY</strong>
          </div>

        </div>


        {/* CONNECTOR */}

        <div className="how-connector">
          <span>EXECUTE</span>
          →
        </div>


        {/* STEP 04 */}

        <div className="how-step success-step">

          <div className="how-step-top">
            <span>04</span>
            <span className="how-state">OUTPUT</span>
          </div>

          <div className="how-icon success">
            ✓
          </div>

          <span className="how-label">
            REVENUE RECOVERY
          </span>

          <h3>
            REVENUE<br />
            RECOVERED
          </h3>

          <p>
            The selected recovery action converts
            failed revenue back into successful revenue.
          </p>

          <div className="how-data">
            <span>RESULT</span>
            <strong>₹18,450 CAPTURED</strong>
          </div>

        </div>

      </div>


      {/* ============================================================
          BOTTOM SYSTEM STATEMENT
      ============================================================ */}

      <div className="how-bottom">

        <div>
          <span>01</span>
          <strong>DETECT</strong>
          <small>Failed payment identified</small>
        </div>

        <div>
          <span>02</span>
          <strong>DIAGNOSE</strong>
          <small>Failure cause understood</small>
        </div>

        <div>
          <span>03</span>
          <strong>PREDICT</strong>
          <small>Best recovery action selected</small>
        </div>

        <div>
          <span>04</span>
          <strong>RECOVER</strong>
          <small>Revenue returned</small>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;