import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report
)

# ============================================================
# LOAD DATASET
# ============================================================

df = pd.read_csv("recovery_dataset.csv")

print()
print("========================================")
print("       AUREX AI MODEL TRAINING")
print("========================================")

print(f"Dataset size: {len(df)} transactions")


# ============================================================
# FEATURES + TARGET
# ============================================================

X = df[
    [
        "amount",
        "payment_method",
        "failure_code",
        "retry_count",
        "customer_history"
    ]
]

y = df["recovered"]


# ============================================================
# TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(f"Training samples: {len(X_train)}")
print(f"Testing samples : {len(X_test)}")


# ============================================================
# CATEGORICAL + NUMERIC FEATURES
# ============================================================

categorical_features = [
    "payment_method",
    "failure_code",
    "customer_history"
]

numeric_features = [
    "amount",
    "retry_count"
]


# ============================================================
# PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore"
            ),
            categorical_features
        ),
        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)


# ============================================================
# RANDOM FOREST MODEL
# ============================================================

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=12,
    min_samples_split=5,
    random_state=42,
    class_weight="balanced"
)


# ============================================================
# COMPLETE ML PIPELINE
# ============================================================

pipeline = Pipeline(
    steps=[
        (
            "preprocessor",
            preprocessor
        ),
        (
            "model",
            model
        )
    ]
)


# ============================================================
# TRAIN
# ============================================================

print()
print("Training AUREX recovery model...")

pipeline.fit(
    X_train,
    y_train
)

print("Training completed.")


# ============================================================
# PREDICTION
# ============================================================

y_pred = pipeline.predict(X_test)

y_probability = pipeline.predict_proba(
    X_test
)[:, 1]


# ============================================================
# EVALUATION
# ============================================================

accuracy = accuracy_score(
    y_test,
    y_pred
)

precision = precision_score(
    y_test,
    y_pred,
    zero_division=0
)

recall = recall_score(
    y_test,
    y_pred,
    zero_division=0
)

f1 = f1_score(
    y_test,
    y_pred,
    zero_division=0
)

roc_auc = roc_auc_score(
    y_test,
    y_probability
)


# ============================================================
# RESULTS
# ============================================================

print()
print("========================================")
print("          AUREX MODEL RESULTS")
print("========================================")

print(
    f"Accuracy  : {accuracy * 100:.2f}%"
)

print(
    f"Precision : {precision * 100:.2f}%"
)

print(
    f"Recall    : {recall * 100:.2f}%"
)

print(
    f"F1 Score  : {f1 * 100:.2f}%"
)

print(
    f"ROC-AUC   : {roc_auc:.3f}"
)

print("----------------------------------------")

print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "NOT RECOVERED",
            "RECOVERED"
        ],
        zero_division=0
    )
)

print("========================================")


# ============================================================
# SAVE MODEL
# ============================================================

import joblib

joblib.dump(
    pipeline,
    "aurex_recovery_model.pkl"
)

print()
print(
    "Model saved as: aurex_recovery_model.pkl"
)
print()