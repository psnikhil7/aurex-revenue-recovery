import { useEffect, useState } from "react";

function Hero() {
  const [dashboardData, setDashboardData] = useState(null);

  // ============================================================
  // FETCH LIVE DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          /api/dashboard-metrics
        );

        if (!response.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const data = await response.json();

        console.log("AUREX HERO:", data);

        setDashboardData(data);
      } catch (error) {
        console.error("AUREX HERO ERROR:", error);
      }
    };

    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 10000);

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // LIVE TRANSACTION
  // ============================================================

  const transaction = dashboardData?.transactions?.[0];

  const transactionId = transaction?.id ?? "TXN-84721";

  const amount = transaction?.amount ?? 0;

  const paymentMethod =
    transaction?.payment_method ?? "VISA";

  const failureCode =
    transaction?.failure_code ?? "CARD_DECLINED";

  const diagnosis =
    transaction?.diagnosis ?? "WAITING";

  const recommendedAction =
    transaction?.recommended_action ?? "PENDING";

  const probability =
    transaction?.success_probability ?? 0;

  const probabilityPercent =
    (probability * 100).toFixed(1);

  const decision =
    transaction?.decision ?? "PENDING";

  const recovered =
    decision === "RECOVER";

  // ============================================================
  // LIVE DASHBOARD METRICS
  // ============================================================

  const revenueAtRisk =
    dashboardData?.revenue_at_risk ?? 0;

  const recoveryOpportunity =
    dashboardData?.recovery_opportunity ?? 0;

  const successRate =
    dashboardData?.success_rate ?? 0;

  // ============================================================
  // FORMATTING
  // ============================================================

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  const formatMillions = (value) => {
    return `₹${(Number(value) / 1000000).toFixed(2)}M`;
  };

  const formatThousands = (value) => {
    return `₹${(Number(value) / 1000).toFixed(2)}K`;
  };

  return (
    <section className="hero">

      {/* ============================================================
          NAVBAR
      ============================================================ */}

      <nav className="navbar">

        <div className="navbar-left">

          <span className="brand-name">
            AUREX
          </span>

          <b>/</b>

          <span>
            AUTONOMOUS REVENUE INTELLIGENCE
          </span>

        </div>


        <div className="navbar-right">

          <span>
            SYSTEM 01
          </span>

          <a href="#how-it-works">
            HOW IT WORKS
          </a>

          <a href="#capabilities">
            CAPABILITIES
          </a>

          <a href="#insights">
            INSIGHTS
          </a>

          <button className="nav-access">
            REQUEST ACCESS
            <i></i>
          </button>

        </div>

      </nav>


      {/* ============================================================
          MAIN HERO
      ============================================================ */}

      <main className="hero-main">

        {/* ==========================================================
            STATUS
        ========================================================== */}

        <div className="hero-kicker">

          <i></i>

          <span>
            REVENUE CONTROL SYSTEM
          </span>

          <b>
            /
          </b>

          <span>
            ONLINE
          </span>

        </div>


        {/* ==========================================================
            HERO GRID
        ========================================================== */}

        <div className="hero-grid">


          {/* ========================================================
              LEFT SIDE
          ======================================================== */}

          <div className="hero-left">

            <h1 className="hero-title">

              <span>
                STOP
              </span>

              <span>
                LOSING
              </span>

              <span>
                REVENUE.
              </span>

            </h1>


            <p className="hero-description">

              Every failed payment is a recovery opportunity.

              <br />

              AUREX detects the failure, understands the cause,
              and selects the

              <br />

              right recovery action.

            </p>


            {/* ======================================================
                HERO BUTTONS
            ====================================================== */}

            <div className="hero-buttons">

              <button
                className="primary-btn"
                onClick={() =>
                  document
                    .getElementById("control-room")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >

                ENTER CONTROL ROOM

                <span>
                  ↗
                </span>

              </button>


              <button
                className="secondary-btn"
                onClick={() =>
                  document
                    .getElementById("recovery-intelligence")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >

                VIEW RECOVERY FLOW

                <span>
                  ↓
                </span>

              </button>

            </div>

          </div>


          {/* ========================================================
              RIGHT SIDE
          ======================================================== */}

          <div className="hero-right">


            {/* PANEL LABEL */}

            <div className="panel-label">

              <span>
                AUREX
              </span>

              <b>
                /
              </b>

              <span>
                RECOVERY INTELLIGENCE
              </span>

            </div>


            {/* ======================================================
                RECOVERY PANEL
            ====================================================== */}

            <div className="recovery-panel">


              {/* ====================================================
                  PANEL HEADER
              ==================================================== */}

              <div className="panel-header">

                <span>
                  TRANSACTION {transactionId.replace("TXN-", "")}
                </span>

                <span className="monitoring">

                  <i></i>

                  MONITORING

                </span>

              </div>


              {/* ====================================================
                  STEP 01 — PAYMENT STATUS
              ==================================================== */}

              <div
                className={`recovery-step ${
                  recovered ? "recovered" : "failed"
                }`}
              >

                <div className="step-number">
                  01
                </div>


                <div className="step-content">

                  <span className="step-label">
                    PAYMENT STATUS
                  </span>

                  <strong>
                    {recovered ? "RECOVERED" : "FAILED"}
                  </strong>

                  <small>
                    {formatCurrency(amount)}
                    &nbsp; / &nbsp;
                    {diagnosis}
                  </small>

                </div>


                <div
                  className={`step-icon ${
                    recovered ? "success" : "danger"
                  }`}
                >
                  {recovered ? "✓" : "!"}
                </div>

              </div>


              {/* ====================================================
                  STEP 02 — AUREX ANALYSIS
              ==================================================== */}

              <div className="recovery-step">

                <div className="step-number">
                  02
                </div>


                <div className="step-content">

                  <span className="step-label">
                    AUREX ANALYSIS
                  </span>

                  <strong>
                    {diagnosis === "WAITING"
                      ? "DIAGNOSING"
                      : diagnosis.replaceAll("_", " ")}
                  </strong>

                  <small>
                    CUSTOMER&nbsp; / &nbsp;BANK&nbsp; / &nbsp;NETWORK SIGNALS
                  </small>

                </div>


                <div className="step-icon">
                  ·
                </div>

              </div>


              {/* ====================================================
                  STEP 03 — RECOVERY ACTION
              ==================================================== */}

              <div className="recovery-step">

                <div className="step-number">
                  03
                </div>


                <div className="step-content">

                  <span className="step-label">
                    RECOVERY ACTION
                  </span>

                  <strong>
                    {recommendedAction === "SMART_RETRY"
                      ? "SMART RETRY"
                      : recommendedAction.replaceAll("_", " ")}
                  </strong>

                  <small>
                    OPTIMAL RECOVERY PATH SELECTED
                  </small>

                </div>


                <div className="step-icon action">
                  →
                </div>

              </div>


              {/* ====================================================
                  STEP 04 — RECOVERY STATUS
              ==================================================== */}

              <div
                className={`recovery-step ${
                  recovered ? "recovered" : ""
                }`}
              >

                <div className="step-number">
                  04
                </div>


                <div className="step-content">

                  <span className="step-label">
                    REVENUE STATUS
                  </span>

                  <strong>
                    {recovered
                      ? "RECOVERED"
                      : "RECOVERY PENDING"}
                  </strong>

                  <small>
                    {recovered
                      ? `${formatCurrency(amount)} RETURNED TO REVENUE`
                      : "RECOVERY OPPORTUNITY IDENTIFIED"}
                  </small>

                </div>


                <div className="step-icon success">
                  {recovered ? "✓" : "→"}
                </div>

              </div>


              {/* ====================================================
                  PANEL STATS
              ==================================================== */}

              <div className="panel-stats">


                {/* MODEL CONFIDENCE */}

                <div className="panel-stat">

                  <span>
                    MODEL CONFIDENCE
                  </span>

                  <strong>
                    {transaction
                      ? `${probabilityPercent}%`
                      : "--"}
                  </strong>

                </div>


                {/* EXECUTION TIME */}

                <div className="panel-stat">

                  <span>
                    EXECUTION TIME
                  </span>

                  <strong>
                    0.42s
                  </strong>

                </div>


                {/* REVENUE RECOVERED */}

                <div className="panel-stat">

                  <span>
                    REVENUE RECOVERED
                  </span>

                  <strong>
                    {transaction
                      ? formatThousands(amount)
                      : "--"}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>


      {/* ============================================================
          BACKGROUND CURRENCY
      ============================================================ */}

      <div className="currency-background">

        <span className="currency currency-one">
          $
        </span>

        <span className="currency currency-two">
          €
        </span>

        <span className="currency currency-three">
          £
        </span>

        <span className="currency currency-four">
          ₹
        </span>

        <span className="currency currency-five">
          ¥
        </span>

        <span className="currency currency-six">
          ₿
        </span>

        <span className="currency currency-seven">
          $
        </span>

        <span className="currency currency-eight">
          ₹
        </span>

        <span className="currency currency-nine">
          €
        </span>

        <span className="currency currency-ten">
          £
        </span>

        <span className="currency currency-eleven">
          ¥
        </span>

        <span className="currency currency-twelve">
          ₿
        </span>

      </div>


      {/* ============================================================
          BOTTOM METRICS
      ============================================================ */}

      <div className="hero-data">


        {/* ==========================================================
            REVENUE AT RISK
        ========================================================== */}

        <div className="hero-data-item">

          <span className="hero-data-label">
            REVENUE AT RISK
          </span>

          <strong className="hero-data-value">

            {dashboardData
              ? formatMillions(revenueAtRisk)
              : "--"}

          </strong>

          <span className="hero-data-change negative">

            −12.4%

            <span>
              VS LAST 30 DAYS
            </span>

          </span>

        </div>


        {/* ==========================================================
            RECOVERY POTENTIAL
        ========================================================== */}

        <div className="hero-data-item">

          <span className="hero-data-label">
            RECOVERY POTENTIAL
          </span>

          <strong className="hero-data-value">

            {dashboardData
              ? formatMillions(recoveryOpportunity)
              : "--"}

          </strong>

          <span className="hero-data-change positive">

            +18.7%

            <span>
              VS LAST 30 DAYS
            </span>

          </span>

        </div>


        {/* ==========================================================
            SUCCESS RATE
        ========================================================== */}

        <div className="hero-data-item">

          <span className="hero-data-label">
            SUCCESS RATE
          </span>

          <strong className="hero-data-value">

            {dashboardData
              ? `${successRate}%`
              : "--"}

          </strong>

          <span className="hero-data-change positive">

            +9.2%

            <span>
              VS LAST 30 DAYS
            </span>

          </span>

        </div>

      </div>

    </section>
  );
}

export default Hero;