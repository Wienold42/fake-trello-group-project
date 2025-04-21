from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, List, Board, Card
from app.forms.list_form import ListForm
from app.forms.card_form import CardForm
from datetime import datetime, date

list_routes = Blueprint('lists', __name__, url_prefix='/api/lists')

### Get Cards for a list
@list_routes.route('', methods=['GET'])
@list_routes.route('/<int:listId>/cards', methods=['GET'])
@login_required
def get_cards(listId):
    list = List.query.get(listId)
    if not list:
        return jsonify({'error': 'List not found'}), 404

    cards = Card.query.filter_by(list_id=listId).all()

    return jsonify({'cards':[
        card.to_dict() for card in cards]})

## Moved to board routes
""" @list_routes.route('/api/boards/<int:board_id>/lists', methods=['GET'])
@login_required
def get_lists(board_id):
    \"""
    Get all lists for a specific board
    \"""
    board = Board.query.get(board_id)

    if not board:
        return jsonify({'error': 'Board not found'}), 404

    if board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403


    lists = List.query.filter_by(board_id=board_id).order_by(List.position.all())
    return jsonify({'lists': [lst.todict for lst in lists]}), 200 """

@list_routes.route('', methods=['POST'])
@list_routes.route('/<int:listId>/cards', methods=['POST'])
@login_required
def create_card(listId):
    form = CardForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    #assigned next position
    max_position = db.session.query(db.func.max(Card.position)).filter_by(list_id=listId).scalar()
    next_position = (max_position or 0) + 1

    if form.validate_on_submit():
        new_card = Card(
            list_id = listId,
            name = form.name.data,
            description = form.description.data,
            position = next_position,
            due_date = form.due_date.data,
        )
        db.session.add(new_card)
        db.session.commit()
        return jsonify(new_card.to_dict()), 200

## Move to boards routes
""" @list_routes.route('/api/boards/<int:board_id>/lists', methods=['POST'])
@login_required
def create_list(board_id):
    \"""
    Create a new list in a board
    \"""
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

    return form.errors, 400 """

@list_routes.route('', methods=['PUT'])
@list_routes.route('/<int:list_id>', methods=['PUT'])
@login_required
def update_list(list_id):
    """
    Update a list
    """

    list_to_update = List.query.get(list_id)

    if not list_to_update:
        return jsonify({'error': 'List not found'}), 404

    if list_to_update.board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    form = ListForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        list_to_update.name = form.name.data
        #list_to_update.position = form.position.data
        list_to_update.updated_at = datetime.now()

        db.session.commit()
        return jsonify(list_to_update.to_dict()), 200

    return form.errors, 400

@list_routes.route('', methods=['DELETE'])
@list_routes.route('/<int:list_id>', methods=['DELETE'])
@login_required
def delete_list(list_id):
    """
    Delete a list
    """
    list_to_delete = List.query.get(list_id)

    if not list_to_delete:
        return jsonify({'error': 'List not found'}), 404

    if list_to_delete.board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403


    db.session.delete(list_to_delete)
    db.session.commit()

    return jsonify({'message': 'List deleted successfuly'}), 200
