

let landmass;
let font;
let contourPoints;

let enContourPoints;
let waContourPoints;
let scContourPoints;
let niContourPoints;

function contourPointsLoad() {
    console.log("[✓] Loaded Contour Points");
}

function preload() {
    landmass = loadImage('./assets/img/landmass.svg');
    font = loadFont('./assets/font/AtkinsonHyperlegible-Regular.ttf');

    contourPoints = loadJSON('./assets/img/landmass.json', contourPointsLoad);
    enContourPoints = loadJSON('./assets/contours/england.json', contourPointsLoad);
    waContourPoints = loadJSON('./assets/contours/wales.json', contourPointsLoad);
    scContourPoints = loadJSON('./assets/contours/scotland.json', contourPointsLoad);
    niContourPoints = loadJSON('./assets/contours/northernireland.json', contourPointsLoad);

}


function setup() {
    var cnv = createCanvas(windowHeight * 0.8, windowHeight * 0.8)
    cnv.parent('#canvasWrapper')
    background(255)




    // imageMode(CENTER)
    // image(landmass, width * 0.5, height * 0.5, landmass.width * scale, scale * landmass.height);



    // fill('#242124');
    // textFont(font);
    // textSize(16);
    // textAlign(CENTER, CENTER)
    // text('Label', width * 0.5, height * 0.5);
}

function windowResize() {
    cnv = createCanvas(windowHeight * 0.8, windowHeight * 0.8);

}





function drawMap(_fillBool, _fillR, _fillG, _fillB, _borderBool, _borderR, _borderG, _borderB) {
    // let pointScale = 1.35;
    //heightwidth716
    let pointScale = (height * width) / 400000 - 0.1;

    // ===== CLEAR MAP =====
    fill(71, 105, 204);
    stroke(255, 255, 255);
    strokeWeight(0);
    rect(0, 0, width, height);

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

    translate(width * 0.6, height * 0.7)

    // ===========================
    // ===== ENGLAND CONTOUR =====
    // ===========================

    if (enContourPoints.points.length > 0) {
        beginShape();
        // vertex(enContourPoints.points[0][0], enContourPoints.points[0][1]);
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



}

function draw() {
    stroke(0, 0, 0);
    if (mouseY >= 0 && mouseY <= height && mouseX >= 0 && mouseX <= width) {


        // drawMap(true, 255, 255, 255, true, 204, 71, 71);
        drawMap(true, 255, 255, 255, true, 68, 61, 71);

    } else {

        drawMap(false, 255, 255, 255, false, 68, 61, 71);
    }



}

function mouseMoved() {
    const mouseXDiv = document.getElementById('mouseX');
    const mouseYDiv = document.getElementById('mouseY');
    mouseXDiv.innerHTML = ` ${mouseX}`;
    mouseYDiv.innerHTML = ` ${mouseY.toFixed(1)}`;

}

