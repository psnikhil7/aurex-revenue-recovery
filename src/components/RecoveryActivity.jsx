function RecoveryActivity({ activity = [] }) {
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) {
      return "—";
    }

    return `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatProbability = (probability) => {
    if (probability === undefined || probability === null) {
      return "—";
    }

    return `${(Number(probability) * 100).toFixed(1)}%`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "SUCCESS":
        return "activity-success";

      case "HELD":
        return "activity-held";

      case "STOPPED":
        return "activity-stopped";

      case "ESCALATED":
        return "activity-escalated";

      default:
        return "";
    }
  };

  return (
    <section
      className="recovery-activity"
      id="recovery-activity"
    >
      {/* HEADER */}

      <div className="activity-header">
        <div>
          <span className="control-kicker">
            AUREX / ACTIVITY
          </span>

          <h2>RECOVERY ACTIVITY</h2>

          <p>
            Live audit trail of autonomous recovery decisions.
          </p>
        </div>

        <div className="activity-status">
          <i></i>
          {activity.length > 0
            ? "AUDIT STREAM ACTIVE"
            : "AUDIT STREAM STANDBY"}
        </div>
      </div>

      {/* TABLE */}

      <div className="activity-table">

        <div className="activity-table-header">
          <span>TRANSACTION</span>
          <span>EVENT</span>
          <span>ACTION</span>
          <span>PROBABILITY</span>
          <span>AMOUNT</span>
          <span>STATUS</span>
        </div>

        {activity.length === 0 ? (
          <div className="activity-empty">
            EXECUTE RECOVERY TO VIEW AUDIT ACTIVITY
          </div>
        ) : (
          activity.map((item, index) => (
            <div
              className="activity-row"
              key={`${item.transaction_id || item.id || "txn"}-${index}`}
            >
              {/* TRANSACTION */}

              <div className="activity-transaction">
                <strong>
                  {item.transaction_id || item.id || "—"}
                </strong>
              </div>

              {/* EVENT */}

              <div className="activity-event">
                {item.event || "RECOVERY ANALYSIS"}
              </div>

              {/* ACTION */}

              <div className="activity-action">
                {item.action ||
                  item.recommended_action ||
                  "—"}
              </div>

              {/* PROBABILITY */}

              <div className="activity-probability">
                {formatProbability(
                  item.probability ??
                    item.success_probability
                )}
              </div>

              {/* AMOUNT */}

              <div className="activity-amount">
                {formatAmount(item.amount)}
              </div>

              {/* STATUS */}

              <div>
                <span
                  className={`activity-status-badge ${getStatusClass(
                    item.status
                  )}`}
                >
                  {item.status || "UNKNOWN"}
                </span>
              </div>
            </div>
          ))
        )}

      </div>

      {/* FOOTER */}

      <div className="activity-footer">
        <span>
          {activity.length} EVENTS PROCESSED
        </span>

        <span>
          AUREX AUDIT ENGINE
        </span>
      </div>
    </section>
  );
}

export default RecoveryActivity;