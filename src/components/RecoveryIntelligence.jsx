import { useEffect, useState } from "react";

function RecoveryIntelligence() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard-metrics");

      if (!response.ok) {
        throw new Error("Failed to load dashboard data");
      }

      const result = await response.json();

      console.log("AUREX RECOVERY INTELLIGENCE:", result);

      setData(result);
    } catch (error) {
      console.error("Recovery Intelligence Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(
      fetchDashboardData,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  // ------------------------------------------------------------
  // DEFAULT VALUES WHILE LOADING
  // ------------------------------------------------------------

  const transaction = data?.transactions?.[0];

  const amount = transaction?.amount ?? 0;

  const diagnosis =
    transaction?.diagnosis ?? "WAITING";

  const action =
    transaction?.recommended_action ?? "PENDING";

  const decision =
    transaction?.decision ?? "PENDING";

  const probability =
    transaction?.success_probability ?? 0;

  const probabilityPercent =
    (probability * 100).toFixed(1);

  const customerHistory =
    transaction?.customer_history ?? "POSITIVE";

  const riskLevel =
    transaction?.risk_level ?? "PENDING";

  const recovered =
    decision === "RECOVER";

  return (
    <section
      className="recovery-intelligence"
      id="recovery-intelligence"
    >

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="intelligence-header">

        <div>

          <span className="intelligence-kicker">
            AUREX / DECISION ENGINE
          </span>

         <h2>
  RECOVERY INTELLIGENCE
</h2>

          <p>
            AUREX analyzes every failed payment, evaluates the signals,
            and selects the recovery action with the highest probability
            of success.
          </p>

        </div>

        <div className="intelligence-status">

          <i></i>

          {data
            ? "DECISION ENGINE ACTIVE"
            : "CONNECTING TO AI ENGINE"}

        </div>

      </div>


      {/* ============================================================
          DECISION FLOW
      ============================================================ */}

      <div className="intelligence-flow">


        {/* ==========================================================
            STEP 01 — FAILURE
        ========================================================== */}

        <div className="intelligence-card">

          <div className="intelligence-number">
            01
          </div>

          <div className="intelligence-icon">
            !
          </div>

          <span className="intelligence-label">
            FAILURE DETECTED
          </span>

          <h3>
            PAYMENT<br />
            FAILED
          </h3>

          <p>
            Transaction declined before
            revenue is captured.
          </p>

          <div className="intelligence-meta">

            <span>
              AMOUNT
            </span>

            <strong>
              {loading
                ? "--"
                : `₹${amount.toLocaleString("en-IN")}`}
            </strong>

          </div>

        </div>


        {/* CONNECTOR */}

        <div className="intelligence-connector">

          <span>
            ANALYZE
          </span>

          →

        </div>


        {/* ==========================================================
            STEP 02 — DIAGNOSIS
        ========================================================== */}

        <div className="intelligence-card">

          <div className="intelligence-number">
            02
          </div>

          <div className="intelligence-icon">
            ◉
          </div>

          <span className="intelligence-label">
            SIGNAL ANALYSIS
          </span>

          <h3>
            DIAGNOSE<br />
            FAILURE
          </h3>

          <div className="signal-list">

            <div>

              <span>
                FAILURE CODE
              </span>

              <strong>
                {transaction?.failure_code ?? "WAITING"}
              </strong>

            </div>


            <div>

              <span>
                CUSTOMER HISTORY
              </span>

              <strong>
                {customerHistory}
              </strong>

            </div>


            <div>

              <span>
                RISK LEVEL
              </span>

              <strong>
                {riskLevel}
              </strong>

            </div>

          </div>

        </div>


        {/* CONNECTOR */}

        <div className="intelligence-connector">

          <span>
            PREDICT
          </span>

          →

        </div>


        {/* ==========================================================
            STEP 03 — AI DECISION
        ========================================================== */}

        <div className="intelligence-card decision">

          <div className="intelligence-number">
            03
          </div>

          <div className="intelligence-icon">
            AI
          </div>

          <span className="intelligence-label">
            AI DECISION
          </span>

          <h3>
            {action === "SMART_RETRY"
              ? "SMART"
              : action}
            <br />
            {action === "SMART_RETRY"
              ? "RETRY"
              : "SELECTED"}
          </h3>

          <p>
            Highest probability recovery
            action selected by AUREX.
          </p>

          <div className="recovery-probability">

            <span>
              RECOVERY PROBABILITY
            </span>

            <strong>
              {loading
                ? "--"
                : `${probabilityPercent}%`}
            </strong>

          </div>

        </div>


        {/* CONNECTOR */}

        <div className="intelligence-connector">

          <span>
            EXECUTE
          </span>

          →

        </div>


        {/* ==========================================================
            STEP 04 — RECOVERY
        ========================================================== */}

        <div
          className={`intelligence-card recovered-card ${
            recovered ? "active" : ""
          }`}
        >

          <div className="intelligence-number">
            04
          </div>

          <div className="intelligence-icon">
            ✓
          </div>

          <span className="intelligence-label">

            {recovered
              ? "REVENUE RECOVERED"
              : "RECOVERY OPPORTUNITY"}

          </span>

          <h3>

            {recovered ? (
              <>
                PAYMENT<br />
                CAPTURED
              </>
            ) : (
              <>
                RECOVERY<br />
                PENDING
              </>
            )}

          </h3>

          <p>

            {recovered
              ? "Failed revenue converted back into successful revenue."
              : "Transaction identified as a potential recovery opportunity."}

          </p>

          <div className="recovered-value">

            {recovered
              ? `+₹${amount.toLocaleString("en-IN")}`
              : `₹${amount.toLocaleString("en-IN")}`}

          </div>

        </div>

      </div>


      {/* ============================================================
          BOTTOM DECISION BAR
      ============================================================ */}

      <div className="decision-bar">


        {/* INPUT SIGNALS */}

        <div>

          <span>
            INPUT SIGNALS
          </span>

          <strong>
            5
          </strong>

        </div>


        {/* ACTIONS */}

        <div>

          <span>
            ACTIONS EVALUATED
          </span>

          <strong>
            04
          </strong>

        </div>


        {/* SELECTED ACTION */}

        <div>

          <span>
            SELECTED ACTION
          </span>

          <strong>
            {action}
          </strong>

        </div>


        {/* EXPECTED RECOVERY */}

        <div className="decision-result">

          <span>
            EXPECTED RECOVERY
          </span>

          <strong>
            {loading
              ? "--"
              : `${probabilityPercent}%`}
          </strong>

        </div>

      </div>


      {/* ============================================================
          LIVE AI STATUS
      ============================================================ */}

      <div
        style={{
          marginTop: "20px",
          fontSize: "12px",
          letterSpacing: "2px",
          opacity: 0.5
        }}
      >

        AUREX ML MODEL:{" "}

        {data?.ai_model_used
          ? "ONLINE"
          : "OFFLINE"}

        {"  |  "}

        DIAGNOSIS: {diagnosis}

        {"  |  "}

        DECISION: {decision}

      </div>

    </section>
  );
}

export default RecoveryIntelligence;