from datetime import datetime
from .db import db, environment, SCHEMA, add_prefix_for_prod

class Card(db.Model):
    __tablename__ = 'cards'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    list_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('list.id')), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    descripton = db.Column(db.Text)
    position = db.Column(db.Integer, nullable=False)
    due_date = db.Column(db.Date)
    createdAt = db.Column(db.DateTime, default=datetime.now, nullable=False)
    updatedAt = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, nullable=False)

    comments = db.relationship('Comment', backref='comments', cascade='all, delete-orphan')
    lists = db.relationship('List', backref='list')

    def to_dict(self):
        return {
            'id': self.id,
            'list_id': self.list_id,
            'name': self.name,
            'description': self.description,
            'position': self.position,
            'due_date': self.due_date,
            'createdAt': self.createdAt,
            'updatedAt': self.updatedAt,
        }
