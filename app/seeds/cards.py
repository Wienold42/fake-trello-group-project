from app.models import db, Card, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_cards():
    card1 = Card(
        list_id="1",
        name="Task 1",
        description="Something to do",
        position="1",
        due_date=None,
    )
    card2 = Card(
        list_id="1",
        name="Task 2",
        description="Something to do",
        position="2",
        due_date=None,
    )
    card3 = Card(
        list_id="1",
        name="Task 3",
        description="Something to do",
        position="3",
        due_date=None,
    )
    card4 = Card(
        list_id="2",
        name="Task 4",
        description="Something to do",
        position="2",
        due_date=None,
    )
    card5 = Card(
        list_id="2",
        name="Task 5",
        description="Something to do",
        position="1",
        due_date=None,
    )
    card6 = Card(
        list_id="3",
        name="Task 6",
        description="Something to do",
        position="1",
        due_date=None,
    )
    card7 = Card(
        list_id="3",
        name="Task 7",
        description="Something to do",
        position="2",
        due_date=None,
    )
    card8 = Card(
        list_id="1",
        name="Task 1",
        description="Something to do",
        position="1",
        due_date=None,
    )
    card9 = Card(
        list_id="1",
        name="Task 2",
        description="Something to do",
        position="2",
        due_date=None,
    )
    card10 = Card(
        list_id="2",
        name="Task 3",
        description="Something to do",
        position="1",
        due_date=None,
    )
    card11 = Card(
        list_id="3",
        name="Task 4",
        description="Something to do",
        position="1",
        due_date=None,
    )
    card12 = Card(
        list_id="1",
        name="Task 1",
        description="Something to do",
        position="1",
        due_date=None,
    )
    card13 = Card(
        list_id="2",
        name="Task 1",
        description="Something to do",
        position="1",
        due_date=None,
    )

    db.session.bulk_save_objects([
        card1, card2, card3, card4, card5, card6, card7, card8, card9, card10, card11, card12, card13,
    ])
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_cards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cards"))

    db.session.commit()
