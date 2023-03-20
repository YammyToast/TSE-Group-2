import { Country, ObjPaths, CtryOffsets } from './types.js' 
import { DEFAULTFILEPATHS, DEFAULTOFFSETS } from './config.js';




var sketch = (P5: p5, /*_filePaths: ObjPaths*/) => {
    let ptsList: Array<any>;
    let ctryList: Array<Country>;
    let scaleFactorX: number, scaleFactorY: number;
    let heightTranslation: number, widthTranslation: number;

    function loadPoints(): Array<any> {

        let enPoints: any = {pts: (P5.loadJSON(DEFAULTFILEPATHS.enContours)), offset: DEFAULTOFFSETS.en}
        let scPoints: any = {pts: (P5.loadJSON(DEFAULTFILEPATHS.scContours)), offset: DEFAULTOFFSETS.sc}
        let waPoints: any = {pts: (P5.loadJSON(DEFAULTFILEPATHS.waContours)), offset: DEFAULTOFFSETS.wa}
        let niPoints: any = {pts: (P5.loadJSON(DEFAULTFILEPATHS.niContours)), offset: DEFAULTOFFSETS.ni}


        return([enPoints, scPoints, waPoints, niPoints])
    }

    function setScaleFactor(): void {
        scaleFactorX = P5.width * 0.0025
        scaleFactorY = P5.height * 0.0015
        heightTranslation = P5.height * 0.7;
        widthTranslation = P5.width * 0.6;
    }

    function scaleCountries(): void {
        for(let it = 0; it < ctryList.length; it++) {
            ctryList.at(it).scaleObject(scaleFactorX, scaleFactorY);   
        }
    }

    function positionCountries(): void {
        for(let it = 0; it < ctryList.length; it++) {
            ctryList.at(it).positionObject(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation);   
        }
    

    }


    P5.preload = () => {
        let preloadStart = Date.now()
    
        ptsList = loadPoints();
        let preloadEnd = Date.now()
        console.log(`[⧖]\tPreload\t|${preloadEnd - preloadStart}ms|\t[${preloadStart}, ${preloadEnd}]`)
    }   

    P5.setup = () => {
        
        let setupStart = Date.now()

        var cnv = P5.createCanvas(((document.body.clientWidth / 6) * 2.90), ((document.body.clientHeight / 5) * 3.90))
        cnv.parent('#canvas-parent')


        ctryList = ptsList.map((obj) => new Country(obj.pts, obj.offset[0], obj.offset[1]))
        
        setScaleFactor();
        scaleCountries();
        positionCountries();        

        let setupEnd = Date.now()
        console.log(`[⧖]\tSetup\t|${setupEnd - setupStart}ms|\t[${setupStart}, ${setupEnd}]`)

    }

    P5.windowResized = () => {
        P5.resizeCanvas(((document.body.clientWidth / 6) * 2.90), ((document.body.clientHeight / 5) * 3.90))
        setScaleFactor();
        scaleCountries();
        positionCountries();   
    }

    P5.draw = () => {
        P5.fill(71, 105, 204);
        P5.rect(0, 0, P5.width, P5.height);   
        // P5.translate(P5.width * 0.6, P5.height * 0.7)

        for(let it = 0; it < ctryList.length; it++) {
            P5.fill(132, 173, 71);
            if(ctryList.at(it).active == true) {
                P5.fill(255, 255, 255);
            } 
            P5.beginShape()
            
            for(let point = 0; point < ctryList.at(it).contourPoints.length; point++) {
                P5.vertex(
                    ctryList.at(it).contourPoints[point][0]
                    ,
                    ctryList.at(it).contourPoints[point][1]
                )

            }
            P5.endShape()
            // !!!! SHOW DETECT BORDERS
            // P5.fill(255,255,255, 0)
            // P5.rect(ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[1], ctryList.at(it).detectPoints[2] - ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[3] - ctryList.at(it).detectPoints[1])
        }
    }

    P5.mouseMoved = () => {
        for(let it = 0; it < ctryList.length; it++) {
            ctryList.at(it).active = ctryList.at(it).detectInside([P5.mouseX, P5.mouseY]);
        }

    }

}



new p5(sketch)