from flask import Flask
import os

from app.extensions import db

def create_app():
    app = Flask(__name__)

    # Initialize Flask extensions here
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///utils/dataset.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    # Register blueprints here
    from app.index import bp as index_bp
    app.register_blueprint(index_bp)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp)

    @app.route('/test/')
    def test_page():
        return '<h1>Testing the Flask Application Factory Pattern</h1>'

    return app