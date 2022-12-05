

let landmass;
let font;
let contourPoints;

function contourPointsLoad() {
    console.log("[✓] Loaded Landmass Points");
}

function preload() {
    landmass = loadImage('./assets/img/landmass.svg');
    font = loadFont('./assets/font/AtkinsonHyperlegible-Regular.ttf');

    contourPoints = loadJSON('./assets/img/landmass.json', contourPointsLoad);


}


function setup() {
    var cnv = createCanvas(windowHeight * 0.8, windowHeight * 0.8)
    cnv.parent('#canvasWrapper')
    background(255)

    console.log(contourPoints);



    // imageMode(CENTER)
    // image(landmass, width * 0.5, height * 0.5, landmass.width * scale, scale * landmass.height);
    


    // fill('#242124');
    // textFont(font);
    // textSize(16);
    // textAlign(CENTER, CENTER)
    // text('Label', width * 0.5, height * 0.5);
}

function draw() {
    if (mouseY >= 0 && mouseY <= height && mouseX >= 0 && mouseX <= width) {
        fill(0, 255, 0);
        ellipse(50, 50, 50, 50);

        let pointScale = 1.2;
        fill(255, 255, 255);
        if (contourPoints.points.length > 0) {
            translate(0, 0);
            stroke(255, 0, 0);
            beginShape();
            for (let i = 0; i < contourPoints.points.length; i++) {
                vertex(contourPoints.points[i][0] * pointScale, contourPoints.points[i][1] * pointScale);
            }
            endShape();
        }


    } else {
        fill(255, 255, 255);
        ellipse(50, 50, 50, 50);
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
