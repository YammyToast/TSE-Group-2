import requests
import sqlalchemy as db
from sqlalchemy.orm import Session
import pandas as pd
import json
# Database creation
#engine = db.create_engine('sqlite:///utils/dataset.db')
#connection = engine.connect()

# API setup
countries = ["England", "Scotland", "Wales", "Northern_Ireland"]

urls = {
    "tmax": "https://www.metoffice.gov.uk/pub/data/weather/uk/climate/datasets/Tmax/date/cntry.txt",
    "tmin": "https://www.metoffice.gov.uk/pub/data/weather/uk/climate/datasets/Tmin/date/cntry.txt",
    "rain": "https://www.metoffice.gov.uk/pub/data/weather/uk/climate/datasets/Raindays1mm/date/cntry.txt",
    "sun": "https://www.metoffice.gov.uk/pub/data/weather/uk/climate/datasets/Sunshine/date/cntry.txt"
}

def txt_to_json(txt):
    for count, line in enumerate(txt):
        if count < 6:
            continue

        print(line)


def getCountryCode(country):
    if country == "England": return "en"
    elif country == "Scotland": return "sc"
    elif country == "Wales": return "wa"
    elif country == "Northern_Ireland": return "ni"

def getVarCode(var):
    if var == "tmax": return "HighTemp"
    elif var == "tmin": return "LowTemp"
    elif var == "rain": return "Rainfall"
    elif var == "sun": return "Sunshine"

def main():
    for country in countries:
        for key in urls:
            url = urls[key]
            new_url = url.replace("cntry", country)
            r = requests.get(new_url)
            
            read_file = pd.read_csv(new_url, sep="\s+", skiprows=5)
            data_json = json.loads(read_file.to_json(orient='records'))
            
            country_code = getCountryCode(country)
            var_code = getVarCode(key)

            for col in data_json:
                try:             
                    min_val = min(col[data] for data in dict(list(col.items())[1:-5]))
                    max_val = max(col[data] for data in dict(list(col.items())[1:-5]))
                    avg_val = int(sum(col[data] for data in dict(list(col.items())[1:-5]))/len([col[data] for data in dict(list(col.items())[1:-5])]))

                    print(f"INSERT INTO {country_code} (year, min{var_code}, max{var_code}, avg{var_code}) VALUES ({col['year']}, {min_val}, {max_val}, {avg_val}) ON CONFLICT(`year`) DO UPDATE SET min{var_code}={min_val}, max{var_code}={max_val}, avg{var_code}={avg_val};")
                except TypeError:
                    continue

main()
