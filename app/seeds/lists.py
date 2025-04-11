from app.models import db, List, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_lists():
    list1 = List(
        board_id=1,
        name="to do",
        position=1,
    )
    list2 = List(
        board_id=1,
        name="working on",
        position=2,
    )
    list3 = List(
        board_id=1,
        name="completed",
        position=3,
    )
    list4 = List(
        board_id=2,
        name="to do",
        position=1,
    )
    list5 = List(
        board_id=2,
        name="in progress",
        position=2,
    )
    list6 = List(
        board_id=2,
        name="completed",
        position=3,
    )
    list7 = List(
        board_id=3,
        name="to do",
        position=1,
    )
    list8 = List(
        board_id=3,
        name="in progress",
        position=2
    )
    list9 = List(
        board_id=3,
        name="completed",
        position=3
    )


    db.session.bulk_save_objects([
        list1, list2, list3, list4, list5, list6, list7, list8, list9
    ])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_lists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.lists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM lists"))

    db.session.commit()
