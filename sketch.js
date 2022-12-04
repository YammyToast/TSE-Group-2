
let landmass;
let font;


function preload() {
    landmass = loadImage('./assets/img/landmass.png');
    font = loadFont('./assets/font/AtkinsonHyperlegible-Regular.ttf');
}


function setup() {
    var cnv = createCanvas(windowHeight * 0.8, windowHeight * 0.8)
    cnv.parent('#canvasWrapper')
    background(255)
    
    let scale = 1.3;

    imageMode(CENTER)
    image(landmass, width * 0.5, height * 0.5, landmass.width * scale, scale * landmass.height);


    // fill('#242124');
    // textFont(font);
    // textSize(24);
    // text('Atkinson Hyperlegible', windowWidth * 0.5, windowHeight * 0.5);
}

function draw() {
    if (mouseY >= 0 && mouseY <= height && mouseX >= 0 && mouseX <= width) {
        fill(0, 255, 0);
        ellipse(50, 50, 50, 50);
    } else {
        fill(255, 255, 255);
        ellipse(50, 50, 50, 50);
    }

}

function mouseMoved() {
    const mouseXDiv = document.getElementById('mouseX');
    const mouseYDiv = document.getElementById('mouseY');
    console.log("mouseX: " + mouseX, " Mouse Y: " + mouseY)
    mouseXDiv.innerHTML = ` ${mouseX}`;
    mouseYDiv.innerHTML = ` ${mouseY.toFixed(1)}`;

}

function windowResize() {
    createCanvas(windowWidth * 0.8, windowHeight * 0.8)

}
