from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Card, List, db,Comment
from app.forms import CardForm, CommentForm

card_routes = Blueprint('cards', __name__, url_prefix='/api/cards')


## Get comments for a card ##
@card_routes.route('/<int:cardId>/comments', methods=['GET'])
@login_required
def get_card_comments(cardId):
    comments = Comment.query.filter_by(card_id=cardId).all()
    return jsonify({

             "comments": [comment.to_dict() for comment in comments]

    })

## Create a comment on a card ##
@card_routes.route('/<int:cardId>/comments', methods=["POST"])
@login_required
def create_comment(cardId):
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_comment = Comment(
            content = form.content.data,
            card_id = cardId,
            user_id = current_user.id
        )
    db.session.add(new_comment)
    db.session.commit()

    return jsonify(new_comment.to_dict()), 201

#Get specific card
@card_routes.route('/<int:cardId>', methods=["GET"])
@login_required
def get_card_details(cardId):
    card = Card.query.get(cardId)

    if not card:
        return jsonify({"error": "Card does not exist"})

    return jsonify(card.to_dict()), 200

## Edit a card ##
@card_routes.route('/<int:cardId>', methods=["PUT"])
@login_required
def update_card(cardId):

    card_to_edit = Card.query.get(cardId)

    if not card_to_edit:
        return jsonify({'error': 'Card not found'}), 404

    if card_to_edit.list.board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    form = CardForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if card_to_edit and form.validate_on_submit():
        card_to_edit.name = form.name.data
        card_to_edit.description = form.description.data
       # card_to_edit.position = form.position.data,
        card_to_edit.due_date = form.due_date.data
        db.session.commit()
        return jsonify(card_to_edit.to_dict()), 201

    return jsonify({'errors': form.errors}), 400

## Delete a card ##
@card_routes.route('/<int:cardId>', methods=['DELETE'])
@login_required
def delete_card(cardId):
    card = Card.query.get(cardId)
    print("card#", card)

    if not card:
         return jsonify({'error': 'List not found'}), 404

    card_owner = card.list.board.user_id
    print(card_owner)

    if card.list.board.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(card)
    db.session.commit()
    return jsonify({
        "message": "Card deleted successfuly"
    })
