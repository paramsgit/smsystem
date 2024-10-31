from flask import Blueprint, request, jsonify
from auth_middleware import token_required
from validate import validate_pair_data
from models.country_operator_model import (
    create_pair, get_all_pairs, update_pair, delete_pair,pair_exists
)

operator_bp = Blueprint('operator', __name__)

@operator_bp.route('/pairs', methods=['GET'])
def get_pairs():
    """Fetch all country-operator pairs."""
    pairs = get_all_pairs()
    return jsonify(pairs), 200

@operator_bp.route('/pairs', methods=['POST'])
@token_required
def add_pair(_):
    """Add a new country-operator pair."""
    try:
        data = request.json
        validation_result = validate_pair_data(**data)

        if validation_result is not True:
            # If validation fails, return the error response
            return {
            "message": f"Invalid data {validation_result}",
            "error": "Bad Request"
        }, 400

        country=data['country']
        operator=data['operator']
        
        if pair_exists(country, operator):
            return jsonify({"message": f"Pair ({country}, {operator}) already exists"}), 409

        create_pair(country, operator, data.get('is_high_priority', False))

    except Exception as e:
        return jsonify({
            "message": "failed to add data",
            "error": str(e),
            "data": None
        }), 400
    
    return jsonify({"message": "Pair added successfully"}), 201

@operator_bp.route('/pairs/<int:pair_id>', methods=['PUT'])
@token_required
def update_pair_priority(_,pair_id):
    """Update the priority status of a country-operator pair."""

    try:
        data = request.json
        is_high_priority=data['is_high_priority']
        if is_high_priority is None:
            return { "message": "Invalid data, is_high_priority is needed ", "error": "Bad Request" }, 400
        if pair_id is None:
            return { "message": "Invalid data, pair Id is needed ", "error": "Bad Request" }, 400
        updated=update_pair(pair_id, data['is_high_priority'])
        if not updated:
            return jsonify({"message": f"Pair with ID {pair_id} does not exist"}), 404

        return jsonify({"message": f"Pair with ID {pair_id} updated successfully"}), 200

    except Exception as e:
        return jsonify({ "message": "failed to update pairs", "error": str(e), "data": None }), 400

    
    

@operator_bp.route('/pairs/<int:pair_id>', methods=['DELETE'])
@token_required
def delete_pair_route(_,pair_id):
    """Delete a country-operator pair if it's not high-priority."""
    try:
        if pair_id is None:
            return { "message": "Invalid data, pair Id is needed ", "error": "Bad Request" }, 400
        Deleted=delete_pair(pair_id)
        if not Deleted:
            return jsonify({"message": f"Pair with ID {pair_id} does not exist"}), 404
        return jsonify({"message": "Pair deleted successfully "}), 200
    except Exception as e:
        return jsonify({ "message": "failed to update pairs", "error": str(e), "data": None }), 400

    
