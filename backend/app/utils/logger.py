import logging
import sys
from logging.handlers import RotatingFileHandler
import os

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

# Configure the root logger
logger = logging.getLogger("samurai")
logger.setLevel(logging.DEBUG)

# Create formatters
console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Create console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(console_formatter)

# Create file handler
file_handler = RotatingFileHandler(
    "logs/samurai.log", 
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(file_formatter)

# Add handlers to the logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# Create a function to get the logger
def get_logger(name=None):
    """
    Get a logger with the specified name.
    
    Args:
        name: The name of the logger. If None, returns the root logger.
        
    Returns:
        A logger instance.
    """
    if name:
        return logging.getLogger(f"samurai.{name}")
    return logger