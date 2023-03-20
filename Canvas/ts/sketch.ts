import { Country, ObjPaths, CtryOffsets } from './types.js'
import { DEFAULTFILEPATHS, DEFAULTOFFSETS } from './config.js';

let ctryList: Map<string, Country>;



async function setupCanvas() {
    var sketch = (P5: p5,) => {
        let ptsList: Array<any>;
        let scaleFactorX: number, scaleFactorY: number;
        let heightTranslation: number, widthTranslation: number;

        function loadPoints(): Array<any> {

            let enPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.enContours)), offset: DEFAULTOFFSETS.en, key: 'en' }
            let scPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.scContours)), offset: DEFAULTOFFSETS.sc, key: 'sc' }
            let waPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.waContours)), offset: DEFAULTOFFSETS.wa, key: 'wa' }
            let niPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.niContours)), offset: DEFAULTOFFSETS.ni, key: 'ni' }

            return ([enPoints, scPoints, waPoints, niPoints])
        }

        function setScaleFactor(): void {
            scaleFactorX = P5.width * 0.0025
            scaleFactorY = P5.height * 0.0015
            heightTranslation = P5.height * 0.7;
            widthTranslation = P5.width * 0.6;
        }

        function scaleCountries(): void {
            ctryList.forEach((ctry, key) => {
                ctry.scaleObject(scaleFactorX, scaleFactorY)
            })

        }

        function positionCountries(): void {
            ctryList.forEach((ctry, key) => {
                ctry.positionObject(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation)
            })

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

            ctryList = new Map();
            ptsList.map((obj) => ctryList.set(obj.key, new Country(obj.pts, obj.offset[0], obj.offset[1])))
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

        function drawCountries() {
            ctryList.forEach((ctry, key) => {
                P5.fill(132, 173, 71);
                if (ctry.active == true) {
                    P5.fill(255, 255, 255);
                }
                P5.beginShape()

                for (let point = 0; point < ctry.contourPoints.length; point++) {
                    P5.vertex(
                        ctry.contourPoints[point][0]
                        ,
                        ctry.contourPoints[point][1]
                    )

                }
                P5.endShape()
                // !!!! SHOW DETECT BORDERS
                // P5.fill(255,255,255, 0)
                // P5.rect(ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[1], ctryList.at(it).detectPoints[2] - ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[3] - ctryList.at(it).detectPoints[1])
            })

        }

        P5.draw = () => {
            P5.fill(71, 105, 204);
            P5.rect(0, 0, P5.width, P5.height);
            // P5.translate(P5.width * 0.6, P5.height * 0.7)
            drawCountries()

        }

        P5.mouseMoved = () => {
            ctryList.forEach((ctry, key) => {
                ctry.active = ctry.detectInside([P5.mouseX, P5.mouseY])
            })

        }


    }

    function timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await Promise.all([
        new p5(sketch),
        timeout(1000)
    ]).then(()=>{
        return "jfghoiwghawoighwagiohoinjhbdf"
    })
}
console.log("Start")
Promise.all([setupCanvas()]).then(()=>{
    console.log("Done")

})