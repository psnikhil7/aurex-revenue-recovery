import sys
import os

BACKEND_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "backend"
)

sys.path.insert(0, BACKEND_PATH)

from app import app