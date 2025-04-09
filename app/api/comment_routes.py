from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import Card, List, db, Comment

comment_routes = Blueprint('comment', __name__)

@comment_routes.route('/comments/<int:commentId>', methods=["DELETE"])
@login_required
def delete_comment(commentId):
    comment = Comment.query.get(commentId)

    if comment.user_id is not current_user.id:
        return jsonify({
            "message": "Forbidden"
        }), 403

    db.session.delete(comment)
    db.session.commit()
    return jsonify({
        "message": "Comment deleted successfuly"
    }), 200


