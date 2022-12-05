

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

function drawMap(_fillBool, _fillR, _fillG, _fillB, _borderBool, _borderR, _borderG, _borderB) {
    let pointScale = 1.35;


    // ===== CLEAR MAP =====
    fill(71, 105, 204);
    stroke(255, 255, 255);
    strokeWeight(0);
    rect(0, 0, width, height);

    // // =======================================
    // // ===== ENABLE FOR ALIGNING CONTOUR =====
    // // =======================================

    // // Change this translation to move the plan. Make sure to copy to undo translation.
    // translate(width * 0.225 * pointScale, height * 0.05 * pointScale);
    // fill(220);
    // beginShape();
    // for (let i = 0; i < contourPoints.points.length; i++) {
    //     vertex(contourPoints.points[i][0] * pointScale, contourPoints.points[i][1] * pointScale);
    // }
    // endShape();
    // Undo Translation, Reset back to "Anchor".
    // translate(-(width * 0.225 * pointScale), -(height * 0.05 * pointScale));



    if (_fillBool == true) {
        fill(_fillR, _fillG, _fillB);
    } else {
        fill(255, 255, 255);
    }

    if (_borderBool == true) {
        stroke(_borderR, _borderG, _borderB);
        strokeWeight(2);
    } else {
        stroke(0, 0, 0);
        strokeWeight(1);

    }


    // ===========================
    // ===== ENGLAND CONTOUR =====
    // ===========================


    // Translation, don't touch constant values.
    // Origin Translation, constants affect where all the components are rendered.
    translate(width * 0.2 * pointScale, height * 0.23 * pointScale);
    if (enContourPoints.points.length > 0) {
        beginShape();
        for (let i = 0; i < enContourPoints.points.length; i++) {
            vertex(enContourPoints.points[i][0] * pointScale, enContourPoints.points[i][1] * pointScale);
        }
        endShape();
    }
    // Undo Translation, Reset back to "Anchor".
    translate(-(width * 0.2 * pointScale), -(height * 0.23 * pointScale));


    // =========================
    // ===== WALES CONTOUR =====
    // =========================

    // Translation, don't touch constant values.
    // Translations are persistent, so this moves a certain distance from the "Anchor".
    translate(width * 0.22 * pointScale, height * 0.43 * pointScale);
    if (waContourPoints.points.length > 0) {
        beginShape();
        for (let i = 0; i < waContourPoints.points.length; i++) {
            vertex(waContourPoints.points[i][0] * pointScale, waContourPoints.points[i][1] * pointScale);
        }
        endShape();
    }
    // Undo Translation, Reset back to "Anchor".
    translate(-(width * 0.22 * pointScale), -(height * 0.43 * pointScale));


    // ===========================
    // ===== SCOTLAND CONTOUR ====
    // ===========================

    // Translation, don't touch constant values.
    // Translations are persistent, so this moves a certain distance from the "Anchor".
    translate(-(width * 0.054 * pointScale), -(height * 0.248 * pointScale));
    if (scContourPoints.points.length > 0) {
        beginShape();
        for (let i = 0; i < scContourPoints.points.length; i++) {
            vertex(scContourPoints.points[i][0] * pointScale, scContourPoints.points[i][1] * pointScale);
        }
        endShape();

    }
    // Undo Translation, Reset back to "Anchor".
    translate(width * 0.054 * pointScale, height * 0.248 * pointScale);


    // ===================================
    // ===== NORTHERN IRELAND CONTOUR ====
    // ===================================

    // Translation, don't touch constant values.
    // Translations are persistent, so this moves a certain distance from the "Anchor".
    translate(-(width * 0.12 * pointScale), height * 0.05 * pointScale);
    if (niContourPoints.points.length > 0) {
        beginShape();
        for (let i = 0; i < niContourPoints.points.length; i++) {
            vertex(niContourPoints.points[i][0] * pointScale, niContourPoints.points[i][1] * pointScale);
        }
        endShape();

    }
    // Undo Translation, Reset back to "Anchor".
    translate(width * 0.12 * pointScale, -(height * 0.05 * pointScale));



}

function draw() {
    stroke(0, 0, 0);
    if (mouseY >= 0 && mouseY <= height && mouseX >= 0 && mouseX <= width) {


        drawMap(true, 255, 255, 255, true, 204, 71, 71);

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

function windowResize() {
    createCanvas(windowWidth * 0.8, windowHeight * 0.8);

}
