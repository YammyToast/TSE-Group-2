from flask import Blueprint, render_template, abort
from app.index import bp

@bp.route('/')
@bp.route('/home')
def index():
    return render_template('index.html')
