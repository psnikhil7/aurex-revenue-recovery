import { useEffect, useState } from "react";
import RecoveryActivity from "./RecoveryActivity";

function ControlRoom({ onRecoveryComplete }) {
  const [executing, setExecuting] = useState(false);
  const [recoveryRun, setRecoveryRun] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");

  // ============================================================
  // SELECTED TRANSACTION
  // ============================================================

  const [transaction] = useState({
    id: "TXN-84721",
    amount: 18450,
    payment_method: "VISA",
    failure_code: "DO_NOT_HONOR",
    retry_count: 0,
    customer_history: "POSITIVE",
  });

  // ============================================================
  // LIVE DETECTION TIMER
  // ============================================================

  const [detectedAt] = useState(Date.now());
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      setSecondsAgo(
        Math.floor((Date.now() - detectedAt) / 1000)
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [detectedAt]);

  // ============================================================
  // FETCH DASHBOARD DATA
  // ============================================================

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8001/dashboard-metrics"
      );

      if (!response.ok) {
        throw new Error("Dashboard request failed");
      }

      const data = await response.json();

      console.log("AUREX DASHBOARD:", data);

      setDashboardData(data);
    } catch (err) {
      console.error("AUREX DASHBOARD ERROR:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ============================================================
  // RUN AUREX RECOVERY AGENT
  // ============================================================

  const executeRecovery = async () => {
    setExecuting(true);
    setRecoveryRun(null);
    setAiData(null);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/run-recovery",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail
            ? JSON.stringify(data.detail)
            : "Recovery run failed"
        );
      }

      console.log("🔥 AUREX FULL RESPONSE:", data);
      console.log("🔥 AUREX AUDIT LOG:", data.audit_log);

      // Store complete recovery result
      setRecoveryRun(data);

      // Send result to parent if required
      if (onRecoveryComplete) {
        onRecoveryComplete(data);
      }

      // ========================================================
      // SELECT TXN-84721
      // ========================================================

      if (
        data.transactions &&
        data.transactions.length > 0
      ) {
        const selectedTransaction =
          data.transactions.find(
            (item) => item.id === transaction.id
          ) || data.transactions[0];

        setAiData(selectedTransaction);
      }

      // Refresh dashboard metrics
      await fetchDashboardData();

    } catch (err) {
      console.error("AUREX RECOVERY ERROR:", err);
      setError(err.message);
    } finally {
      setExecuting(false);
    }
  };

  // ============================================================
  // DYNAMIC VALUES
  // ============================================================

  const confidence = aiData
    ? `${(aiData.success_probability * 100).toFixed(1)}%`
    : "--";

  const diagnosis = aiData
    ? aiData.diagnosis
    : "WAITING FOR ANALYSIS";

  const recommendedAction = aiData
    ? aiData.recommended_action
    : "PENDING";

  const riskLevel = aiData
    ? aiData.risk_level
    : "PENDING";

  const recoveredRevenue = recoveryRun
    ? recoveryRun.recovered_revenue
    : 0;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      className="control-room"
      id="control-room"
    >

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="control-header">

        <div>
          <span className="control-kicker">
            AUREX / CONTROL ROOM
          </span>

          <h2>
            REVENUE INTELLIGENCE
          </h2>

          <p>
            Autonomous monitoring of failed payments
            and recovery opportunities.
          </p>
        </div>

        <div className="system-status">
          <i></i>
          AI SYSTEM ONLINE
        </div>

      </div>


      {/* ========================================================
          MAIN DASHBOARD
      ======================================================== */}

      <div className="control-grid">

        {/* ======================================================
            TRANSACTION CARD
        ====================================================== */}

        <div className="payment-card">

          <div className="card-top">
            <span>LIVE TRANSACTION</span>
            <span>{transaction.id}</span>
          </div>

          <div className="payment-amount">
            ₹{transaction.amount.toLocaleString("en-IN")}
          </div>

          <div
            className={`payment-status ${
              recoveryRun
                ? "status-recovered"
                : ""
            }`}
          >
            <i></i>

            {recoveryRun
              ? "RECOVERY RUN COMPLETE"
              : "PAYMENT FAILED"}
          </div>

          <div className="payment-reason">
            {aiData
              ? diagnosis
              : "CARD DECLINED"}
          </div>

          <div className="payment-details">

            <div>
              <span>METHOD</span>

              <strong>
                {transaction.payment_method} CARD
              </strong>
            </div>

            <div>
              <span>FAILURE CODE</span>

              <strong>
                {transaction.failure_code}
              </strong>
            </div>

            <div>
              <span>RISK LEVEL</span>

              <strong
                className={
                  riskLevel === "CRITICAL"
                    ? "risk-critical"
                    : riskLevel === "MEDIUM"
                    ? "risk-medium"
                    : riskLevel === "LOW"
                    ? "risk-low"
                    : "risk-high"
                }
              >
                {riskLevel}
              </strong>
            </div>

          </div>

          <div className="payment-detected">
            <span>DETECTED</span>

            <strong>
              {secondsAgo}s AGO
            </strong>
          </div>

        </div>


        {/* ======================================================
            AI ENGINE
        ====================================================== */}

        <div className="ai-engine">

          <div className="engine-label">
            AUREX AI ENGINE
          </div>

          <div
            className={`engine-core ${
              recoveryRun
                ? "core-success"
                : executing
                ? "core-executing"
                : ""
            }`}
          >

            <div className="core-ring">

              {recoveryRun
                ? "✓"
                : executing
                ? "..."
                : "AI"}

            </div>

          </div>

          <div
            className={`engine-status ${
              recoveryRun
                ? "engine-success"
                : executing
                ? "engine-executing"
                : ""
            }`}
          >

            {recoveryRun
              ? "RECOVERY RUN COMPLETE"
              : executing
              ? "ANALYZING PAYMENT BATCH"
              : "READY FOR RECOVERY"}

          </div>

          <div className="engine-signals">

            <span>✓ CUSTOMER SIGNALS</span>
            <span>✓ BANK SIGNALS</span>
            <span>✓ NETWORK SIGNALS</span>
            <span>✓ ML PREDICTION</span>

          </div>

          <div className="engine-diagnosis">

            <span>DIAGNOSIS</span>

            <strong>
              {aiData
                ? aiData.diagnosis
                : "WAITING"}
            </strong>

          </div>

        </div>


        {/* ======================================================
            DECISION CARD
        ====================================================== */}

        <div className="decision-card">

          <div className="card-top">
            <span>AI DECISION</span>
            <span>CONFIDENCE</span>
          </div>

          <div className="confidence">
            {confidence}
          </div>

          <div className="decision-action">
            {recommendedAction}
          </div>

          <p>
            {aiData
              ? `AUREX diagnosed ${aiData.diagnosis} and selected ${aiData.recommended_action} as the optimal recovery path.`
              : "AI engine will analyze transaction signals and determine the optimal recovery path."}
          </p>

          <button
            className={`execute-btn ${
              recoveryRun
                ? "recovery-success"
                : ""
            }`}
            onClick={executeRecovery}
            disabled={executing}
          >

            {recoveryRun
              ? "✓ RECOVERY COMPLETE"
              : executing
              ? "RUNNING AUREX AI..."
              : "EXECUTE RECOVERY →"}

          </button>


          {/* ====================================================
              BATCH RESULT
          ==================================================== */}

          {recoveryRun && (

            <div className="decision-result">

              <span>BATCH RESULT</span>

              <strong>
                ₹
                {recoveredRevenue.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}

                {" "}RECOVERED
              </strong>

            </div>

          )}


          {/* ====================================================
              ERROR
          ==================================================== */}

          {error && (

            <div className="error-message">
              ERROR: {error}
            </div>

          )}

        </div>

      </div>


      {/* ========================================================
          RECOVERY PIPELINE
      ======================================================== */}

      <div className="recovery-pipeline">

        <div className="pipeline-step active">

          <span>01</span>

          <strong>FAILED</strong>

          <small>
            Payment detected
          </small>

        </div>

        <div className="pipeline-line"></div>

        <div
          className={`pipeline-step ${
            recoveryRun
              ? "active"
              : ""
          }`}
        >

          <span>02</span>

          <strong>DIAGNOSED</strong>

          <small>
            {aiData
              ? aiData.diagnosis
              : "Awaiting analysis"}
          </small>

        </div>

        <div className="pipeline-line"></div>

        <div
          className={`pipeline-step ${
            recoveryRun
              ? "active"
              : ""
          }`}
        >

          <span>03</span>

          <strong>DECISION</strong>

          <small>
            {aiData
              ? aiData.recommended_action
              : "Awaiting AI"}
          </small>

        </div>

        <div className="pipeline-line"></div>

        <div
          className={`pipeline-step ${
            recoveryRun
              ? "recovered active"
              : "recovered"
          }`}
        >

          <span>04</span>

          <strong>
            {recoveryRun
              ? "RECOVERED"
              : "PENDING"}
          </strong>

          <small>
            {recoveryRun
              ? "Revenue captured"
              : "Awaiting recovery"}
          </small>

        </div>

      </div>


      {/* ========================================================
          BATCH RECOVERY SUMMARY
      ======================================================== */}

      <div className="control-summary">

        <div>

          <span>REVENUE AT RISK</span>

          <strong>

            {recoveryRun
              ? `₹${recoveryRun.revenue_at_risk.toLocaleString(
                  "en-IN"
                )}`
              : dashboardData
              ? `₹${dashboardData.revenue_at_risk.toLocaleString(
                  "en-IN"
                )}`
              : "--"}

          </strong>

        </div>


        <div>

          <span>RECOVERED REVENUE</span>

          <strong>

            {recoveryRun
              ? `₹${recoveryRun.recovered_revenue.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`
              : "--"}

          </strong>

        </div>


        <div>

          <span>RECOVERY RATE</span>

          <strong>

            {recoveryRun
              ? `${recoveryRun.recovery_rate}%`
              : "--"}

          </strong>

        </div>


        <div>

          <span>ACTIONS EXECUTED</span>

          <strong>

            {recoveryRun
              ? recoveryRun.executed
              : "--"}

          </strong>

        </div>

      </div>


      {/* ========================================================
          AGENT OUTCOME
      ======================================================== */}

      {recoveryRun && (

        <div className="control-summary">

          <div>

            <span>BATCH PROCESSED</span>

            <strong>
              {recoveryRun.batch_size}
            </strong>

          </div>


          <div>

            <span>ESCALATED</span>

            <strong>
              {recoveryRun.escalated}
            </strong>

          </div>


          <div>

            <span>STOPPED</span>

            <strong>
              {recoveryRun.stopped}
            </strong>

          </div>


          <div>

            <span>AI MODEL</span>

            <strong>
              {recoveryRun.ai_model_used
                ? "ONLINE"
                : "OFFLINE"}
            </strong>

          </div>

        </div>

      )}


      {/* ========================================================
          RECOVERY ACTIVITY — ONLY ONE
      ======================================================== */}

      <RecoveryActivity
        activity={recoveryRun?.audit_log || []}
      />

    </section>
  );
}

export default ControlRoom;