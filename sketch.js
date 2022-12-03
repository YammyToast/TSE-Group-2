
let landmass;
let font;


function preload() {
    landmass = loadImage('./assets/img/landmass.png');
    font = loadFont('./assets/font/AtkinsonHyperlegible-Regular.ttf');
}


function setup() {
    var cnv = createCanvas(windowHeight , windowHeight * 0.8)
    cnv.parent('#canvasWrapper')
    background(255)
    
    image(landmass, 0,0);


    // fill('#242124');
    // textFont(font);
    // textSize(24);
    // text('Atkinson Hyperlegible', windowWidth * 0.5, windowHeight * 0.5);
}

function draw() {
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
