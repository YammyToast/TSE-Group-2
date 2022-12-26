var white = { R: 255, G: 255, B: 255 };
var gray = { R: 220, G: 220, B: 220 };
var black = { R: 0, G: 0, B: 0 };
var enRed = { R: 255, G: 77, B: 109 };
var niYellow = { R: 255, G: 237, B: 77 };
var scBlue = { R: 86, G: 77, B: 255 };
var waGreen = { R: 83, G: 255, B: 77 };
var sketch = function (P5) {
    // let durationTimers: string[];
    var closestOutput;
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
    // TopLeft-X, TopLeft-Y, BottomRight-X, BottomRight-Y
    var enBoundaryPoints = [0, 0, 0, 0];
    var waBoundaryPoints = [0, 0, 0, 0];
    var scBoundaryPoints = [0, 0, 0, 0];
    var niBoundaryPoints = [0, 0, 0, 0];
    // LeftX, Top-Y, Right-X, Bottom-Y
    var enDetectPoints = [0, 0, 0, 0];
    var waDetectPoints = [0, 0, 0, 0];
    var scDetectPoints = [0, 0, 0, 0];
    var niDetectPoints = [0, 0, 0, 0];
    var gbOffset = [-59, -122];
    var irOffset = [-212, -45];
    var enOffset = [0, 0];
    var waOffset = [-72, 8];
    var scOffset = [-98, -246];
    var niOffset = [-170, -118];
    var widthTranslation;
    var heightTranslation;
    /**
     * @brief LoadJSON function callback. Can be removed and replaced with an anonymous function.
     */
    function contourPointsLoad() {
        console.log("[✓] Loaded Contour Points");
    }
    function getPointDistance(_point) {
        return (Math.sqrt(Math.pow(_point[0] - P5.mouseX, 2)
            +
                Math.pow(_point[1] - P5.mouseY, 2)));
    }
    function getClosestLinear(_points) {
        var closest = 0;
        var secondClosest = 0;
        for (var it = 0; it < _points.length - 1; it++) {
            if (getPointDistance(_points[it]) < getPointDistance(_points[closest])) {
                secondClosest = closest;
                closest = it;
            }
        }
        return [_points[closest], _points[secondClosest]];
    }
    function getClosestPoints(_points) {
        var upper = _points.length - 1;
        var lower = 0;
        var mid;
        // console.log("Mouse X: ", P5.mouseX, " Mouse Y: ", P5.mouseY );
        while (upper - lower > 1) {
            mid = Math.floor((upper + lower) / 2);
            // console.log("Distance to Mid: ", getPointDistance(_points[mid]), ". Distance to Lower: ", getPointDistance(_points[lower]), ". Distance to Upper: ", getPointDistance(_points[upper]));
            // console.log("Lower: ", lower, " Mid: ", mid, " Upper: ", upper);
            if (getPointDistance(_points[mid]) < getPointDistance(_points[lower])) {
                lower = mid + 1;
            }
            else {
                upper = mid;
            }
        }
        console.log("Upper: ".concat(upper, " | Lower: ").concat(lower));
        return [_points[upper], _points[lower]];
    }
    function scaleContourPoints(_points, _offset) {
        for (var pointNum = 0; pointNum < _points.length; pointNum++) {
            _points[pointNum][0] = _points[pointNum][0] * pointScale + (pointScale * _offset[0]) + widthTranslation;
            _points[pointNum][1] = _points[pointNum][1] * pointScale + (pointScale * _offset[1]) + heightTranslation;
        }
    }
    /**
     * @brief Sets the scaled coordinates for one entity, to be used as the outer detection zone for that entity.
     * @param _detectPointsContainer Container to write the detection area points in.
     * @param _boundaryPoints Set of unscaled-boundary points for the entity.
     * @param _offsetPoints Set of points describing the offset of the entity within the canvas.
     */
    function setDetectPoints(_detectPointsContainer, _boundaryPoints, _offsetPoints) {
        _detectPointsContainer[0] = widthTranslation + _boundaryPoints[0] + (pointScale * _offsetPoints[0]);
        _detectPointsContainer[1] = heightTranslation + _boundaryPoints[1] + (pointScale * _offsetPoints[1]);
        _detectPointsContainer[2] = _detectPointsContainer[0] + (_boundaryPoints[2] - _boundaryPoints[0]);
        _detectPointsContainer[3] = _detectPointsContainer[1] + (_boundaryPoints[3] - _boundaryPoints[1]);
    }
    /**
     * @brief
     * @param _boundaryPointsContainer Container to write the Highest and Lowest values to, which will be used as the boundary.
     * @param _points Set of points to iterate upon to find the Highest and Lowest values.
     */
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
        // contourPoints = loadJSON('./assets/img/landmass.json', contourPointsLoad);
        enContourPoints = P5.loadJSON('../assets/contours/england.json', contourPointsLoad);
        waContourPoints = P5.loadJSON('../assets/contours/wales.json', contourPointsLoad);
        scContourPoints = P5.loadJSON('../assets/contours/scotland.json', contourPointsLoad);
        niContourPoints = P5.loadJSON('../assets/contours/northernireland.json', contourPointsLoad);
        var preloadEnd = Date.now();
        // durationTimers.push(`[⧖] Preload Duration : ${preloadEnd - preloadStart}ms`)
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
        scaleContourPoints(gbContourPoints.points, gbOffset);
        scaleContourPoints(irContourPoints.points, irOffset);
        scaleContourPoints(enContourPoints.points, enOffset);
        scaleContourPoints(waContourPoints.points, waOffset);
        scaleContourPoints(scContourPoints.points, scOffset);
        scaleContourPoints(niContourPoints.points, niOffset);
        // fill('#242124');
        // textFont(font);
        // textSize(16);
        // textAlign(CENTER, CENTER)
        // text('Label', width * 0.5, height * 0.5);
        var setupEnd = Date.now();
        // durationTimers.push(`[⧖] Setup Duration : ${setupEnd - setupStart}ms`)
        // for (let i = 0; i < durationTimers.length; i++) {
        // console.log(durationTimers[i]);
        // }
    };
    // TODO: IMPLEMENT RESIZE FUNCTION.
    function windowResize() {
    }
    function drawShapeFromContours(_points, _fillRGB, _strokeRGB, _fillAlpha) {
        if (_fillRGB) {
            P5.fill(_fillRGB.R, _fillRGB.G, _fillRGB.B, _fillAlpha ? _fillAlpha : 230);
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
            for (var it = 0; it < _points.length; it++) {
                P5.vertex(_points[it][0], _points[it][1]);
            }
            P5.endShape();
        }
    }
    P5.draw = function () {
        // ===== CLEAR MAP =====
        P5.fill(71, 105, 204);
        P5.stroke(255, 255, 255);
        P5.strokeWeight(0);
        P5.rect(0, 0, P5.width, P5.height);
        P5.stroke(0, 0, 0);
        P5.push();
        // P5.translate(widthTranslation, heightTranslation);
        drawShapeFromContours(gbContourPoints.points, white);
        drawShapeFromContours(irContourPoints.points, gray);
        drawShapeFromContours(niContourPoints.points, white);
        if (P5.mouseX >= niDetectPoints[0] && P5.mouseX <= niDetectPoints[2] && P5.mouseY >= niDetectPoints[1] && P5.mouseY <= niDetectPoints[3]) {
            drawShapeFromContours(niContourPoints.points, niYellow, niYellow, 100);
        }
        else if (P5.mouseX >= waDetectPoints[0] && P5.mouseX <= waDetectPoints[2] && P5.mouseY >= waDetectPoints[1] && P5.mouseY <= waDetectPoints[3]) {
            drawShapeFromContours(waContourPoints.points, waGreen, waGreen, 100);
        }
        else if (P5.mouseX >= scDetectPoints[0] && P5.mouseX <= scDetectPoints[2] && P5.mouseY >= scDetectPoints[1] && P5.mouseY <= scDetectPoints[3]) {
            drawShapeFromContours(scContourPoints.points, scBlue, scBlue, 100);
        }
        else if (P5.mouseX >= enDetectPoints[0] && P5.mouseX <= enDetectPoints[2] && P5.mouseY >= enDetectPoints[1] && P5.mouseY <= enDetectPoints[3]) {
            drawShapeFromContours(enContourPoints.points, enRed, enRed, 100);
        }
        P5.pop();
        if (closestOutput) {
            P5.strokeWeight(1);
            P5.stroke(255, 0, 0);
            P5.line(P5.mouseX, P5.mouseY, closestOutput[0][0], closestOutput[0][1]);
            P5.stroke(0, 255, 0);
            P5.line(P5.mouseX, P5.mouseY, closestOutput[1][0], closestOutput[1][1]);
        }
    };
    P5.mouseClicked = function () {
    };
    P5.mouseMoved = function () {
        var mouseXDiv = document.getElementById('mouseX');
        var mouseYDiv = document.getElementById('mouseY');
        mouseXDiv.innerHTML = " ".concat(P5.mouseX.toFixed(1));
        mouseYDiv.innerHTML = " ".concat(P5.mouseY.toFixed(1));
        var detectOutput;
        if (P5.mouseX >= niDetectPoints[0] && P5.mouseX <= niDetectPoints[2] && P5.mouseY >= niDetectPoints[1] && P5.mouseY <= niDetectPoints[3]) {
            detectOutput = "Northern Ireland";
            closestOutput = getClosestLinear(niContourPoints.points);
        }
        else if (P5.mouseX >= waDetectPoints[0] && P5.mouseX <= waDetectPoints[2] && P5.mouseY >= waDetectPoints[1] && P5.mouseY <= waDetectPoints[3]) {
            detectOutput = "Wales";
            closestOutput = getClosestLinear(waContourPoints.points);
        }
        else if (P5.mouseX >= scDetectPoints[0] && P5.mouseX <= scDetectPoints[2] && P5.mouseY >= scDetectPoints[1] && P5.mouseY <= scDetectPoints[3]) {
            detectOutput = "Scotland";
            closestOutput = getClosestLinear(scContourPoints.points);
        }
        else if (P5.mouseX >= enDetectPoints[0] && P5.mouseX <= enDetectPoints[2] && P5.mouseY >= enDetectPoints[1] && P5.mouseY <= enDetectPoints[3]) {
            detectOutput = "England";
            closestOutput = getClosestLinear(enContourPoints.points);
        }
        else {
            detectOutput = "";
            closestOutput = null;
        }
        var detect = document.getElementById('detect');
        detect.innerHTML = detectOutput;
        if (closestOutput) {
            var closestPoints = document.getElementById('closestPoints');
            closestPoints.innerHTML = " ".concat(Math.floor(closestOutput[0][0]), ":").concat(Math.floor(closestOutput[0][1]), " ").concat(Math.floor(closestOutput[1][0]), ":").concat(Math.floor(closestOutput[1][1]), " ");
        }
    };
};
new p5(sketch);
