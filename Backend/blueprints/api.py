from flask import Blueprint, request, render_template, abort
from jinja2 import TemplateNotFound

api_page = Blueprint('api_page', __name__,
                       template_folder='../../Frontend')


@api_page.route('/api/data_max_values')
def api_data_max_values():
    rtn_json = {
        "en": {
            "min_rainfall": 0,
            "max_rainfall": 0,
            "min_sunshine": 0,
            "max_sunshine": 0,
            "min_lowTemp": 0,
            "max_lowTemp": 0,
            "min_highTemp": 0,
            "max_highTemp": 0
        },
        "sc": {
            "min_rainfall": 0,
            "max_rainfall": 0,
            "min_sunshine": 0,
            "max_sunshine": 0,
            "min_lowTemp": 0,
            "max_lowTemp": 0,
            "min_highTemp": 0,
            "max_highTemp": 0
        },
        "wa": {
            "min_rainfall": 0,
            "max_rainfall": 0,
            "min_sunshine": 0,
            "max_sunshine": 0,
            "min_lowTemp": 0,
            "max_lowTemp": 0,
            "min_highTemp": 0,
            "max_highTemp": 0
        },
        "N. ni": {
            "min_rainfall": 0,
            "max_rainfall": 0,
            "min_sunshine": 0,
            "max_sunshine": 0,
            "min_lowTemp": 0,
            "max_lowTemp": 0,
            "min_highTemp": 0,
            "max_highTemp": 0
        }
    }

@api_page.route('/api/data_year_averages')
def api_data_year_averages():
    year = request.get["year"]
    rtn_json = {
        "year": year,
        "en": {
            "rainfall": 0,
            "sunshine": 0,
            "lowTemp": 0,
            "highTemp": 0
        },
        "sc": {
            "rainfall": 0,
            "sunshine": 0,
            "lowTemp": 0,
            "highTemp": 0
        },
        "wa": {
            "rainfall": 0,
            "sunshine": 0,
            "lowTemp": 0,
            "highTemp": 0
        },
        "ni": {
            "rainfall": 0,
            "sunshine": 0,
            "lowTemp": 0,
            "highTemp": 0
        }
    }
