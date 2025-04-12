from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Card, List, db,Comment
from app.forms import CardForm, CommentForm

card_routes = Blueprint('cards', __name__)


## Get comments for a card ##
@card_routes.route('/<int:cardId>/comments', methods=['GET'])
@login_required
def get_card_comments(cardId):
    comments = Comment.query.filter_by(card_id=cardId).all()
    return jsonify({
        "comments": {
             "comments": [comment.to_dict() for comment in comments]
        }
    })

## Create a comment on a card ##
@card_routes.route('/<int:cardId>/comments', methods=["POST"])
@login_required
def create_comment(cardId):
    form = CommentForm()
    if form.validate_on_submit():
        new_comment = comment(
            content = form.content.data,
            card_id = cardId,
            user_id = current_user.id
        )
    db.session.add(new_comment)
    db.session.commit

    return jsonify({
        'id': new_comment.id,
        'content': new_comment.content,
        'card_id': new_comment.card_id}), 201


## Edit a card ##
@card_routes.route('/<int:cardId>', methods=["PUT"])
@login_required
def update_card(cardId):

    data = request.get_json()
    card = Card.query.get(cardId)

    #Do I need to validate for user???

    card.list_id = data.get('list_id', card.list_id)
    card.name = data.get('name', card.name)
    card.description = data.get('position', card.position)
    card.due_date = data.get('due_date', card.due_date)

    db.session.commit()

    return jsonify(card.to_dict()), 200

## Delete a card ##
@card_routes.route('/<int:cardId>', methods=['DELETE'])
@login_required
def delete_card(cardId):
    card = Card.query.get(cardId)
    if card is None:
        return {'message': 'Comment could not be found!'}, 404
    db.session.delete(card)
    db.session.commit()
    return jsonify({
        "message": "Card deleted successfuly"
    })
