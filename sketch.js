
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

// LeftX, Top-Y, Right-X, Bottom-Y
let enDetectPoints = [0, 0, 0, 0];
let waDetectPoints = [0, 0, 0, 0];
let scDetectPoints = [0, 0, 0, 0];
let niDetectPoints = [0, 0, 0, 0];


let widthTranslation;
let heightTranslation;

function contourPointsLoad() {
    console.log("[✓] Loaded Contour Points");
}

function setDetectPoints() {
    enDetectPoints[0] = widthTranslation + enBoundaryPoints[0];
    enDetectPoints[1] = heightTranslation + enBoundaryPoints[1];
    enDetectPoints[2] = enDetectPoints[0] + (enBoundaryPoints[2] - enBoundaryPoints[0]);
    enDetectPoints[3] = enDetectPoints[1] + (enBoundaryPoints[3] - enBoundaryPoints[1]);


    waDetectPoints[0] = widthTranslation + waBoundaryPoints[0] - (pointScale * 72);
    waDetectPoints[1] = heightTranslation + waBoundaryPoints[1] + (pointScale * 8);
    waDetectPoints[2] = waDetectPoints[0] + (waBoundaryPoints[2] - waBoundaryPoints[0]);
    waDetectPoints[3] = waDetectPoints[1] + (waBoundaryPoints[3] - waBoundaryPoints[1]);

    scDetectPoints[0] = widthTranslation + scBoundaryPoints[0] - (pointScale * 98);
    scDetectPoints[1] = heightTranslation + scBoundaryPoints[1] - (pointScale * 246);
    scDetectPoints[2] = scDetectPoints[0] + (scBoundaryPoints[2] - scBoundaryPoints[0]);
    scDetectPoints[3] = scDetectPoints[1] + (scBoundaryPoints[3] - scBoundaryPoints[1]);
    
    niDetectPoints[0] = widthTranslation + niBoundaryPoints[0] - (pointScale * 170);
    niDetectPoints[1] = heightTranslation + niBoundaryPoints[1] - (pointScale * 118);
    niDetectPoints[2] = niDetectPoints[0] + (niBoundaryPoints[2] - niBoundaryPoints[0]);
    niDetectPoints[3] = niDetectPoints[1] + (niBoundaryPoints[3] - niBoundaryPoints[1]);
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

    setDetectPoints();

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





function drawMap(_enActive, _waActive, _scActive, _niActive) {
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

 


    // ============================
    // ===== MAIN TRANSLATION =====
    // ============================
    push();
    translate(widthTranslation, heightTranslation)

    // ===========================
    // ===== ENGLAND CONTOUR =====
    // ===========================

    if (_enActive == true) { 
        // stroke(68, 61, 71);
        // strokeWeight(3);
        fill(201, 202, 217);
    } else {
        // stroke(0, 0, 0);
        // strokeWeight(0);
        fill(255, 255, 255);
    }

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

    if (_waActive == true) { 
        // stroke(68, 61, 71);
        // strokeWeight(3);
        fill(201, 202, 217);
    } else {
        // stroke(0, 0, 0);
        // strokeWeight(0);
        fill(255, 255, 255);
    }
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

    if (_scActive == true) { 
        // stroke(68, 61, 71);
        // strokeWeight(3);
        fill(201, 202, 217);
    } else {
        // stroke(0, 0, 0);
        // strokeWeight(0);
        fill(255, 255, 255);
    }
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

    if (_niActive == true) { 
        // stroke(68, 61, 71);
        // strokeWeight(1);
        fill(201, 202, 217);
    } else {
        // stroke(0, 0, 0);
        // strokeWeight(1);
        fill(255, 255, 255);
    }
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

    // beginShape();
    // fill(255, 0, 0);
    // vertex(enDetectPoints[0], enDetectPoints[1]);
    // vertex(enDetectPoints[2], enDetectPoints[1]);
    // vertex(enDetectPoints[2], enDetectPoints[3]);
    // vertex(enDetectPoints[0], enDetectPoints[3]);
    // endShape();

    // beginShape();
    // fill(0, 255, 0);
    // vertex(waDetectPoints[0], waDetectPoints[1]);
    // vertex(waDetectPoints[2], waDetectPoints[1]);
    // vertex(waDetectPoints[2], waDetectPoints[3]);
    // vertex(waDetectPoints[0], waDetectPoints[3]);
    // endShape();

    // beginShape();
    // fill(0, 0, 255);
    // vertex(scDetectPoints[0], scDetectPoints[1]);
    // vertex(scDetectPoints[2], scDetectPoints[1]);
    // vertex(scDetectPoints[2], scDetectPoints[3]);
    // vertex(scDetectPoints[0], scDetectPoints[3]);
    // endShape();

    // beginShape();
    // fill(255, 255, 0);
    // vertex(niDetectPoints[0], niDetectPoints[1]);
    // vertex(niDetectPoints[2], niDetectPoints[1]);
    // vertex(niDetectPoints[2], niDetectPoints[3]);
    // vertex(niDetectPoints[0], niDetectPoints[3]);
    // endShape();

    // pop();

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

        let enActive = false;
        let waActive = false;
        let scActive = false;
        let niActive = false;



        if (mouseX >= niDetectPoints[0] && mouseX <= niDetectPoints[2] && mouseY >= niDetectPoints[1] && mouseY <= niDetectPoints[3]) {
            niActive = true;

        }
        else if (mouseX >= waDetectPoints[0] && mouseX <= waDetectPoints[2] && mouseY >= waDetectPoints[1] && mouseY <= waDetectPoints[3]) {
            waActive = true;
        }
    
        else if (mouseX >= scDetectPoints[0] && mouseX <= scDetectPoints[2] && mouseY >= scDetectPoints[1] && mouseY <= scDetectPoints[3]) {
            scActive = true;
        }
        else if (mouseX >= enDetectPoints[0] && mouseX <= enDetectPoints[2] && mouseY >= enDetectPoints[1] && mouseY <= enDetectPoints[3]) {
            enActive = true;
        }
    
        drawBoundaries();

        drawMap(enActive, waActive, scActive, niActive);
        

    } else {
        drawMap(false, false, false, false);
    }

    let drawEnd = Date.now();
    fpsCounter.innerHTML = ` ${(1000 / (drawEnd - drawStart)).toFixed(0)}`;


}

function mouseMoved() {
    const mouseXDiv = document.getElementById('mouseX');
    const mouseYDiv = document.getElementById('mouseY');
    mouseXDiv.innerHTML = ` ${mouseX.toFixed(1)}`;
    mouseYDiv.innerHTML = ` ${mouseY.toFixed(1)}`;




    let detectOutput = " ";

    if (mouseX >= enDetectPoints[0] && mouseX <= enDetectPoints[2] && mouseY >= enDetectPoints[1] && mouseY <= enDetectPoints[3]) {
        detectOutput = detectOutput.concat("en")
    }

    if (mouseX >= waDetectPoints[0] && mouseX <= waDetectPoints[2] && mouseY >= waDetectPoints[1] && mouseY <= waDetectPoints[3]) {
        detectOutput = detectOutput.concat(" wa")
    }

    if (mouseX >= scDetectPoints[0] && mouseX <= scDetectPoints[2] && mouseY >= scDetectPoints[1] && mouseY <= scDetectPoints[3]) {
        detectOutput = detectOutput.concat(" sc");
    }

    if (mouseX >= niDetectPoints[0] && mouseX <= niDetectPoints[2] && mouseY >= niDetectPoints[1] && mouseY <= niDetectPoints[3]) {
        detectOutput = detectOutput.concat(" ni");
    }

    console.log(detectOutput);
    const detect = document.getElementById('detect');
    detect.innerHTML = detectOutput;
}

