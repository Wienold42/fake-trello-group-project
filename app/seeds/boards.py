from app.models import db, Board, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_boards():
    board1 = Board(
        user_id=1,
        name="Web App"
    )
    board2 = Board(
        user_id=1,
        name="Website Upgrade"
    )
    board3 = Board(
        user_id=1,
        name="Fake Trello"
    )
    board4 = Board(
        user_id=2,
        name="Bobbie Board"
    )
    board5 = Board(
        user_id=2,
        name="Holiday Party"
    )
    board6 = Board(
        user_id=2,
        name="Marnie Board 2"
    )
    board7 = Board(
        user_id=3,
        name="Family Reunion"
    )
    board8 = Board(
        user_id=3,
        name="40th Party"
    )
    board9 = Board(
        user_id=3,
        name="Baby Shower"
    )


    db.session.bulk_save_objects([
        board1, board2, board3, board4, board5, board6, board7, board8, board9
    ])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))

    db.session.commit()
