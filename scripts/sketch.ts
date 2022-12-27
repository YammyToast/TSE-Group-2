type RGBColour = {
    R: number,
    G: number,
    B: number
}

enum landmassEntity {
    None = 1,
    NorthernIreland,
    Scotland,
    Wales,
    England
}



const white: RGBColour = { R: 255, G: 255, B: 255 };
const gray: RGBColour = { R: 220, G: 220, B: 220 };
const black: RGBColour = { R: 0, G: 0, B: 0 };
const enRed: RGBColour = { R: 255, G: 77, B: 109 };
const niYellow: RGBColour = { R: 255, G: 237, B: 77 };
const scBlue: RGBColour = { R: 86, G: 77, B: 255 };
const waGreen: RGBColour = { R: 83, G: 255, B: 77 };
const hoverGray: RGBColour = { R: 142, G: 153, B: 141 };

var sketch = (P5: p5) => {

    // let durationTimers: string[];

    
    let activeEntity: landmassEntity; 
    let hoverEntity: landmassEntity;


    let landmass: any;
    let font: any;
    let pointScale: number;

    let gbContourPoints: number[][] = [];
    let irContourPoints: number[][] = [];

    let gbStaticObject: any;
    let irStaticObject: any;

    let enContourPoints: number[][] = [];
    let waContourPoints: number[][] = [];
    let scContourPoints: number[][] = [];
    let niContourPoints: number[][] = [];

    let enStaticObject: any;
    let waStaticObject: any;
    let scStaticObject: any;
    let niStaticObject: any;

    // TopLeft-X, TopLeft-Y, BottomRight-X, BottomRight-Y
    let enBoundaryPoints: number[] = [0, 0, 0, 0];
    let waBoundaryPoints: number[] = [0, 0, 0, 0];
    let scBoundaryPoints: number[] = [0, 0, 0, 0];
    let niBoundaryPoints: number[] = [0, 0, 0, 0];

    // LeftX, Top-Y, Right-X, Bottom-Y
    let enDetectPoints: number[] = [0, 0, 0, 0];
    let waDetectPoints: number[] = [0, 0, 0, 0];
    let scDetectPoints: number[] = [0, 0, 0, 0];
    let niDetectPoints: number[] = [0, 0, 0, 0];

    let gbOffset: number[] = [-59, -122];
    let irOffset: number[] = [-212, -45];

    let enOffset: number[] = [0, 0];
    let waOffset: number[] = [-72, 8];
    let scOffset: number[] = [-98, -246];
    let niOffset: number[] = [-170, -118];

    let widthTranslation: number;
    let heightTranslation: number;

    /**
     * @brief LoadJSON function callback. Can be removed and replaced with an anonymous function.
     */
    function contourPointsLoad() {
        console.log("[✓] Loaded Contour Points");
    }

    
    
    function angle2D(_x1: number, _y1: number, _x2: number, _y2: number): number {
        let dtheta, theta1, theta2;
        
        theta1 = Math.atan2(_y1, _x1);
        theta2 = Math.atan2(_y2, _x2);
        dtheta = theta2 - theta1;
        while (dtheta > Math.PI) {
            dtheta -= 2 * Math.PI;
        }
        while (dtheta < - Math.PI) {
            dtheta += 2 * Math.PI;
        }
        
        return (dtheta);
    }
    
    //https://www.eecs.umich.edu/courses/eecs380/HANDOUTS/PROJ2/InsidePoly.html
    // IMPLEMENTATION OF ALGORITHM 2
    function detectInside(_polygon: number[][], _mouse: number[]) {
        let angle: number = 0;
        

        for (let i = 0; i < _polygon.length - 1; i++) {
            let p1: number[] = [_polygon[i][0] - P5.mouseX, _polygon[i][1] - P5.mouseY];
            let p2: number[] = [_polygon[(i+1)%_polygon.length][0] - P5.mouseX, _polygon[(i+1)%_polygon.length][1] - P5.mouseY];
            angle += angle2D(p1[0], p1[1], p2[0], p2[1]);
        }

        if (Math.abs(angle) < Math.PI) {
            return false;
        } else {
            return true;
        }
    }


    function detectActiveEntity(): landmassEntity {
        // APPLY HEURISTIC BOUNDARIES TO REMOVE UNNECCESSARY CALCULATIONS.
        if (P5.mouseX >= niDetectPoints[0] && P5.mouseX <= niDetectPoints[2] && P5.mouseY >= niDetectPoints[1] && P5.mouseY <= niDetectPoints[3]) {

            if(detectInside(niContourPoints, [P5.mouseX, P5.mouseY]) == true) {
                return landmassEntity.NorthernIreland;
            }
        }
        if (P5.mouseX >= waDetectPoints[0] && P5.mouseX <= waDetectPoints[2] && P5.mouseY >= waDetectPoints[1] && P5.mouseY <= waDetectPoints[3]) {
            if(detectInside(waContourPoints, [P5.mouseX, P5.mouseY])) {
                return landmassEntity.Wales;
            }
        }
        if (P5.mouseX >= scDetectPoints[0] && P5.mouseX <= scDetectPoints[2] && P5.mouseY >= scDetectPoints[1] && P5.mouseY <= scDetectPoints[3]) {
            if(detectInside(scContourPoints, [P5.mouseX, P5.mouseY])) {
                return landmassEntity.Scotland;
            }
        }
        if (P5.mouseX >= enDetectPoints[0] && P5.mouseX <= enDetectPoints[2] && P5.mouseY >= enDetectPoints[1] && P5.mouseY <= enDetectPoints[3]) {
            if(detectInside(enContourPoints, [P5.mouseX, P5.mouseY])) {
                return landmassEntity.England;
            }
        }
        return landmassEntity.None;

    }

   

    function scaleContourPoints(_points: number[][], _offset: number[]) {
        
        for (let pointNum = 0; pointNum < _points.length; pointNum++) {
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
    function setDetectPoints(_detectPointsContainer: number[], _boundaryPoints: number[], _offsetPoints: number[]): void {
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
    function setBoundaryPoints(_boundaryPointsContainer: number[], _points: number[][]): void {
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

    function loadPoints() {

        landmass = P5.loadImage('../assets/img/landmass.svg');
        font = P5.loadFont('../assets/font/AtkinsonHyperlegible-Regular.ttf');

        gbStaticObject = P5.loadJSON('../assets/contours/gb.json', contourPointsLoad);
        irStaticObject = P5.loadJSON('../assets/contours/ireland.json', contourPointsLoad);


        // contourPoints = loadJSON('./assets/img/landmass.json', contourPointsLoad);
        enStaticObject = P5.loadJSON('../assets/contours/england.json', contourPointsLoad);
        waStaticObject = P5.loadJSON('../assets/contours/wales.json', contourPointsLoad);
        scStaticObject = P5.loadJSON('../assets/contours/scotland.json', contourPointsLoad);
        niStaticObject = P5.loadJSON('../assets/contours/northernireland.json', contourPointsLoad);
    }


    function rescaleValues() {
        widthTranslation = P5.width * 0.6;
        heightTranslation = P5.height * 0.7;


        // Some value around 1.3
        pointScale = P5.height * 0.0015;
        console.log("Height: ", heightTranslation, " Width: ", widthTranslation, " Pointscale: ", pointScale);
        // pointScale = P5.height * 0.00015;

        // Fuck javascript for making this the only way to deepcopy!!!!
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        gbContourPoints = JSON.parse(JSON.stringify(gbStaticObject.points));
        irContourPoints = JSON.parse(JSON.stringify(irStaticObject.points));

        enContourPoints = JSON.parse(JSON.stringify(enStaticObject.points));
        waContourPoints = JSON.parse(JSON.stringify(waStaticObject.points));
        scContourPoints = JSON.parse(JSON.stringify(scStaticObject.points));
        niContourPoints = JSON.parse(JSON.stringify(niStaticObject.points));

        // console.log(enStaticObject);
        // console.log(enContourPoints);
        
        setBoundaryPoints(enBoundaryPoints, enContourPoints);
        setBoundaryPoints(waBoundaryPoints, waContourPoints);
        setBoundaryPoints(scBoundaryPoints, scContourPoints);
        setBoundaryPoints(niBoundaryPoints, niContourPoints);
        
        setDetectPoints(enDetectPoints, enBoundaryPoints, enOffset);
        setDetectPoints(waDetectPoints, waBoundaryPoints, waOffset);
        setDetectPoints(scDetectPoints, scBoundaryPoints, scOffset);
        setDetectPoints(niDetectPoints, niBoundaryPoints, niOffset);

        scaleContourPoints(gbContourPoints, gbOffset);
        scaleContourPoints(irContourPoints, irOffset);
        
        scaleContourPoints(enContourPoints, enOffset);
        scaleContourPoints(waContourPoints, waOffset);
        scaleContourPoints(scContourPoints, scOffset);
        scaleContourPoints(niContourPoints, niOffset);



        
    }


    P5.preload = () => {

        let preloadStart = Date.now();

        loadPoints();
        let preloadEnd = Date.now();
        // durationTimers.push(`[⧖] Preload Duration : ${preloadEnd - preloadStart}ms`)

    }


    P5.setup = () => {

        let setupStart = Date.now();

        var cnv = P5.createCanvas(P5.windowHeight * 0.8, P5.windowHeight * 0.8)
        cnv.parent('#canvasWrapper')

        rescaleValues();
        console.log(enContourPoints);
        // fill('#242124');
        // textFont(font);
        // textSize(16);
        // textAlign(CENTER, CENTER)
        // text('Label', width * 0.5, height * 0.5);

        let setupEnd = Date.now();
        // durationTimers.push(`[⧖] Setup Duration : ${setupEnd - setupStart}ms`)

        // for (let i = 0; i < durationTimers.length; i++) {
            // console.log(durationTimers[i]);

        // }
    }

    // TODO: IMPLEMENT RESIZE FUNCTION.
    P5.windowResized = () => {
        P5.resizeCanvas(P5.windowHeight * 0.8, P5.windowHeight * 0.8, true);

        console.log("Window Resized");

        rescaleValues();

    }

    function drawShapeFromContours(_points: number[][], _fillRGB: RGBColour | void, _strokeRGB: RGBColour | void, _fillAlpha: number | void) {

        if (_fillRGB) {
            P5.fill(_fillRGB.R, _fillRGB.G, _fillRGB.B, _fillAlpha ? _fillAlpha : 230);
        } else {
            P5.noFill();
        }

        if (_strokeRGB) {
            P5.stroke(_strokeRGB.R, _strokeRGB.G, _strokeRGB.B);
            P5.strokeWeight(4);
        } else {
            P5.noStroke();
        }

        if (_points.length > 0) {
            P5.beginShape();
            for (let it = 0; it < _points.length; it++) {
                P5.vertex(_points[it][0], _points[it][1])
            }
            P5.endShape();
        }
        
    }





    P5.draw = () => {

        // ===== CLEAR MAP =====
        P5.fill(71, 105, 204);
        P5.stroke(255, 255, 255);
        P5.strokeWeight(0);
        P5.rect(0, 0, P5.width, P5.height);

        P5.stroke(0, 0, 0);


        // P5.translate(widthTranslation, heightTranslation);

        drawShapeFromContours(gbContourPoints, white);
        drawShapeFromContours(irContourPoints, gray)
        drawShapeFromContours(niContourPoints, white);

        switch(hoverEntity) {
            case landmassEntity.NorthernIreland:
                drawShapeFromContours(niContourPoints, hoverGray, hoverGray, 100);
                break;
            case landmassEntity.Wales:
                drawShapeFromContours(waContourPoints, hoverGray, hoverGray, 100);
                break;
            case landmassEntity.Scotland:
                drawShapeFromContours(scContourPoints, hoverGray, hoverGray, 100);
                break;
            case landmassEntity.England:
                drawShapeFromContours(enContourPoints, hoverGray, hoverGray, 100);
                break;
            default:
                break;
        }

        
        switch(activeEntity) {
            case landmassEntity.NorthernIreland:
                drawShapeFromContours(niContourPoints, niYellow, niYellow, 100);
                break;
            case landmassEntity.Wales:
                drawShapeFromContours(waContourPoints, waGreen, waGreen, 100);
                break;
            case landmassEntity.Scotland:
                drawShapeFromContours(scContourPoints, scBlue, scBlue, 100);
                break;
            case landmassEntity.England:
                drawShapeFromContours(enContourPoints, enRed, enRed, 100);
                break;
            default:
                break;
        }
        


    }

    P5.mouseClicked = () => {
        activeEntity = hoverEntity;
        const detectDiv = document.getElementById('detect')
        const activeDiv = document.getElementById('activeEntity');
        if (activeEntity) {
            detectDiv.innerHTML = ` ${(activeEntity == landmassEntity.None) ? "" : landmassEntity[activeEntity]}`
            activeDiv.innerHTML = ` ${activeEntity}`
        }


    }

    P5.mouseMoved = () => {
        hoverEntity = detectActiveEntity();
        const mouseXDiv = document.getElementById('mouseX');
        const mouseYDiv = document.getElementById('mouseY');
        mouseXDiv.innerHTML = ` ${P5.mouseX.toFixed(1)}`;
        mouseYDiv.innerHTML = ` ${P5.mouseY.toFixed(1)}`;
    }


}
new p5(sketch);