import random
import pandas as pd

random.seed(42)

PAYMENT_METHODS = [
    "VISA",
    "MASTERCARD",
    "AMEX",
    "UPI",
    "WALLET"
]

FAILURE_CODES = [
    "DO_NOT_HONOR",
    "INSUFFICIENT_FUNDS",
    "FUNDS_UNAVAILABLE",
    "EXPIRED_CARD",
    "INVALID_CARD",
    "NETWORK_ERROR",
    "TIMEOUT",
    "FRAUD_REVIEW"
]

CUSTOMER_HISTORY = [
    "POSITIVE",
    "NEUTRAL",
    "NEGATIVE"
]


def generate_recovery_outcome(
    failure_code,
    retry_count,
    customer_history,
    amount
):
    """
    Generate a synthetic recovery outcome
    using realistic business logic.

    1 = recovered
    0 = not recovered
    """

    probability = 0.50

    # Customer history
    if customer_history == "POSITIVE":
        probability += 0.20

    elif customer_history == "NEGATIVE":
        probability -= 0.20

    # Failure type
    if failure_code == "DO_NOT_HONOR":
        probability += 0.15

    elif failure_code in [
        "INSUFFICIENT_FUNDS",
        "FUNDS_UNAVAILABLE"
    ]:
        probability += 0.05

    elif failure_code in [
        "NETWORK_ERROR",
        "TIMEOUT"
    ]:
        probability += 0.10

    elif failure_code in [
        "EXPIRED_CARD",
        "INVALID_CARD"
    ]:
        probability -= 0.20

    elif failure_code == "FRAUD_REVIEW":
        probability -= 0.40

    # Retry behavior
    if retry_count == 0:
        probability += 0.10

    elif retry_count == 1:
        probability += 0.05

    elif retry_count == 2:
        probability -= 0.05

    elif retry_count >= 3:
        probability -= 0.30

    # High-value transactions
    if amount >= 10000:
        probability -= 0.03

    probability = max(0.05, min(probability, 0.95))

    return 1 if random.random() < probability else 0


# ============================================================
# GENERATE DATASET
# ============================================================

rows = []

for _ in range(5000):

    amount = round(
        random.uniform(200, 50000),
        2
    )

    payment_method = random.choice(
        PAYMENT_METHODS
    )

    failure_code = random.choice(
        FAILURE_CODES
    )

    retry_count = random.randint(
        0,
        4
    )

    customer_history = random.choice(
        CUSTOMER_HISTORY
    )

    recovered = generate_recovery_outcome(
        failure_code,
        retry_count,
        customer_history,
        amount
    )

    rows.append({

        "amount": amount,

        "payment_method": payment_method,

        "failure_code": failure_code,

        "retry_count": retry_count,

        "customer_history": customer_history,

        "recovered": recovered

    })


# ============================================================
# CREATE DATAFRAME
# ============================================================

df = pd.DataFrame(rows)


# ============================================================
# SAVE DATASET
# ============================================================

df.to_csv(
    "recovery_dataset.csv",
    index=False
)


print()
print("========================================")
print("       AUREX DATASET GENERATED")
print("========================================")

print(
    f"Total transactions : {len(df)}"
)

print(
    f"Recovered          : {df['recovered'].sum()}"
)

print(
    f"Not recovered      : "
    f"{len(df) - df['recovered'].sum()}"
)

print()
print("Dataset columns:")
print(
    list(df.columns)
)

print()
print(
    "Saved as: recovery_dataset.csv"
)

print("========================================")