from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Card, List, db, Comment
from app.forms import CommentForm

comment_routes = Blueprint('comment', __name__, url_prefix='/api/comments')

@comment_routes.route('/<int:commentId>', methods=["DELETE"])
@login_required
def delete_comment(commentId):
    comment = Comment.query.get(commentId)

    if not comment:
        return jsonify({"error": "Comment does not exist"}), 404

    if comment.user_id != current_user.id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    db.session.delete(comment)
    db.session.commit()
    return jsonify({
        "message": "Comment deleted successfuly"
    }), 200

@comment_routes.route('/<int:commentId>', methods=['PUT'])
@login_required
def edit_comment(commentId):
    comment_to_edit = Comment.query.get(commentId)

    if not comment_to_edit:
        return jsonify({'error': 'Comment not found'}), 404

    if comment_to_edit.user_id != current_user.id:
        return jsonify({'error': "Unauthorized"}), 403

    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if comment_to_edit and form.validate_on_submit():
        comment_to_edit.content = form.content.data
        db.session.commit()
        return jsonify(comment_to_edit.to_dict()), 200

    return jsonify({'errors': form.errors}), 400
