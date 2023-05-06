import json

from flask import current_app, request
from app.api import bp
from app.models.db_models import en, sc, wa, ni


@bp.route('/api/data_max_values')
def api_data_max_values():
    en_response = en.query.filter_by(year=2022).first()
    sc_response = sc.query.filter_by(year=2022).first()
    wa_response = wa.query.filter_by(year=2022).first()
    ni_response = ni.query.filter_by(year=2022).first()

    
    rtn_json = {
        "en": {
            "min_rainfall": en_response.minRainfall,
            "max_rainfall": en_response.maxRainfall,
            "min_sunshine": en_response.minSunshine,
            "max_sunshine": en_response.maxSunshine,
            "min_lowTemp": en_response.minLowTemp,
            "max_lowTemp": en_response.maxLowTemp,
            "min_highTemp": en_response.minHighTemp,
            "max_highTemp": en_response.maxHighTemp
        },
        "sc": {
            "min_rainfall": sc_response.minRainfall,
            "max_rainfall": sc_response.maxRainfall,
            "min_sunshine": sc_response.minSunshine,
            "max_sunshine": sc_response.maxSunshine,
            "min_lowTemp": sc_response.minLowTemp,
            "max_lowTemp": sc_response.maxLowTemp,
            "min_highTemp": sc_response.minHighTemp,
            "max_highTemp": sc_response.maxHighTemp
        },
        "wa": {
            "min_rainfall": wa_response.minRainfall,
            "max_rainfall": wa_response.maxRainfall,
            "min_sunshine": wa_response.minSunshine,
            "max_sunshine": wa_response.maxSunshine,
            "min_lowTemp": wa_response.minLowTemp,
            "max_lowTemp": wa_response.maxLowTemp,
            "min_highTemp": wa_response.minHighTemp,
            "max_highTemp": wa_response.maxHighTemp
        },
        "ni": {
            "min_rainfall": ni_response.minRainfall,
            "max_rainfall": ni_response.maxRainfall,
            "min_sunshine": ni_response.minSunshine,
            "max_sunshine": ni_response.maxSunshine,
            "min_lowTemp": ni_response.minLowTemp,
            "max_lowTemp": ni_response.maxLowTemp,
            "min_highTemp": ni_response.minHighTemp,
            "max_highTemp": ni_response.maxHighTemp
        }
    }
    return rtn_json

@bp.route('/api/data_year_averages')
def api_data_year_averages():
    year = int(request.args.get('year'))

    if year < 1910 or year > 2022:
        response = current_app.response_class(
        response="Year must be between 1910 and 2022",
        status=400,
        mimetype='application/json')
        return response
    
    en_response = en.query.filter_by(year=year).first()
    sc_response = sc.query.filter_by(year=year).first()
    wa_response = wa.query.filter_by(year=year).first()
    ni_response = ni.query.filter_by(year=year).first()

    rtn_json = {
        "year": year,
        "en": {
            "rainfall": en_response.avgRainfall,
            "sunshine": en_response.avgSunshine,
            "lowTemp": en_response.avgLowTemp,
            "highTemp": en_response.avgHighTemp
        },
        "sc": {
            "rainfall": sc_response.avgRainfall,
            "sunshine": sc_response.avgSunshine,
            "lowTemp": sc_response.avgLowTemp,
            "highTemp": sc_response.avgHighTemp
        },
        "wa": {
            "rainfall": wa_response.avgRainfall,
            "sunshine": wa_response.avgSunshine,
            "lowTemp": wa_response.avgLowTemp,
            "highTemp": wa_response.avgHighTemp
        },
        "ni": {
            "rainfall": ni_response.avgRainfall,
            "sunshine": ni_response.avgSunshine,
            "lowTemp": ni_response.avgLowTemp,
            "highTemp": ni_response.avgHighTemp
        }
    }
    return rtn_json

@bp.route('/api/data_full_year_values')
def api_data_full_year_averages():
    year = int(request.args.get('year'))
    country = str(request.args.get('country'))

    if year < 1910 or year > 2022:
        response = current_app.response_class(
        response="Year must be between 1910 and 2022",
        status=400,
        mimetype='application/json')
        return response
    
    if country not in ['en', 'wa', 'ni', 'sc']:
        response = current_app.response_class(
        response="Country must be en, wa, ni or sc",
        status=400,
        mimetype='application/json')
        return response
    
    db_obj = None
    
    if country == "en":
        db_obj = en.query.filter_by(year=year).first()
    elif country == "sc":
        db_obj = sc.query.filter_by(year=year).first()
    elif country == "wa":
        db_obj = wa.query.filter_by(year=year).first()
    elif country == "ni":
        db_obj = ni.query.filter_by(year=year).first()

    rtn_json = {
        "year": year,
        "country": country,
        "rainfall": {
            "jan": db_obj.janRainfall,
            "feb": db_obj.febRainfall,
            "mar": db_obj.marRainfall,
            "apr": db_obj.aprRainfall,
            "may": db_obj.mayRainfall,
            "jun": db_obj.junRainfall,
            "jul": db_obj.julRainfall,
            "aug": db_obj.augRainfall,
            "sep": db_obj.sepRainfall,
            "oct": db_obj.octRainfall,
            "nov": db_obj.novRainfall,
            "dec": db_obj.decRainfall
        },

        "sunshine": {
            "jan": db_obj.janSunshine,
            "feb": db_obj.febSunshine,
            "mar": db_obj.marSunshine,
            "apr": db_obj.aprSunshine,
            "may": db_obj.maySunshine,
            "jun": db_obj.junSunshine,
            "jul": db_obj.julSunshine,
            "aug": db_obj.augSunshine,
            "sep": db_obj.sepSunshine,
            "oct": db_obj.octSunshine,
            "nov": db_obj.novSunshine,
            "dec": db_obj.decSunshine
        },

        "highTemp": {
            "jan": db_obj.janHighTemp,
            "feb": db_obj.febHighTemp,
            "mar": db_obj.marHighTemp,
            "apr": db_obj.aprHighTemp,
            "may": db_obj.mayHighTemp,
            "jun": db_obj.junHighTemp,
            "jul": db_obj.julHighTemp,
            "aug": db_obj.augHighTemp,
            "sep": db_obj.sepHighTemp,
            "oct": db_obj.octHighTemp,
            "nov": db_obj.novHighTemp,
            "dec": db_obj.decHighTemp
        },

        "lowTemp": {
            "jan": db_obj.janLowTemp,
            "feb": db_obj.febLowTemp,
            "mar": db_obj.marLowTemp,
            "apr": db_obj.aprLowTemp,
            "may": db_obj.mayLowTemp,
            "jun": db_obj.junLowTemp,
            "jul": db_obj.julLowTemp,
            "aug": db_obj.augLowTemp,
            "sep": db_obj.sepLowTemp,
            "oct": db_obj.octLowTemp,
            "nov": db_obj.novLowTemp,
            "dec": db_obj.decLowTemp
        }

        
    }
    return rtn_json
