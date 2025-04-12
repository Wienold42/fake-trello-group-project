from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, List, Board
from app.forms.list_form import ListForm
from datetime import datetime

list_routes = Blueprint('lists', __name__)

@list_routes.route('/api/boards/<int:board_id>/lists', methods=['GET'])
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
    

    lists = List.query.filter_by(board_id=board_id).order_by(List.position.all())
    return jsonify({'lists': [lst.todict for lst in lists]}), 200


@list_routes.route('/api/boards/<int:board_id>/lists', methods=['POST'])
@login_required
def create_list(board_id):
    """
    Create a new list in a board
    """
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_list = List(
            board_id = board_id,
            name = form.name.data,
            position= form.position.data
        )

        db.session.add(new_list)
        db.session.commit()
        return jsonify(new_list.to_dict()), 201
    
    return form.errors, 400


@list_routes.route('/api/lists/<int:list_id>', methods=['PUT'])
@login_required
def update_list(list_id):
    """
    Update a list
    """

    list_to_update = List.query(list_id)
    
    if not list_to_update:
        return jsonify({'error': 'List not found'}), 404
    
    if list_to_update.board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        list_to_update.name = form.name.data
        list_to_update.position = form.position.data
        list_to_update.updated_at = datetime.now()

        db.session.commit()
        return jsonify(list_to_update.to_dict()), 200
    
    return form.errors, 400

@list_routes.route('/api/lists/<int:list_id>', methods=['DELETE'])
@login_required
def delete_list(list_id):
    """
    Delete a list
    """
    list_to_delete = List.query(list_id)

    if not list_to_delete:
        return jsonify({'error': 'List not found'}), 404
    
    if list_to_delete.board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    

    db.session.delete(list_to_delete)
    db.session.commit()

    return jsonify({'message': 'List deleted successfuly'}), 200