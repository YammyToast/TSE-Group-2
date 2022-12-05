
let durationTimers = [];


let landmass;
let font;
let contourPoints;
let pointScale;

let enContourPoints;
let waContourPoints;
let scContourPoints;
let niContourPoints;

// TopLeft-X, TopLeft-Y, BottomRight-X, BottomRight-Y
let enBoundaryPoints = [0, 0, 0, 0];
let waBoundaryPoints = [0, 0, 0, 0];
let scBoundaryPoints = [0, 0, 0, 0];
let niBoundaryPoints = [0, 0, 0, 0];

let widthTranslation;
let heightTranslation;

function contourPointsLoad() {
    console.log("[✓] Loaded Contour Points");
}

function setBoundaryPoints(_boundaryPointsContainer, _points) {
    for (let i = 0; i < _points.length; i++) {
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
    console.log("Boundary Points: ", _boundaryPointsContainer);
}

function preload() {

    let preloadStart = Date.now();

    landmass = loadImage('./assets/img/landmass.svg');
    font = loadFont('./assets/font/AtkinsonHyperlegible-Regular.ttf');

    // contourPoints = loadJSON('./assets/img/landmass.json', contourPointsLoad);
    enContourPoints = loadJSON('./assets/contours/england.json', contourPointsLoad);
    waContourPoints = loadJSON('./assets/contours/wales.json', contourPointsLoad);
    scContourPoints = loadJSON('./assets/contours/scotland.json', contourPointsLoad);
    niContourPoints = loadJSON('./assets/contours/northernireland.json', contourPointsLoad);

    let preloadEnd = Date.now();
    durationTimers.push(`[⧖] Preload Duration : ${preloadEnd - preloadStart}ms`)

}


function setup() {

    let setupStart = Date.now();

    var cnv = createCanvas(windowHeight * 0.8, windowHeight * 0.8)
    cnv.parent('#canvasWrapper')
    background(255)

    widthTranslation = width * 0.6;
    heightTranslation = height * 0.7;

    pointScale = (height * width) / 400000 - 0.1;

    setBoundaryPoints(enBoundaryPoints, enContourPoints.points);
    setBoundaryPoints(waBoundaryPoints, waContourPoints.points);
    setBoundaryPoints(scBoundaryPoints, scContourPoints.points);
    setBoundaryPoints(niBoundaryPoints, niContourPoints.points);

    // imageMode(CENTER)
    // image(landmass, width * 0.5, height * 0.5, landmass.width * scale, scale * landmass.height);



    // fill('#242124');
    // textFont(font);
    // textSize(16);
    // textAlign(CENTER, CENTER)
    // text('Label', width * 0.5, height * 0.5);

    let setupEnd = Date.now();
    durationTimers.push(`[⧖] Setup Duration : ${setupEnd - setupStart}ms`)

    for (let i = 0; i < durationTimers.length; i++) {
        console.log(durationTimers[i]);

    }
}

function windowResize() {
    cnv = resizeCanvas(windowHeight * 0.8, windowHeight * 0.8);

    pointScale = (height * width) / 400000 - 0.1;


    widthTranslation = width * 0.6;
    heightTranslation = height * 0.7;


}





function drawMap(_fillBool, _fillR, _fillG, _fillB, _borderBool, _borderR, _borderG, _borderB) {
    // let pointScale = 1.35;
    //heightwidth716



    // // =======================================
    // // ===== ENABLE FOR ALIGNING CONTOUR =====
    // // =======================================

    // fill(220);
    // beginShape();
    // for (let i = 0; i < contourPoints.points.length; i++) {
    //     vertex((contourPoints.points[i][0] + 148) * pointScale, (contourPoints.points[i][1] + 32) * pointScale);
    // }
    // endShape();




    if (_fillBool == true) {
        fill(_fillR, _fillG, _fillB);
    } else {
        fill(255, 255, 255);
    }

    if (_borderBool == true) {
        stroke(_borderR, _borderG, _borderB);
        strokeWeight(3);
    } else {
        stroke(0, 0, 0);
        strokeWeight(0);

    }

    // ============================
    // ===== MAIN TRANSLATION =====
    // ============================
    push();
    translate(widthTranslation, heightTranslation)

    // ===========================
    // ===== ENGLAND CONTOUR =====
    // ===========================

    if (enContourPoints.points.length > 0) {
        beginShape();
        for (let i = 0; i < enContourPoints.points.length; i++) {
            vertex(enContourPoints.points[i][0] * pointScale, enContourPoints.points[i][1] * pointScale);
        }
        endShape();
    }


    // =========================
    // ===== WALES CONTOUR =====
    // =========================

    if (waContourPoints.points.length > 0) {
        beginShape();
        for (let i = 0; i < waContourPoints.points.length; i++) {
            // Don't touch constant values as they're used for alignment.
            vertex((waContourPoints.points[i][0] - 72) * pointScale, (waContourPoints.points[i][1] + 8) * pointScale);
        }
        endShape();
    }


    // ===========================
    // ===== SCOTLAND CONTOUR ====
    // ===========================

    if (scContourPoints.points.length > 0) {
        beginShape();
        for (let i = 0; i < scContourPoints.points.length; i++) {

            vertex((scContourPoints.points[i][0] - 98) * pointScale, (scContourPoints.points[i][1] - 246) * pointScale);
        }
        endShape();

    }



    // ===================================
    // ===== NORTHERN IRELAND CONTOUR ====
    // ===================================


    if (niContourPoints.points.length > 0) {
        beginShape();
        for (let i = 0; i < niContourPoints.points.length; i++) {
            vertex((niContourPoints.points[i][0] - 170) * pointScale, (niContourPoints.points[i][1] - 118) * pointScale);
        }
        endShape();

    }

    pop();

}

function drawBoundaries() {
    push();
    translate(widthTranslation, heightTranslation);
    fill(255, 0, 0);
    // England Boundary
    rect((enBoundaryPoints[0]), (enBoundaryPoints[1]), -(enBoundaryPoints[0] - enBoundaryPoints[2]), -(enBoundaryPoints[1] - enBoundaryPoints[3]))
    
    // Wales Boundary
    fill(0, 255, 0);
    rect((waBoundaryPoints[0] - (72 * pointScale)), (waBoundaryPoints[1] + (8 * pointScale)), -(waBoundaryPoints[0] - waBoundaryPoints[2]), -(waBoundaryPoints[1] - waBoundaryPoints[3]))

    // Scotland Boundary
    fill(0, 0, 255);
    rect((scBoundaryPoints[0] - (97 * pointScale)), (scBoundaryPoints[1] - (246 * pointScale)), -(scBoundaryPoints[0] - scBoundaryPoints[2]), -(scBoundaryPoints[1] - scBoundaryPoints[3]))

    // Northern Ireland Boundary
    fill(255, 255, 0);
    rect((niBoundaryPoints[0] - (170 * pointScale)), (niBoundaryPoints[1] - (118 * pointScale)), -(niBoundaryPoints[0] - niBoundaryPoints[2]), -(niBoundaryPoints[1] - niBoundaryPoints[3]))


    pop();

}

function draw() {
    let fpsCounter = document.getElementById('FPS');
    let drawStart = Date.now();

    // ===== CLEAR MAP =====
    fill(71, 105, 204);
    stroke(255, 255, 255);
    strokeWeight(0);
    rect(0, 0, width, height);


    stroke(0, 0, 0);
    if (mouseY >= 0 && mouseY <= height && mouseX >= 0 && mouseX <= width) {

        drawBoundaries();
        // drawMap(true, 255, 255, 255, true, 204, 71, 71);
        drawMap(true, 255, 255, 255, true, 68, 61, 71);


    } else {

        drawMap(false, 255, 255, 255, false, 68, 61, 71);
    }

    let drawEnd = Date.now();
    fpsCounter.innerHTML = ` ${(1000 / (drawEnd - drawStart)).toFixed(0)}`;


}

function mouseMoved() {
    const mouseXDiv = document.getElementById('mouseX');
    const mouseYDiv = document.getElementById('mouseY');
    mouseXDiv.innerHTML = ` ${mouseX.toFixed(1)}`;
    mouseYDiv.innerHTML = ` ${mouseY.toFixed(1)}`;

}

