from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# AUREX AI ENGINE
# ============================================================

app = FastAPI(
    title="AUREX AI Engine",
    description="Autonomous Payment Recovery Intelligence API",
    version="1.0.0"
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
# TRANSACTION INPUT MODEL
# ============================================================

class Transaction(BaseModel):
    amount: float
    payment_method: str
    failure_code: str
    retry_count: int
    customer_history: str


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "system": "AUREX",
        "status": "online",
        "message": "AUREX AI Engine is running"
    }


# ============================================================
# AUREX DECISION ENGINE
# ============================================================

def predict_recovery(transaction: Transaction):

    # --------------------------------------------------------
    # NORMALIZE INPUT
    # --------------------------------------------------------

    failure = transaction.failure_code.upper().strip()
    history = transaction.customer_history.upper().strip()
    payment_method = transaction.payment_method.upper().strip()

    retries = max(0, transaction.retry_count)
    amount = max(0, transaction.amount)

    # Base recovery score
    score = 50

    signals = []


    # ========================================================
    # CUSTOMER HISTORY ANALYSIS
    # ========================================================

    if history == "POSITIVE":

        score += 20

        signals.append(
            "Positive customer history"
        )

    elif history == "NEGATIVE":

        score -= 20

        signals.append(
            "Negative customer history"
        )

    else:

        signals.append(
            "Neutral customer history"
        )


    # ========================================================
    # FAILURE ANALYSIS
    # ========================================================

    if failure == "DO_NOT_HONOR":

        diagnosis = "CARD_DECLINED"

        recommended_action = "SMART_RETRY"

        score += 15

        signals.append(
            "Failure appears potentially retryable"
        )


    elif failure in [
        "INSUFFICIENT_FUNDS",
        "FUNDS_UNAVAILABLE"
    ]:

        diagnosis = "INSUFFICIENT_FUNDS"

        recommended_action = "DELAYED_RETRY"

        score += 5

        signals.append(
            "Temporary funding issue detected"
        )


    elif failure in [
        "EXPIRED_CARD",
        "INVALID_CARD"
    ]:

        diagnosis = "INVALID_PAYMENT_METHOD"

        recommended_action = "UPDATE_PAYMENT"

        score -= 10

        signals.append(
            "Payment method requires customer action"
        )


    elif failure in [
        "NETWORK_ERROR",
        "TIMEOUT"
    ]:

        diagnosis = "NETWORK_FAILURE"

        recommended_action = "NETWORK_RETRY"

        score += 10

        signals.append(
            "Technical failure appears retryable"
        )


    elif failure in [
        "FRAUD_SUSPECTED",
        "FRAUD_REVIEW"
    ]:

        diagnosis = "FRAUD_REVIEW"

        recommended_action = "MANUAL_REVIEW"

        score -= 35

        signals.append(
            "Transaction requires fraud review"
        )


    else:

        diagnosis = "PAYMENT_FAILURE"

        recommended_action = "SMART_RETRY"

        score += 5

        signals.append(
            "Generic payment recovery path"
        )


    # ========================================================
    # RETRY BEHAVIOR ANALYSIS
    # ========================================================

    if retries == 0:

        score += 10

        signals.append(
            "No previous retry attempt"
        )


    elif retries == 1:

        score += 5

        signals.append(
            "Only one retry attempt"
        )


    elif retries == 2:

        score -= 5

        signals.append(
            "Multiple retry attempts detected"
        )


    elif retries >= 3:

        score -= 30

        signals.append(
            "Retry limit reached"
        )


    # ========================================================
    # TRANSACTION VALUE ANALYSIS
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
    # PAYMENT METHOD SIGNAL
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
    # LIMIT SCORE
    # ========================================================

    score = max(
        0,
        min(score, 99)
    )


    # ========================================================
    # FINAL DECISION
    # ========================================================

    if retries >= 3:

        decision = "ESCALATE"

        recommended_action = "ALTERNATIVE_PAYMENT"


    elif failure in [
        "EXPIRED_CARD",
        "INVALID_CARD"
    ]:

        decision = "CUSTOMER_ACTION"


    elif failure in [
        "FRAUD_SUSPECTED",
        "FRAUD_REVIEW"
    ]:

        decision = "ESCALATE"


    elif score >= 70:

        decision = "RECOVER"


    elif score >= 45:

        decision = "HOLD"


    else:

        decision = "NO_ACTION"


    # ========================================================
    # SUCCESS PROBABILITY
    # ========================================================

    success_probability = round(
        score / 100,
        3
    )


    # ========================================================
    # RISK LEVEL
    # ========================================================
    #
    # Risk is independent from recovery probability.
    #
    # HIGH recovery probability does NOT automatically mean
    # LOW risk. A transaction can have a good chance of
    # recovery while still being financially significant.
    #
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
        "INVALID_CARD",
        "DO_NOT_HONOR"
    ]:

        risk_level = "HIGH"


    elif amount >= 10000:

        risk_level = "HIGH"


    elif failure in [
        "INSUFFICIENT_FUNDS",
        "FUNDS_UNAVAILABLE",
        "NETWORK_ERROR",
        "TIMEOUT"
    ]:

        risk_level = "MEDIUM"


    else:

        risk_level = "LOW"


    # ========================================================
    # EXPLANATION
    # ========================================================

    explanation_summary = (
        f"AUREX evaluated the transaction using "
        f"failure type, customer history, retry behavior, "
        f"payment method, and transaction value. "
        f"The resulting recovery probability is "
        f"{score}%."
    )


    explanation = {

        "signals": signals,

        "summary": explanation_summary

    }


    # ========================================================
    # FINAL API RESPONSE
    # ========================================================

    return {

        "transaction_amount": amount,

        "payment_method": payment_method,

        "failure_code": failure,

        "diagnosis": diagnosis,

        "recovery_score": score,

        "success_probability": success_probability,

        "recommended_action": recommended_action,

        "decision": decision,

        "risk_level": risk_level,

        "retry_count": retries,

        "customer_history": history,

        "explanation": explanation

    }


# ============================================================
# ANALYZE TRANSACTION
# ============================================================

@app.post("/api/analyze-transaction")
def analyze_transaction(transaction: Transaction):

    result = predict_recovery(transaction)


    # ========================================================
    # SERVER LOG
    # ========================================================

    print()
    print("========================================")
    print("          AUREX AI DECISION")
    print("========================================")

    print(
        f"Transaction Amount : ₹{transaction.amount:,.2f}"
    )

    print(
        f"Payment Method     : {transaction.payment_method}"
    )

    print(
        f"Failure Code       : {transaction.failure_code}"
    )

    print(
        f"Diagnosis          : {result['diagnosis']}"
    )

    print(
        f"Recovery Score     : {result['recovery_score']}%"
    )

    print(
        f"Success Probability: "
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

    print("----------------------------------------")

    print("AUREX SIGNALS")

    for signal in result["explanation"]["signals"]:

        print(f"✓ {signal}")

    print("========================================")
    print()


    return result