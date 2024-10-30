import time  # Import time module
import re
from flask import Blueprint, request, jsonify
from flask_socketio import emit
from screenmanager import ScreenManager
from models.model_sms import get_metrics
from sysfiles.sms_service import SendSMS
from sysfiles.rate_limit import check_rate_limit
from validate import validate_sms_data
from auth_middleware import token_required

# Initialize blueprint
sms_bp = Blueprint('sms', __name__)

# Route: Fetch SMS Metrics
@sms_bp.route('/metrics', methods=['GET'])
def metrics():
    """Fetch real-time SMS metrics."""
    metrics_data = get_metrics()
    return jsonify(metrics_data)

# Helper Function: Extract Country-Operator Pairs from Session List
def extract_country_operator_pairs(input_string):
    """Extract (country, operator) pairs from session names."""
    pattern = r'\d+\.(\w+)_(\w+)_(\w+)'
    matches = re.findall(pattern, input_string)
    # Create a set of (country, operator) pairs
    return set((country, operator) for _, country, operator in matches)

# Helper Function: Check if Country-Operator Pair Exists
def is_country_operator_exist(country, operator):
    """Check if a (country, operator) pair exists in active sessions."""
    sessions = ScreenManager.list_sessions()
    pairs = extract_country_operator_pairs(sessions)
    return (country, operator) in pairs

# Route: Send SMS with WebSocket Updates
@sms_bp.route('/send_sms', methods=['POST'])
@token_required
def send_sms(current_user):
    """Send an SMS with WebSocket status updates."""

    try:
        # Parse request data
        data = request.json
        is_validated = validate_sms_data(**data)
        if is_validated is not True:
            return dict(message='Invalid data', data=None, error=is_validated), 400

        phone_number = data.get('phone_number')
        country = data.get('country')
        proxy = country  # Using country as proxy (adjust as needed)
        operator = data.get('operator')

        # Check if service is available
        if not is_country_operator_exist(country, operator):
            return jsonify({"message": f"{country}-{operator} service unavailable"}), 503

        # Check rate limit
        if not check_rate_limit(country):
            return jsonify({"message": "Rate limit exceeded. Try again in a minute."}), 429

        # Emit: Sending SMS
        sms = SendSMS(phone_number, proxy, country, operator)
        success = sms.send_otp()

        # Emit: SMS Status
        if success:
            return jsonify({
                "message": "SMS sent successfully",
                "country": country,
                "operator": operator,
                "phone": phone_number
            }), 200
        else:
            return jsonify({
                "message": "SMS failed",
                "country": country,
                "operator": operator,
                "phone": phone_number
            }), 500

    except Exception as e:
        return jsonify({
            "message": str(e),
            "error": str(e),
            "data": None
        }), 400
