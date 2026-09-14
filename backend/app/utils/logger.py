import logging
from pathlib import Path

def get_logger(name: str = "app") -> logging.Logger:
    """Configure a JSON‑friendly logger for the application.
    Logs are emitted to STDOUT (captured by Docker/K8s) and include
    timestamp, level, logger name, and the module where the log originated.
    """
    logger = logging.getLogger(name)
    if logger.handlers:
        # Already configured (e.g., during tests)
        return logger
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(module)s | %(message)s",
        "%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger
