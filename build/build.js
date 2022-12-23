var white = { R: 255, G: 255, B: 255 };
var gray = { R: 220, G: 220, B: 220 };
var black = { R: 0, G: 0, B: 0 };
var red = { R: 255, G: 77, B: 109 };
var sketch = function (P5) {
    var durationTimers;
    var landmass;
    var font;
    var alignContourPoints;
    var pointScale;
    var gbContourPoints;
    var irContourPoints;
    var enContourPoints;
    var waContourPoints;
    var scContourPoints;
    var niContourPoints;
    var enBoundaryPoints = [0, 0, 0, 0];
    var waBoundaryPoints = [0, 0, 0, 0];
    var scBoundaryPoints = [0, 0, 0, 0];
    var niBoundaryPoints = [0, 0, 0, 0];
    var enDetectPoints = [0, 0, 0, 0];
    var waDetectPoints = [0, 0, 0, 0];
    var scDetectPoints = [0, 0, 0, 0];
    var niDetectPoints = [0, 0, 0, 0];
    var enOffset = [0, 0];
    var waOffset = [-72, 8];
    var scOffset = [-98, -246];
    var niOffset = [-170, -118];
    var widthTranslation;
    var heightTranslation;
    function contourPointsLoad() {
        console.log("[✓] Loaded Contour Points");
    }
    function setDetectPoints(_detectPointsContainer, _boundaryPoints, _offsetPoints) {
        _detectPointsContainer[0] = widthTranslation + _boundaryPoints[0] + (pointScale * _offsetPoints[0]);
        _detectPointsContainer[1] = heightTranslation + _boundaryPoints[1] + (pointScale * _offsetPoints[1]);
        _detectPointsContainer[2] = _detectPointsContainer[0] + (_boundaryPoints[2] - _boundaryPoints[0]);
        _detectPointsContainer[3] = _detectPointsContainer[1] + (_boundaryPoints[3] - _boundaryPoints[1]);
    }
    function setBoundaryPoints(_boundaryPointsContainer, _points) {
        for (var i = 0; i < _points.length; i++) {
            if (_points[i][0] * pointScale < _boundaryPointsContainer[0]) {
                _boundaryPointsContainer[0] = _points[i][0] * pointScale;
            }
            if (_points[i][1] * pointScale < _boundaryPointsContainer[1]) {
                _boundaryPointsContainer[1] = _points[i][1] * pointScale;
            }
            if (_points[i][0] * pointScale > _boundaryPointsContainer[2]) {
                _boundaryPointsContainer[2] = _points[i][0] * pointScale;
            }
            if (_points[i][1] * pointScale > _boundaryPointsContainer[3]) {
                _boundaryPointsContainer[3] = _points[i][1] * pointScale;
            }
        }
    }
    P5.preload = function () {
        var preloadStart = Date.now();
        landmass = P5.loadImage('../assets/img/landmass.svg');
        font = P5.loadFont('../assets/font/AtkinsonHyperlegible-Regular.ttf');
        gbContourPoints = P5.loadJSON('../assets/contours/gb.json', contourPointsLoad);
        irContourPoints = P5.loadJSON('../assets/contours/ireland.json', contourPointsLoad);
        enContourPoints = P5.loadJSON('../assets/contours/england.json', contourPointsLoad);
        waContourPoints = P5.loadJSON('../assets/contours/wales.json', contourPointsLoad);
        scContourPoints = P5.loadJSON('../assets/contours/scotland.json', contourPointsLoad);
        niContourPoints = P5.loadJSON('../assets/contours/northernireland.json', contourPointsLoad);
        var preloadEnd = Date.now();
        durationTimers.push("[\u29D6] Preload Duration : ".concat(preloadEnd - preloadStart, "ms"));
    };
    P5.setup = function () {
        var setupStart = Date.now();
        var cnv = P5.createCanvas(P5.windowHeight * 0.8, P5.windowHeight * 0.8);
        cnv.parent('#canvasWrapper');
        P5.background(255);
        widthTranslation = P5.width * 0.6;
        heightTranslation = P5.height * 0.7;
        pointScale = (P5.height * P5.width) / 400000 - 0.1;
        setBoundaryPoints(enBoundaryPoints, enContourPoints.points);
        setBoundaryPoints(waBoundaryPoints, waContourPoints.points);
        setBoundaryPoints(scBoundaryPoints, scContourPoints.points);
        setBoundaryPoints(niBoundaryPoints, niContourPoints.points);
        setDetectPoints(enDetectPoints, enBoundaryPoints, enOffset);
        setDetectPoints(waDetectPoints, waBoundaryPoints, waOffset);
        setDetectPoints(scDetectPoints, scBoundaryPoints, scOffset);
        setDetectPoints(niDetectPoints, niBoundaryPoints, niOffset);
        var setupEnd = Date.now();
        durationTimers.push("[\u29D6] Setup Duration : ".concat(setupEnd - setupStart, "ms"));
        for (var i = 0; i < durationTimers.length; i++) {
            console.log(durationTimers[i]);
        }
    };
    function windowResize() {
    }
    function drawShapeFromContours(_points, _offset, _fillRGB, _strokeRGB) {
        if (_fillRGB) {
            P5.fill(_fillRGB.R, _fillRGB.G, _fillRGB.B);
        }
        else {
            P5.noFill();
        }
        if (_strokeRGB) {
            P5.stroke(_strokeRGB.R, _strokeRGB.G, _strokeRGB.B);
            P5.strokeWeight(4);
        }
        else {
            P5.noStroke();
        }
        if (_points.length > 0) {
            P5.beginShape();
            for (var pointNum = 0; pointNum < _points.length; pointNum++) {
                P5.vertex(_points[pointNum][0] * pointScale + (pointScale * _offset[0]), _points[pointNum][1] * pointScale + (pointScale * _offset[1]));
            }
            P5.endShape();
        }
    }
    function drawMap() {
        P5.push();
        P5.translate(widthTranslation, heightTranslation);
        drawShapeFromContours(gbContourPoints.points, [-59, -122], white);
        drawShapeFromContours(irContourPoints.points, [-212, -45], gray);
        drawShapeFromContours(niContourPoints.points, [-170, -118], white);
        P5.pop();
    }
    P5.draw = function () {
        P5.fill(71, 105, 204);
        P5.stroke(255, 255, 255);
        P5.strokeWeight(0);
        P5.rect(0, 0, P5.width, P5.height);
        drawMap();
    };
};
new p5(sketch);
//# sourceMappingURL=build.js.map