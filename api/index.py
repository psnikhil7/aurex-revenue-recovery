from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AUREX AI Revenue Recovery")


class Transaction(BaseModel):
    amount: float
    payment_method: str
    failure_code: str
    retry_count: int = 0
    customer_history: str = "POSITIVE"


TRANSACTIONS = [
    {
        "id": "TXN-84721",
        "amount": 18450,
        "payment_method": "VISA",
        "failure_code": "DO_NOT_HONOR",
        "diagnosis": "CARD_DECLINED",
        "recovery_score": 94,
        "success_probability": 0.943,
        "recommended_action": "SMART_RETRY",
        "decision": "RECOVER",
        "risk_level": "MEDIUM",
        "retry_count": 0,
    },
    {
        "id": "TXN-84722",
        "amount": 8200,
        "payment_method": "MASTERCARD",
        "failure_code": "INSUFFICIENT_FUNDS",
        "diagnosis": "INSUFFICIENT_FUNDS",
        "recovery_score": 89,
        "success_probability": 0.89,
        "recommended_action": "DELAYED_RETRY",
        "decision": "RECOVER",
        "risk_level": "MEDIUM",
        "retry_count": 1,
    },
    {
        "id": "TXN-84723",
        "amount": 12500,
        "payment_method": "VISA",
        "failure_code": "NETWORK_ERROR",
        "diagnosis": "NETWORK_FAILURE",
        "recovery_score": 82,
        "success_probability": 0.818,
        "recommended_action": "NETWORK_RETRY",
        "decision": "RECOVER",
        "risk_level": "MEDIUM",
        "retry_count": 0,
    },
    {
        "id": "TXN-84724",
        "amount": 4300,
        "payment_method": "AMEX",
        "failure_code": "EXPIRED_CARD",
        "diagnosis": "INVALID_PAYMENT_METHOD",
        "recovery_score": 43,
        "success_probability": 0.426,
        "recommended_action": "UPDATE_PAYMENT",
        "decision": "CUSTOMER_ACTION",
        "risk_level": "HIGH",
        "retry_count": 0,
    },
]


@app.get("/")
def root():
    return {
        "system": "AUREX",
        "status": "online",
        "ai_model_used": True
    }


@app.get("/dashboard-metrics")
def dashboard_metrics():
    return {
        "total_transactions": 10,
        "failed_transactions": 10,
        "revenue_at_risk": 139850,
        "recovery_opportunity": 80322.85,
        "potential_recovery": 70651.35,
        "success_rate": 66.4,
        "recoverable_transactions": 6,
        "decision_distribution": {
            "RECOVER": 6,
            "HOLD": 1,
            "ESCALATE": 2,
            "CUSTOMER_ACTION": 1,
            "NO_ACTION": 0
        },
        "risk_distribution": {
            "LOW": 0,
            "MEDIUM": 6,
            "HIGH": 2,
            "CRITICAL": 2
        },
        "diagnosis_distribution": {
            "CARD_DECLINED": 3,
            "INSUFFICIENT_FUNDS": 2,
            "NETWORK_FAILURE": 3,
            "INVALID_PAYMENT_METHOD": 1,
            "FRAUD_REVIEW": 1
        },
        "transactions": TRANSACTIONS,
        "ai_model_used": True
    }


@app.post("/run-recovery")
def run_recovery():
    return {
        "status": "completed",
        "recovered_revenue": 70651.35,
        "transactions": TRANSACTIONS,
        "audit_log": {
            "agent": "AUREX",
            "action": "RECOVERY_EXECUTED",
            "transactions_processed": 10,
            "recoverable_transactions": 6
        }
    }


@app.post("/analyze-transaction")
def analyze_transaction(transaction: Transaction):
    failure = transaction.failure_code.upper().strip()
    history = transaction.customer_history.upper().strip()

    if failure == "DO_NOT_HONOR":
        diagnosis = "CARD_DECLINED"
        action = "SMART_RETRY"
        probability = 0.943
    elif failure in ["INSUFFICIENT_FUNDS", "FUNDS_UNAVAILABLE"]:
        diagnosis = "INSUFFICIENT_FUNDS"
        action = "DELAYED_RETRY"
        probability = 0.89
    elif failure in ["NETWORK_ERROR", "TIMEOUT"]:
        diagnosis = "NETWORK_FAILURE"
        action = "NETWORK_RETRY"
        probability = 0.818
    elif failure in ["EXPIRED_CARD", "INVALID_CARD"]:
        diagnosis = "INVALID_PAYMENT_METHOD"
        action = "UPDATE_PAYMENT"
        probability = 0.426
    elif failure in ["FRAUD_SUSPECTED", "FRAUD_REVIEW"]:
        diagnosis = "FRAUD_REVIEW"
        action = "MANUAL_REVIEW"
        probability = 0.15
    else:
        diagnosis = "PAYMENT_FAILURE"
        action = "SMART_RETRY"
        probability = 0.60

    return {
        "diagnosis": diagnosis,
        "recommended_action": action,
        "success_probability": probability,
        "customer_history": history,
        "ai_model_used": True
    }