from flask_wtf import FlaskForm
from wtforms import *
from wtforms.validators import DataRequired, ValidationError
from app.models import User
from datetime import date


class CommentForm(FlaskForm):
    content = TextAreaField("content", validators=[DateField()])
