from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    card_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('card.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('user.id')), nullable=False)
    text = db.Column(db.Text)
    createdAt = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    users = db.relationship('User', backref='user')
    cards = db.relationship('Card', backref='card')

    def to_dict(self):
        return {
            'id': self.id,
            'card_id': self.card_id,
            'user_id': self.user_id,
            'text': self.text,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
        }
