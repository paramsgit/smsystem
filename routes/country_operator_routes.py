from flask import Blueprint, request, jsonify
from auth_middleware import token_required
from models.country_operator_model import (
    create_pair, get_all_pairs, update_pair, delete_pair
)

operator_bp = Blueprint('operator', __name__)

@operator_bp.route('/pairs', methods=['GET'])
@token_required
def get_pairs(_):
    """Fetch all country-operator pairs."""
    pairs = get_all_pairs()
    return jsonify(pairs), 200

@operator_bp.route('/pairs', methods=['POST'])
@token_required
def add_pair(_):
    """Add a new country-operator pair."""
    data = request.json
    # create_pair(data['country'], data['operator'], data.get('is_high_priority', False))
    return jsonify({"message": "Pair added successfully"}), 201

@operator_bp.route('/pairs/<int:pair_id>', methods=['PUT'])
@token_required
def update_pair_priority(_,pair_id):
    """Update the priority status of a country-operator pair."""
    data = request.json
    update_pair(pair_id, data['is_high_priority'])
    return jsonify({"message": "Pair updated successfully"}), 200

@operator_bp.route('/pairs/<int:pair_id>', methods=['DELETE'])
@token_required
def delete_pair_route(_,pair_id):
    """Delete a country-operator pair if it's not high-priority."""
    delete_pair(pair_id)
    return jsonify({"message": "Pair deleted successfully or it was high-priority"}), 200
