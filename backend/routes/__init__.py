from flask import Blueprint
from .sms_routes import sms_bp  # Import the SMS routes blueprint

# Expose the blueprint to be imported in app.py
__all__ = ["sms_bp"]
