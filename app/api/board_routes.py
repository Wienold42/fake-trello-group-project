from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Board, List
from app.forms.board_form import BoardForm
from app.forms.list_form import ListForm
from datetime import datetime, date

boards_routes = Blueprint('boards', __name__, url_prefix='/api/boards')


@boards_routes.route('', methods=['GET'])
@boards_routes.route('/', methods=['GET'])
@login_required
def get_boards():
    """
    Retrieves all boards for the current user
    """
    boards = Board.query.filter_by(user_id=current_user.id).all()
    return jsonify({'boards': [board.to_dict() for board in boards]}), 200

@boards_routes.route('/<int:board_id>/lists', methods=['POST'])
@login_required
def create_list(board_id):
    """
    Create a new list in a board
    """
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    max_position = db.session.query(db.func.max(List.position)).filter_by(board_id=board_id).scalar()
    next_position = (max_position or 0) + 1

    if form.validate_on_submit():
        new_list = List(
            board_id=board_id,
            name = form.data['name'],
            position = int(next_position)
        )

        db.session.add(new_list)
        db.session.commit()
        return jsonify(new_list.to_dict()), 200

    return form.errors, 400

@boards_routes.route('', methods=['POST'])
@login_required
def create_board():
    """
    Creates a new board for the current user
    """
    form = BoardForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        name = form.data['name']
        if not name or len(name.strip()) == 0:
            return jsonify({'error': 'Board name is required'}), 400

        new_board = Board(
            user_id=current_user.id,
            name=name.strip()
        )

        db.session.add(new_board)
        db.session.commit()

        return jsonify(new_board.to_dict()), 201
    
    return jsonify({'error': 'Invalid form data'}), 400

@boards_routes.route('', methods=['GET'])
@boards_routes.route('/<int:board_id>/lists', methods=['GET'])
@login_required
def get_lists(board_id):
    """
    Get all lists for a specific board
    """
    board = Board.query.get(board_id)

    if not board:
        return jsonify({'error': 'Board not found'}), 404

    if board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403


    lists = List.query.filter_by(board_id=board_id).order_by(List.position).all()
    return jsonify({'lists': [list.to_dict() for list in lists]}), 200

@boards_routes.route('', methods=['GET'])
@boards_routes.route('/<int:board_id>', methods=['GET'])
@login_required
def get_board_by_id(board_id):
    """
    Retrieves a specific board by ID for the current user
    """
    board = Board.query.get(board_id)

    if not board:
        return jsonify({'error': 'Board not found'}), 404

    if board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    return jsonify(board.to_dict()), 200

@boards_routes.route('', methods=['PUT'])
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
    board.updated_at = datetime.now()

    db.session.commit()

    return jsonify(board.to_dict()), 200

@boards_routes.route('', methods=['DELETE'])
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
