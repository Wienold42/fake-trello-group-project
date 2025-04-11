from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length, NumberRange 

class ListForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=55)])
    position = IntegerField('Position', validators=[DataRequired(), NumberRange(min=0)])

    