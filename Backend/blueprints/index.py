from flask import Blueprint, render_template, abort
from jinja2 import TemplateNotFound

index_page = Blueprint('index_page', __name__,
                       template_folder='../../Frontend')


@index_page.route('/')
@index_page.route('/home')
def index():
    return render_template('index.html')
