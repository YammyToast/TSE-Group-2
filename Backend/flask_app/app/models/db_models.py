from app.extensions import db

class en(db.Model):
    year = db.Column('year', db.Integer, primary_key = True)
    minRainfall = db.Column(db.Float)
    maxRainfall = db.Column(db.Float)
    minSunshine = db.Column(db.Float)
    maxSunshine = db.Column(db.Float)
    minLowTemp = db.Column(db.Float)
    maxLowTemp = db.Column(db.Float)
    minHighTemp = db.Column(db.Float)
    maxHighTemp = db.Column(db.Float)
    avgRainfall = db.Column(db.Float)
    avgSunshine = db.Column(db.Float)
    avgLowTemp = db.Column(db.Float)
    avgHighTemp = db.Column(db.Float)

class sc(db.Model):
    year = db.Column('year', db.Integer, primary_key = True)
    minRainfall = db.Column(db.Float)
    maxRainfall = db.Column(db.Float)
    minSunshine = db.Column(db.Float)
    maxSunshine = db.Column(db.Float)
    minLowTemp = db.Column(db.Float)
    maxLowTemp = db.Column(db.Float)
    minHighTemp = db.Column(db.Float)
    maxHighTemp = db.Column(db.Float)
    avgRainfall = db.Column(db.Float)
    avgSunshine = db.Column(db.Float)
    avgLowTemp = db.Column(db.Float)
    avgHighTemp = db.Column(db.Float)


class wa(db.Model):
    year = db.Column('year', db.Integer, primary_key = True)
    minRainfall = db.Column(db.Float)
    maxRainfall = db.Column(db.Float)
    minSunshine = db.Column(db.Float)
    maxSunshine = db.Column(db.Float)
    minLowTemp = db.Column(db.Float)
    maxLowTemp = db.Column(db.Float)
    minHighTemp = db.Column(db.Float)
    maxHighTemp = db.Column(db.Float)
    avgRainfall = db.Column(db.Float)
    avgSunshine = db.Column(db.Float)
    avgLowTemp = db.Column(db.Float)
    avgHighTemp = db.Column(db.Float)


class ni(db.Model):
    year = db.Column('year', db.Integer, primary_key = True)
    minRainfall = db.Column(db.Float)
    maxRainfall = db.Column(db.Float)
    minSunshine = db.Column(db.Float)
    maxSunshine = db.Column(db.Float)
    minLowTemp = db.Column(db.Float)
    maxLowTemp = db.Column(db.Float)
    minHighTemp = db.Column(db.Float)
    maxHighTemp = db.Column(db.Float)
    avgRainfall = db.Column(db.Float)
    avgSunshine = db.Column(db.Float)
    avgLowTemp = db.Column(db.Float)
    avgHighTemp = db.Column(db.Float)


def __init__(self, name, city, addr,pin):
   self.name = name
   self.city = city
   self.addr = addr
   self.pin = pin