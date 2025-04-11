from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Board
from app.forms.board_form import BoardForm
from datetime import datetime

boards_routes = Blueprint('boards', __name__, url_prefix='/api/boards')

@boards_routes.route('', methods=['GET'])
@login_required
def get_boards():
    """
    Retrieves all boards for the current user
    """
    boards = Board.query.filter_by(user_id=current_user.id).all()
    return jsonify({'boards': [board.to_dict() for board in boards]}), 200


@boards_routes.route('', methods=['POST'])
@login_required
def create_board():
    """
    Creates a new board for the current user
    """
    data = request.get_json()
    name = data.get('name')
    if not name or len(name.strip()) == 0:
        return jsonify({'error': 'Board name is required'}), 400
    
    new_board = Board(
        user_id=current_user.id,
        name=name.strip()
    )

    db.session.add(new_board)
    db.session.commit()

    return jsonify(new_board.to_dict()), 201

@boards_routes.route('/<int:board_id>', methods=['PUT'])
@login_required
def update_board(board_id):
    """
    Updates an existing board belonging to the current user
    """
    board = Board.query.get(board_id)

    if not board:
        return jsonify({'error': 'Board not found'}), 404

    if board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    name = data.get('name')

    if not name or len(name.strip()) == 0:
        return jsonify({'error': 'Board name is required'}), 400

    board.name = name.strip()
    board.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify(board.to_dict()), 200


@boards_routes.route('/<int:board_id>', methods=['DELETE'])
@login_required
def delete_board(board_id):
    """
    Deletes a board belonging to the current user
    """
    board = Board.query.get(board_id)

    if not board:
        return jsonify({'error': 'Board not found'}), 404

    if board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(board)
    db.session.commit()

    return jsonify({'message': 'Board deleted successfully'}), 200


    