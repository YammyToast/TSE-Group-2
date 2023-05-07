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
    '''for x in ['en', 'sc', 'ni', 'wa']:
        for c in ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']:
            for v in ['HighTemp', 'LowTemp', 'Rainfall', 'Sunshine']:
                print(f"ALTER TABLE {x} ADD {c}{v} TEXT;")'''

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
                    print(f"INSERT INTO {country_code} (year, jan{var_code}, feb{var_code}, mar{var_code}, apr{var_code}, may{var_code}, jun{var_code}, jul{var_code}, aug{var_code}, sep{var_code}, oct{var_code}, nov{var_code}, dec{var_code}) VALUES ({col['year']}, {col['jan']}, {col['feb']}, {col['mar']}, {col['apr']}, {col['may']}, {col['jun']}, {col['jul']}, {col['aug']}, {col['sep']}, {col['oct']}, {col['nov']}, {col['dec']}) ON CONFLICT(`year`) DO UPDATE SET jan{var_code}={col['jan']}, feb{var_code}={col['feb']}, mar{var_code}={col['mar']}, apr{var_code}={col['apr']}, may{var_code}={col['may']}, jun{var_code}={col['jun']}, jul{var_code}={col['jul']}, aug{var_code}={col['aug']}, sep{var_code}={col['sep']}, oct{var_code}={col['oct']}, nov{var_code}={col['nov']}, dec{var_code}={col['dec']};")
                    # print(f"INSERT INTO {country_code} (year, min{var_code}, max{var_code}, avg{var_code}) VALUES ({col['year']}, {min_val}, {max_val}, {avg_val}) ON CONFLICT(`year`) DO UPDATE SET min{var_code}={min_val}, max{var_code}={max_val}, avg{var_code}={avg_val};")
                except TypeError:
                    continue

main()
