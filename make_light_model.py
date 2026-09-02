import joblib
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline

OLD_MODEL = "backend/aurex_recovery_model.pkl"
NEW_MODEL = "backend/aurex_recovery_model_light.pkl"

print("Loading existing AUREX model...")

old_pipeline = joblib.load(OLD_MODEL)

old_preprocessor = old_pipeline.named_steps["preprocessor"]
classifier = old_pipeline.named_steps["model"]

old_encoder = old_preprocessor.named_transformers_["categorical"]

# Preserve the categories learned during original training
categories = old_encoder.categories_

new_encoder = OneHotEncoder(
    categories=categories,
    handle_unknown="ignore"
)

# Fit encoder structure using the original categories
dummy_rows = []

max_len = max(len(c) for c in categories)

for i in range(max_len):
    row = []

    for cats in categories:
        row.append(cats[min(i, len(cats) - 1)])

    dummy_rows.append(row)

new_encoder.fit(np.array(dummy_rows, dtype=object))

# New model input order:
#
# 0 payment_method
# 1 failure_code
# 2 customer_history
# 3 amount
# 4 retry_count

new_preprocessor = ColumnTransformer(
    transformers=[
        ("categorical", new_encoder, [0, 1, 2]),
        ("numeric", "passthrough", [3, 4])
    ]
)

# Fit transformer structure
dummy_input = np.array([
    ["VISA", "DO_NOT_HONOR", "GOOD", 1000.0, 0]
], dtype=object)

new_preprocessor.fit(dummy_input)

new_pipeline = Pipeline([
    ("preprocessor", new_preprocessor),
    ("model", classifier)
])

# Test prediction
test_input = np.array([
    ["VISA", "DO_NOT_HONOR", "GOOD", 18450.0, 0]
], dtype=object)

prediction = new_pipeline.predict(test_input)
probability = new_pipeline.predict_proba(test_input)

print("Prediction:", prediction)
print("Probability:", probability)

joblib.dump(
    new_pipeline,
    NEW_MODEL,
    compress=3
)

print()
print("SUCCESS!")
print("Created:", NEW_MODEL)