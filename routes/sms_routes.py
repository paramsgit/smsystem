from flask import Blueprint, request, jsonify
from models.model_sms import get_metrics
from sysfiles.sms_service import SendSMS
from sysfiles.rate_limit import check_rate_limit
from validate import validate_sms_data
from auth_middleware import token_required
sms_bp = Blueprint('sms', __name__)

@sms_bp.route('/metrics', methods=['GET'])
@token_required
def metrics(current_user):
    """Fetch real-time SMS metrics."""
    metrics_data = get_metrics()
    return jsonify(metrics_data)

@sms_bp.route('/send_sms', methods=['POST'])
@token_required
def send_sms(current_user):
    """Send an SMS."""
    data = request.json
    is_validated=validate_sms_data(**data)
    if is_validated is not True:
        return dict(message='Invalid data', data=None, error=is_validated), 400
    phone_number = data.get('phone_number')
    proxy = data.get('proxy')
    country = data.get('country')
    operator = data.get('operator')

    if not check_rate_limit(country):
        return jsonify({"error": "Rate limit exceeded. Try again in a minute."}), 429

    sms = SendSMS(phone_number, proxy, country, operator)
    success = sms.send_otp()

    if success:
        return jsonify({"message": "SMS sent successfully"}), 200
    else:
        return jsonify({"message": "SMS failed"}), 500
