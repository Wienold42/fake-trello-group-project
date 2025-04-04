from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class List(db.Model):
    __tablename__ = "lists"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primaryKey = True)
    board_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("boards.id")), nullable = False)
    name = db.Column(db.String(35), nullable = False)
    position = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    board = db.Relationship("Board", back_populates="lists")
    cards = db.Relationship("Card", back_populates="list", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "board_id": self.board_id,
            "name": self.name,
            "position": self.position,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }