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

    janRainfall = db.Column(db.Float)
    febRainfall = db.Column(db.Float)
    marRainfall = db.Column(db.Float)
    aprRainfall = db.Column(db.Float)
    mayRainfall = db.Column(db.Float)
    junRainfall = db.Column(db.Float)
    julRainfall = db.Column(db.Float)
    augRainfall = db.Column(db.Float)
    sepRainfall = db.Column(db.Float)
    octRainfall = db.Column(db.Float)
    novRainfall = db.Column(db.Float)
    decRainfall = db.Column(db.Float)

    janSunshine = db.Column(db.Float)
    febSunshine = db.Column(db.Float)
    marSunshine = db.Column(db.Float)
    aprSunshine = db.Column(db.Float)
    maySunshine = db.Column(db.Float)
    junSunshine = db.Column(db.Float)
    julSunshine = db.Column(db.Float)
    augSunshine = db.Column(db.Float)
    sepSunshine = db.Column(db.Float)
    octSunshine = db.Column(db.Float)
    novSunshine = db.Column(db.Float)
    decSunshine = db.Column(db.Float)

    janLowTemp = db.Column(db.Float)
    febLowTemp = db.Column(db.Float)
    marLowTemp = db.Column(db.Float)
    aprLowTemp = db.Column(db.Float)
    mayLowTemp = db.Column(db.Float)
    junLowTemp = db.Column(db.Float)
    julLowTemp = db.Column(db.Float)
    augLowTemp = db.Column(db.Float)
    sepLowTemp = db.Column(db.Float)
    octLowTemp = db.Column(db.Float)
    novLowTemp = db.Column(db.Float)
    decLowTemp = db.Column(db.Float)

    janHighTemp = db.Column(db.Float)
    febHighTemp = db.Column(db.Float)
    marHighTemp = db.Column(db.Float)
    aprHighTemp = db.Column(db.Float)
    mayHighTemp = db.Column(db.Float)
    junHighTemp = db.Column(db.Float)
    julHighTemp = db.Column(db.Float)
    augHighTemp = db.Column(db.Float)
    sepHighTemp = db.Column(db.Float)
    octHighTemp = db.Column(db.Float)
    novHighTemp = db.Column(db.Float)
    decHighTemp = db.Column(db.Float)

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

    janRainfall = db.Column(db.Float)
    febRainfall = db.Column(db.Float)
    marRainfall = db.Column(db.Float)
    aprRainfall = db.Column(db.Float)
    mayRainfall = db.Column(db.Float)
    junRainfall = db.Column(db.Float)
    julRainfall = db.Column(db.Float)
    augRainfall = db.Column(db.Float)
    sepRainfall = db.Column(db.Float)
    octRainfall = db.Column(db.Float)
    novRainfall = db.Column(db.Float)
    decRainfall = db.Column(db.Float)

    janSunshine = db.Column(db.Float)
    febSunshine = db.Column(db.Float)
    marSunshine = db.Column(db.Float)
    aprSunshine = db.Column(db.Float)
    maySunshine = db.Column(db.Float)
    junSunshine = db.Column(db.Float)
    julSunshine = db.Column(db.Float)
    augSunshine = db.Column(db.Float)
    sepSunshine = db.Column(db.Float)
    octSunshine = db.Column(db.Float)
    novSunshine = db.Column(db.Float)
    decSunshine = db.Column(db.Float)

    janLowTemp = db.Column(db.Float)
    febLowTemp = db.Column(db.Float)
    marLowTemp = db.Column(db.Float)
    aprLowTemp = db.Column(db.Float)
    mayLowTemp = db.Column(db.Float)
    junLowTemp = db.Column(db.Float)
    julLowTemp = db.Column(db.Float)
    augLowTemp = db.Column(db.Float)
    sepLowTemp = db.Column(db.Float)
    octLowTemp = db.Column(db.Float)
    novLowTemp = db.Column(db.Float)
    decLowTemp = db.Column(db.Float)

    janHighTemp = db.Column(db.Float)
    febHighTemp = db.Column(db.Float)
    marHighTemp = db.Column(db.Float)
    aprHighTemp = db.Column(db.Float)
    mayHighTemp = db.Column(db.Float)
    junHighTemp = db.Column(db.Float)
    julHighTemp = db.Column(db.Float)
    augHighTemp = db.Column(db.Float)
    sepHighTemp = db.Column(db.Float)
    octHighTemp = db.Column(db.Float)
    novHighTemp = db.Column(db.Float)
    decHighTemp = db.Column(db.Float)


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

    janRainfall = db.Column(db.Float)
    febRainfall = db.Column(db.Float)
    marRainfall = db.Column(db.Float)
    aprRainfall = db.Column(db.Float)
    mayRainfall = db.Column(db.Float)
    junRainfall = db.Column(db.Float)
    julRainfall = db.Column(db.Float)
    augRainfall = db.Column(db.Float)
    sepRainfall = db.Column(db.Float)
    octRainfall = db.Column(db.Float)
    novRainfall = db.Column(db.Float)
    decRainfall = db.Column(db.Float)

    janSunshine = db.Column(db.Float)
    febSunshine = db.Column(db.Float)
    marSunshine = db.Column(db.Float)
    aprSunshine = db.Column(db.Float)
    maySunshine = db.Column(db.Float)
    junSunshine = db.Column(db.Float)
    julSunshine = db.Column(db.Float)
    augSunshine = db.Column(db.Float)
    sepSunshine = db.Column(db.Float)
    octSunshine = db.Column(db.Float)
    novSunshine = db.Column(db.Float)
    decSunshine = db.Column(db.Float)

    janLowTemp = db.Column(db.Float)
    febLowTemp = db.Column(db.Float)
    marLowTemp = db.Column(db.Float)
    aprLowTemp = db.Column(db.Float)
    mayLowTemp = db.Column(db.Float)
    junLowTemp = db.Column(db.Float)
    julLowTemp = db.Column(db.Float)
    augLowTemp = db.Column(db.Float)
    sepLowTemp = db.Column(db.Float)
    octLowTemp = db.Column(db.Float)
    novLowTemp = db.Column(db.Float)
    decLowTemp = db.Column(db.Float)

    janHighTemp = db.Column(db.Float)
    febHighTemp = db.Column(db.Float)
    marHighTemp = db.Column(db.Float)
    aprHighTemp = db.Column(db.Float)
    mayHighTemp = db.Column(db.Float)
    junHighTemp = db.Column(db.Float)
    julHighTemp = db.Column(db.Float)
    augHighTemp = db.Column(db.Float)
    sepHighTemp = db.Column(db.Float)
    octHighTemp = db.Column(db.Float)
    novHighTemp = db.Column(db.Float)
    decHighTemp = db.Column(db.Float)


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

    janRainfall = db.Column(db.Float)
    febRainfall = db.Column(db.Float)
    marRainfall = db.Column(db.Float)
    aprRainfall = db.Column(db.Float)
    mayRainfall = db.Column(db.Float)
    junRainfall = db.Column(db.Float)
    julRainfall = db.Column(db.Float)
    augRainfall = db.Column(db.Float)
    sepRainfall = db.Column(db.Float)
    octRainfall = db.Column(db.Float)
    novRainfall = db.Column(db.Float)
    decRainfall = db.Column(db.Float)

    janSunshine = db.Column(db.Float)
    febSunshine = db.Column(db.Float)
    marSunshine = db.Column(db.Float)
    aprSunshine = db.Column(db.Float)
    maySunshine = db.Column(db.Float)
    junSunshine = db.Column(db.Float)
    julSunshine = db.Column(db.Float)
    augSunshine = db.Column(db.Float)
    sepSunshine = db.Column(db.Float)
    octSunshine = db.Column(db.Float)
    novSunshine = db.Column(db.Float)
    decSunshine = db.Column(db.Float)

    janLowTemp = db.Column(db.Float)
    febLowTemp = db.Column(db.Float)
    marLowTemp = db.Column(db.Float)
    aprLowTemp = db.Column(db.Float)
    mayLowTemp = db.Column(db.Float)
    junLowTemp = db.Column(db.Float)
    julLowTemp = db.Column(db.Float)
    augLowTemp = db.Column(db.Float)
    sepLowTemp = db.Column(db.Float)
    octLowTemp = db.Column(db.Float)
    novLowTemp = db.Column(db.Float)
    decLowTemp = db.Column(db.Float)

    janHighTemp = db.Column(db.Float)
    febHighTemp = db.Column(db.Float)
    marHighTemp = db.Column(db.Float)
    aprHighTemp = db.Column(db.Float)
    mayHighTemp = db.Column(db.Float)
    junHighTemp = db.Column(db.Float)
    julHighTemp = db.Column(db.Float)
    augHighTemp = db.Column(db.Float)
    sepHighTemp = db.Column(db.Float)
    octHighTemp = db.Column(db.Float)
    novHighTemp = db.Column(db.Float)
    decHighTemp = db.Column(db.Float)