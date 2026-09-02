from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import joblib
import numpy as np
import os


# ============================================================
# AUREX AI ENGINE
# ============================================================

app = FastAPI(
    title="AUREX AI Engine",
    description="Autonomous Payment Recovery Intelligence API",
    version="2.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LOAD TRAINED ML MODEL
# ============================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "aurex_recovery_model_light.pkl"
)

try:
    model = joblib.load(MODEL_PATH)

    MODEL_LOADED = True

    print()
    print("========================================")
    print("       AUREX ML MODEL LOADED")
    print("========================================")
    print(f"Model: {MODEL_PATH}")
    print("Status: READY")
    print("========================================")
    print()

except Exception as e:
    model = None
    MODEL_LOADED = False

    print()
    print("========================================")
    print("       AUREX MODEL LOAD ERROR")
    print("========================================")
    print(str(e))
    print("========================================")
    print()


# ============================================================
# TRANSACTION INPUT MODEL
# ============================================================

class Transaction(BaseModel):
    amount: float
    payment_method: str
    failure_code: str
    retry_count: int
    customer_history: str


# ============================================================
# DEMO TRANSACTION DATA
# ============================================================

TRANSACTIONS = [

    {
        "id": "TXN-84721",
        "amount": 18450,
        "payment_method": "VISA",
        "failure_code": "DO_NOT_HONOR",
        "retry_count": 0,
        "customer_history": "POSITIVE"
    },

    {
        "id": "TXN-84722",
        "amount": 8200,
        "payment_method": "MASTERCARD",
        "failure_code": "INSUFFICIENT_FUNDS",
        "retry_count": 1,
        "customer_history": "POSITIVE"
    },

    {
        "id": "TXN-84723",
        "amount": 12500,
        "payment_method": "VISA",
        "failure_code": "NETWORK_ERROR",
        "retry_count": 0,
        "customer_history": "POSITIVE"
    },

    {
        "id": "TXN-84724",
        "amount": 4300,
        "payment_method": "AMEX",
        "failure_code": "EXPIRED_CARD",
        "retry_count": 0,
        "customer_history": "NEUTRAL"
    },

    {
        "id": "TXN-84725",
        "amount": 27600,
        "payment_method": "VISA",
        "failure_code": "DO_NOT_HONOR",
        "retry_count": 2,
        "customer_history": "POSITIVE"
    },

    {
        "id": "TXN-84726",
        "amount": 5600,
        "payment_method": "MASTERCARD",
        "failure_code": "TIMEOUT",
        "retry_count": 0,
        "customer_history": "POSITIVE"
    },

    {
        "id": "TXN-84727",
        "amount": 9100,
        "payment_method": "VISA",
        "failure_code": "INSUFFICIENT_FUNDS",
        "retry_count": 3,
        "customer_history": "NEGATIVE"
    },

    {
        "id": "TXN-84728",
        "amount": 32000,
        "payment_method": "VISA",
        "failure_code": "FRAUD_REVIEW",
        "retry_count": 0,
        "customer_history": "NEGATIVE"
    },

    {
        "id": "TXN-84729",
        "amount": 7600,
        "payment_method": "MASTERCARD",
        "failure_code": "DO_NOT_HONOR",
        "retry_count": 0,
        "customer_history": "POSITIVE"
    },

    {
        "id": "TXN-84730",
        "amount": 14500,
        "payment_method": "VISA",
        "failure_code": "NETWORK_ERROR",
        "retry_count": 1,
        "customer_history": "NEUTRAL"
    }

]


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "system": "AUREX",
        "status": "online",
        "ai_model": (
            "loaded"
            if MODEL_LOADED
            else "unavailable"
        ),
        "message": "AUREX AI Engine is running"
    }


# ============================================================
# DIAGNOSIS ENGINE
# ============================================================

def diagnose_failure(failure):

    if failure == "DO_NOT_HONOR":

        return (
            "CARD_DECLINED",
            "SMART_RETRY",
            "Failure appears potentially retryable"
        )

    elif failure in [
        "INSUFFICIENT_FUNDS",
        "FUNDS_UNAVAILABLE"
    ]:

        return (
            "INSUFFICIENT_FUNDS",
            "DELAYED_RETRY",
            "Temporary funding issue detected"
        )

    elif failure in [
        "EXPIRED_CARD",
        "INVALID_CARD"
    ]:

        return (
            "INVALID_PAYMENT_METHOD",
            "UPDATE_PAYMENT",
            "Payment method requires customer action"
        )

    elif failure in [
        "NETWORK_ERROR",
        "TIMEOUT"
    ]:

        return (
            "NETWORK_FAILURE",
            "NETWORK_RETRY",
            "Technical failure appears retryable"
        )

    elif failure in [
        "FRAUD_SUSPECTED",
        "FRAUD_REVIEW"
    ]:

        return (
            "FRAUD_REVIEW",
            "MANUAL_REVIEW",
            "Transaction requires fraud review"
        )

    else:

        return (
            "PAYMENT_FAILURE",
            "SMART_RETRY",
            "Generic payment recovery path"
        )


# ============================================================
# AUREX ML PREDICTION
# ============================================================

def ml_predict(transaction):

    if model is None:
        return None
    model_input = np.array([[
        transaction.payment_method.upper().strip(),
        transaction.failure_code.upper().strip(),
        transaction.customer_history.upper().strip(),
        transaction.amount,
        max(0, transaction.retry_count)
    ]], dtype=object)

    probability = model.predict_proba(
        model_input
    )[0][1]

    prediction = model.predict(
        model_input
    )[0]

    return {
        "probability": round(
            float(probability),
            3
        ),

        "prediction": int(prediction)
    }


# ============================================================
# AUREX DECISION ENGINE
# ============================================================

def predict_recovery(transaction):

    # --------------------------------------------------------
    # NORMALIZE INPUT
    # --------------------------------------------------------

    failure = (
        transaction.failure_code
        .upper()
        .strip()
    )

    history = (
        transaction.customer_history
        .upper()
        .strip()
    )

    payment_method = (
        transaction.payment_method
        .upper()
        .strip()
    )

    retries = max(
        0,
        transaction.retry_count
    )

    amount = max(
        0,
        transaction.amount
    )

    signals = []


    # ========================================================
    # FAILURE DIAGNOSIS
    # ========================================================

    (
        diagnosis,
        recommended_action,
        diagnosis_signal
    ) = diagnose_failure(failure)

    signals.append(
        diagnosis_signal
    )


    # ========================================================
    # CUSTOMER SIGNAL
    # ========================================================

    if history == "POSITIVE":

        signals.append(
            "Positive customer history"
        )

    elif history == "NEGATIVE":

        signals.append(
            "Negative customer history"
        )

    else:

        signals.append(
            "Neutral customer history"
        )


    # ========================================================
    # RETRY SIGNAL
    # ========================================================

    if retries == 0:

        signals.append(
            "No previous retry attempt"
        )

    elif retries == 1:

        signals.append(
            "Only one retry attempt"
        )

    elif retries == 2:

        signals.append(
            "Multiple retry attempts detected"
        )

    else:

        signals.append(
            "Retry limit reached"
        )


    # ========================================================
    # TRANSACTION VALUE
    # ========================================================

    if amount >= 10000:

        signals.append(
            "High-value transaction"
        )

    elif amount < 1000:

        signals.append(
            "Low-value transaction"
        )

    else:

        signals.append(
            "Standard-value transaction"
        )


    # ========================================================
    # PAYMENT METHOD
    # ========================================================

    if payment_method in [
        "VISA",
        "MASTERCARD",
        "AMEX",
        "CARD"
    ]:

        signals.append(
            "Recognized card payment method"
        )

    else:

        signals.append(
            "Alternative payment method"
        )


    # ========================================================
    # ML PREDICTION
    # ========================================================

    ml_result = ml_predict(
        transaction
    )

    if ml_result is not None:

        success_probability = (
            ml_result["probability"]
        )

        recovery_score = round(
            success_probability * 100
        )

        signals.append(
            "Machine learning recovery prediction generated"
        )

    else:

        success_probability = 0.0

        recovery_score = 0

        signals.append(
            "ML model unavailable"
        )


    # ========================================================
    # RISK LEVEL
    # ========================================================

    if failure in [
        "FRAUD_SUSPECTED",
        "FRAUD_REVIEW"
    ]:

        risk_level = "CRITICAL"

    elif retries >= 3:

        risk_level = "CRITICAL"

    elif failure in [
        "EXPIRED_CARD",
        "INVALID_CARD"
    ]:

        risk_level = "HIGH"

    elif success_probability >= 0.70:

        risk_level = "MEDIUM"

    elif success_probability >= 0.45:

        risk_level = "HIGH"

    else:

        risk_level = "CRITICAL"


    # ========================================================
    # FINAL DECISION
    # ========================================================

    if retries >= 3:

        decision = "ESCALATE"

        recommended_action = (
            "ALTERNATIVE_PAYMENT"
        )

    elif failure in [
        "FRAUD_SUSPECTED",
        "FRAUD_REVIEW"
    ]:

        decision = "ESCALATE"

        recommended_action = (
            "MANUAL_REVIEW"
        )

    elif failure in [
        "EXPIRED_CARD",
        "INVALID_CARD"
    ]:

        decision = "CUSTOMER_ACTION"

        recommended_action = (
            "UPDATE_PAYMENT"
        )

    elif success_probability >= 0.70:

        decision = "RECOVER"

    elif success_probability >= 0.45:

        decision = "HOLD"

    else:

        decision = "NO_ACTION"


    # ========================================================
    # EXPLANATION
    # ========================================================

    explanation_summary = (

        "AUREX combined transaction failure signals, "
        "customer history, retry behavior, payment method, "
        "transaction value, and a trained machine-learning "
        "model to estimate recovery probability."

    )


    explanation = {

        "signals": signals,

        "summary": explanation_summary

    }


    # ========================================================
    # FINAL RESULT
    # ========================================================

    return {

        "transaction_amount": amount,

        "payment_method": payment_method,

        "failure_code": failure,

        "diagnosis": diagnosis,

        "recovery_score": recovery_score,

        "success_probability": success_probability,

        "recommended_action": recommended_action,

        "decision": decision,

        "risk_level": risk_level,

        "retry_count": retries,

        "customer_history": history,

        "ai_model_used": MODEL_LOADED,

        "explanation": explanation

    }


# ============================================================
# ANALYZE TRANSACTION
# ============================================================

@app.post("/api/analyze-transaction")
def analyze_transaction(
    transaction: Transaction
):

    result = predict_recovery(
        transaction
    )


    # ========================================================
    # SERVER LOG
    # ========================================================

    print()

    print("========================================")
    print("          AUREX AI DECISION")
    print("========================================")

    print(
        f"Transaction Amount : "
        f"₹{transaction.amount:,.2f}"
    )

    print(
        f"Payment Method     : "
        f"{transaction.payment_method}"
    )

    print(
        f"Failure Code       : "
        f"{transaction.failure_code}"
    )

    print(
        f"Diagnosis          : "
        f"{result['diagnosis']}"
    )

    print(
        f"ML Recovery Score  : "
        f"{result['recovery_score']}%"
    )

    print(
        f"ML Probability     : "
        f"{result['success_probability'] * 100:.1f}%"
    )

    print(
        f"Recommended Action : "
        f"{result['recommended_action']}"
    )

    print(
        f"Decision           : "
        f"{result['decision']}"
    )

    print(
        f"Risk Level         : "
        f"{result['risk_level']}"
    )

    print(
        f"ML Model Used      : "
        f"{result['ai_model_used']}"
    )

    print("----------------------------------------")

    print("AUREX SIGNALS")

    for signal in result[
        "explanation"
    ]["signals"]:

        print(
            f"✓ {signal}"
        )

    print("========================================")
    print()


    return result


# ============================================================
# DASHBOARD METRICS
# ============================================================

@app.get("/dashboard-metrics")
def dashboard_metrics():

    analyzed_transactions = []


    # ========================================================
    # ANALYZE TRANSACTIONS
    # ========================================================

    for transaction_data in TRANSACTIONS:

        transaction = Transaction(

            amount=transaction_data["amount"],

            payment_method=transaction_data[
                "payment_method"
            ],

            failure_code=transaction_data[
                "failure_code"
            ],

            retry_count=transaction_data[
                "retry_count"
            ],

            customer_history=transaction_data[
                "customer_history"
            ]

        )


        result = predict_recovery(
            transaction
        )


        analyzed_transactions.append({

            "id": transaction_data["id"],

            "amount": transaction_data["amount"],

            "payment_method":
                transaction_data["payment_method"],

            "failure_code":
                transaction_data["failure_code"],

            "diagnosis":
                result["diagnosis"],

            "recovery_score":
                result["recovery_score"],

            "success_probability":
                result["success_probability"],

            "recommended_action":
                result["recommended_action"],

            "decision":
                result["decision"],

            "risk_level":
                result["risk_level"],

            "retry_count":
                transaction_data["retry_count"]

        })


    # ========================================================
    # COUNTS
    # ========================================================

    total_transactions = len(
        analyzed_transactions
    )

    failed_transactions = (
        total_transactions
    )


    # ========================================================
    # RECOVERABLE TRANSACTIONS
    # ========================================================

    recoverable_transactions = [

        transaction

        for transaction in analyzed_transactions

        if transaction["decision"] == "RECOVER"

    ]


    # ========================================================
    # REVENUE AT RISK
    # ========================================================

    revenue_at_risk = sum(

        transaction["amount"]

        for transaction in analyzed_transactions

    )


    # ========================================================
    # RECOVERY OPPORTUNITY
    # ========================================================

    recovery_opportunity = sum(

        transaction["amount"]
        * transaction["success_probability"]

        for transaction in analyzed_transactions

        if transaction["decision"] in [
            "RECOVER",
            "HOLD"
        ]

    )


    # ========================================================
    # POTENTIAL RECOVERY
    # ========================================================

    potential_recovery = sum(

        transaction["amount"]
        * transaction["success_probability"]

        for transaction in recoverable_transactions

    )


    # ========================================================
    # SUCCESS RATE
    # ========================================================

    if total_transactions > 0:

        success_rate = round(

            sum(

                transaction[
                    "success_probability"
                ]

                for transaction in analyzed_transactions

            )

            / total_transactions

            * 100,

            1

        )

    else:

        success_rate = 0


    # ========================================================
    # DECISION DISTRIBUTION
    # ========================================================

    decision_distribution = {

        "RECOVER": 0,

        "HOLD": 0,

        "ESCALATE": 0,

        "CUSTOMER_ACTION": 0,

        "NO_ACTION": 0

    }


    for transaction in analyzed_transactions:

        decision = transaction[
            "decision"
        ]

        if decision in decision_distribution:

            decision_distribution[
                decision
            ] += 1


    # ========================================================
    # RISK DISTRIBUTION
    # ========================================================

    risk_distribution = {

        "LOW": 0,

        "MEDIUM": 0,

        "HIGH": 0,

        "CRITICAL": 0

    }


    for transaction in analyzed_transactions:

        risk = transaction[
            "risk_level"
        ]

        if risk in risk_distribution:

            risk_distribution[
                risk
            ] += 1


    # ========================================================
    # DIAGNOSIS DISTRIBUTION
    # ========================================================

    diagnosis_distribution = {}


    for transaction in analyzed_transactions:

        diagnosis = transaction[
            "diagnosis"
        ]

        diagnosis_distribution[
            diagnosis
        ] = diagnosis_distribution.get(
            diagnosis,
            0
        ) + 1


    # ========================================================
    # FINAL DASHBOARD RESPONSE
    # ========================================================

    return {

        "total_transactions":
            total_transactions,

        "failed_transactions":
            failed_transactions,

        "revenue_at_risk":
            round(
                revenue_at_risk,
                2
            ),

        "recovery_opportunity":
            round(
                recovery_opportunity,
                2
            ),

        "potential_recovery":
            round(
                potential_recovery,
                2
            ),

        "success_rate":
            success_rate,

        "recoverable_transactions":
            len(
                recoverable_transactions
            ),

        "decision_distribution":
            decision_distribution,

        "risk_distribution":
            risk_distribution,

        "diagnosis_distribution":
            diagnosis_distribution,

        "transactions":
            analyzed_transactions,

        "ai_model_used":
            MODEL_LOADED

    }
    # ============================================================
# AUREX LIVE RECOVERY RUN
# ============================================================

@app.post("/api/run-recovery")
def run_recovery():

    audit_log = []

    total_revenue_at_risk = 0
    recovered_revenue = 0

    executed = 0
    escalated = 0
    stopped = 0

    transaction_results = []

    # ========================================================
    # PROCESS EVERY TRANSACTION
    # ========================================================

    for transaction_data in TRANSACTIONS:

        transaction = Transaction(
            amount=transaction_data["amount"],
            payment_method=transaction_data["payment_method"],
            failure_code=transaction_data["failure_code"],
            retry_count=transaction_data["retry_count"],
            customer_history=transaction_data["customer_history"]
        )

        result = predict_recovery(transaction)

        amount = transaction.amount
        total_revenue_at_risk += amount

        # ----------------------------------------------------
        # STOP RULE
        # ----------------------------------------------------

        if transaction.retry_count >= 3:

            execution_status = "STOPPED"
            recovered_amount = 0

            stopped += 1

            audit_log.append({
                "transaction_id": transaction_data["id"],
                "event": "STOP_RULE",
                "message": "Retry limit reached",
                "status": "STOPPED"
            })

        # ----------------------------------------------------
        # ESCALATION RULE
        # ----------------------------------------------------

        elif result["decision"] == "ESCALATE":

            execution_status = "ESCALATED"
            recovered_amount = 0

            escalated += 1

            audit_log.append({
                "transaction_id": transaction_data["id"],
                "event": "ESCALATION",
                "message": "Transaction requires manual review",
                "status": "ESCALATED"
            })

        # ----------------------------------------------------
        # RECOVERY EXECUTION
        # ----------------------------------------------------

        elif result["decision"] == "RECOVER":

            execution_status = "RECOVERED"

            # Simulated sandbox recovery.
            # Recovery amount is based on the ML probability.
            recovered_amount = round(
                amount * result["success_probability"],
                2
            )

            recovered_revenue += recovered_amount
            executed += 1

            audit_log.append({
                "transaction_id": transaction_data["id"],
                "event": "RECOVERY_EXECUTED",
                "action": result["recommended_action"],
                "probability": result["success_probability"],
                "amount": recovered_amount,
                "status": "SUCCESS"
            })

        # ----------------------------------------------------
        # NO ACTION / HOLD
        # ----------------------------------------------------

        else:

            execution_status = "NO_ACTION"
            recovered_amount = 0

            audit_log.append({
                "transaction_id": transaction_data["id"],
                "event": "NO_ACTION",
                "message": "Recovery probability below execution threshold",
                "status": "HELD"
            })

        # ----------------------------------------------------
        # TRANSACTION RESULT
        # ----------------------------------------------------

        transaction_results.append({

            "id": transaction_data["id"],

            "amount": amount,

            "failure_code":
                transaction_data["failure_code"],

            "diagnosis":
                result["diagnosis"],

            "recovery_score":
                result["recovery_score"],

            "success_probability":
                result["success_probability"],

            "recommended_action":
                result["recommended_action"],

            "decision":
                result["decision"],

            "risk_level":
                result["risk_level"],

            "execution_status":
                execution_status,

            "recovered_amount":
                recovered_amount

        })

    # ========================================================
    # FINAL METRICS
    # ========================================================

    if total_revenue_at_risk > 0:

        recovery_rate = round(
            (
                recovered_revenue
                / total_revenue_at_risk
            ) * 100,
            1
        )

    else:

        recovery_rate = 0

    # ========================================================
    # SERVER LOG
    # ========================================================

    print()
    print("========================================")
    print("       AUREX RECOVERY RUN")
    print("========================================")

    print(
        f"Transactions       : {len(TRANSACTIONS)}"
    )

    print(
        f"Revenue At Risk    : ₹{total_revenue_at_risk:,.2f}"
    )

    print(
        f"Recovered Revenue  : ₹{recovered_revenue:,.2f}"
    )

    print(
        f"Recovery Rate      : {recovery_rate}%"
    )

    print(
        f"Executed           : {executed}"
    )

    print(
        f"Escalated          : {escalated}"
    )

    print(
        f"Stopped            : {stopped}"
    )

    print("========================================")
    print()

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "system": "AUREX",

        "status": "RECOVERY_RUN_COMPLETED",

        "batch_size":
            len(TRANSACTIONS),

        "revenue_at_risk":
            round(
                total_revenue_at_risk,
                2
            ),

        "recovered_revenue":
            round(
                recovered_revenue,
                2
            ),

        "recovery_rate":
            recovery_rate,

        "executed":
            executed,

        "escalated":
            escalated,

        "stopped":
            stopped,

        "transactions":
            transaction_results,

        "audit_log":
            audit_log,

        "ai_model_used":
            MODEL_LOADED

    }