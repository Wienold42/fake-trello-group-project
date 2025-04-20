from flask_wtf import FlaskForm
from wtforms import *
from wtforms.validators import DataRequired, ValidationError
from app.models import User
from datetime import date

def date_check(form, field):
    if field.data and field.data < date.today():
        raise ValidationError("Date cannot be in the past.")
    return None

class CardForm(FlaskForm):
    list_id = IntegerField("List ID", validators=[DataRequired()])
    name = StringField("Name", validators=[DataRequired()])
    description = StringField('Description', validators=[DataRequired()])
    due_date = DateField('Due Date')
