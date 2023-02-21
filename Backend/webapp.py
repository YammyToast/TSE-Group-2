from flask import Flask, abort, render_template
from jinja2 import TemplateNotFound
from blueprints.index import index_page

app = Flask(__name__)
app.register_blueprint(index_page)

app.run()
