import { Country, ContourObject, HoverAnimation, ColourScheme, Controller, RGB } from './types.js'
import { DEFAULTFILEPATHS, DEFAULTOFFSETS, COLOURSLIGHT } from './config.js';





async function setupCanvas(_colorScheme: ColourScheme, _activeChangeCallback: (_active: string) => void): Promise<Controller> {
    let ctryList: Map<string, Country>;
    let staticObjList: Map<string, ContourObject>;
    let active: boolean;
    var sketch = (P5: p5) => {
        let ctryPtsList: Array<any>;
        let objPtsList: Array<any>;
        let scaleFactorX: number, scaleFactorY: number;
        let heightTranslation: number, widthTranslation: number;

        let averageColour: RGB = {
            r: Math.abs(_colorScheme.gradientLight.r - _colorScheme.gradientDark.r),
            g: Math.abs(_colorScheme.gradientLight.g - _colorScheme.gradientDark.g),
            b: Math.abs(_colorScheme.gradientLight.b - _colorScheme.gradientDark.b),
        }

        function loadCountries(): Array<any> {

            let enPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.enContours)), offset: DEFAULTOFFSETS.en, key: 'en' }
            let scPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.scContours)), offset: DEFAULTOFFSETS.sc, key: 'sc' }
            let waPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.waContours)), offset: DEFAULTOFFSETS.wa, key: 'wa' }
            let niPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.niContours)), offset: DEFAULTOFFSETS.ni, key: 'ni' }

            return ([enPoints, scPoints, waPoints, niPoints])
        }

        function loadObjects(): Array<any> {
            let irPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.irContours)), offset: DEFAULTOFFSETS.ir, key: 'ir' }
            return ([irPoints])
        }

        function setScaleFactor(): void {
            scaleFactorX = P5.width * 0.002
            scaleFactorY = P5.height * 0.0018
            heightTranslation = P5.height * 0.7;
            widthTranslation = P5.width * 0.65;
        }

        function scaleObjects(): void {
            staticObjList.forEach((obj, key) => {
                obj.scalePoints(scaleFactorX, scaleFactorY)
            })
        }

        function positionObjects(): void {
            staticObjList.forEach((obj, key) => {
                obj.positionPoints(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation)
            })
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

            ctryPtsList = loadCountries();
            objPtsList = loadObjects();
            let preloadEnd = Date.now()
            console.log(`[⧖]\tPreload\t|${preloadEnd - preloadStart}ms|\t[${preloadStart}, ${preloadEnd}]`)
        }

        P5.setup = () => {

            let setupStart = Date.now()

            var cnv = P5.createCanvas(((document.body.clientWidth / 6) * 2.90), ((document.body.clientHeight / 5) * 3.90))
            cnv.parent('#canvas-parent')

            ctryList = new Map();
            ctryPtsList.map((obj) => {
                ctryList.set(obj.key, new Country(obj.pts, obj.offset[0], obj.offset[1]))

                ctryList.get(obj.key).rootFill = averageColour;
                ctryList.get(obj.key).fill = averageColour
            })
            staticObjList = new Map();
            objPtsList.map((obj) => {
                console.log(obj)
                staticObjList.set(obj.key, new ContourObject(obj.pts.points, obj.offset[0], obj.offset[1]))
            })
            setScaleFactor();

            scaleObjects();
            positionObjects();
            scaleCountries();
            positionCountries();

            let setupEnd = Date.now()
            console.log(`[⧖]\tSetup\t|${setupEnd - setupStart}ms|\t[${setupStart}, ${setupEnd}]`)

        }

        P5.windowResized = () => {
            P5.resizeCanvas(((document.body.clientWidth / 6) * 2.90), ((document.body.clientHeight / 5) * 3.90))
            setScaleFactor();
            scaleObjects();
            positionObjects();
            scaleCountries();
            positionCountries();
        }

        function drawObjects() {
            P5.fill(_colorScheme.gradientNull.r, _colorScheme.gradientNull.g, _colorScheme.gradientNull.b)
            staticObjList.forEach((obj, key) => {
                P5.beginShape()
                for (let point = 0; point < obj.contourPoints.length; point++) {
                    P5.vertex(
                        obj.contourPoints[point][0]
                        ,
                        obj.contourPoints[point][1]
                    )
                }
                P5.endShape()
            })
        }

        function drawCountries() {
            ctryList.forEach((ctry, key) => {

                ctry.processAnimations();
                P5.strokeWeight(1);

                P5.fill(ctry.fill.r, ctry.fill.g, ctry.fill.b);
                P5.stroke(_colorScheme.stroke.r, _colorScheme.stroke.g, _colorScheme.stroke.b)
                if(ctry.active == true) {
                    P5.fill(_colorScheme.gradientDark.r * 0.5, _colorScheme.gradientDark.g * 0.5, _colorScheme.gradientDark.b * 0.5)
                }
                // else if (ctry.hover == true) {
                //     P5.fill(_colorScheme.gradientDark.r, _colorScheme.gradientDark.g, _colorScheme.gradientDark.b);
                // }
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
            P5.fill(_colorScheme.background.r, _colorScheme.background.g, _colorScheme.background.b);
            P5.rect(0, 0, P5.width, P5.height);
            // P5.translate(P5.width * 0.6, P5.height * 0.7)
            drawObjects();
            drawCountries()

        }

        function handleHoverAnimations(_ctry: Country) {
            let shade = 12;  

            if (_ctry.hover == true && _ctry.active == false) {
                P5.cursor(P5.HAND)
                if(_ctry.animationMap.has('hoverReverse')) {
                    // shade = shade - Math.abs(_ctry.animationMap.get('hoverReverse').endAnimation());
                    _ctry.animationMap.delete('hoverReverse')
                }
                // console.log(shade)
                if (!_ctry.animationMap.has('hover')) {
                    let startFill = {
                        r: _ctry.rootFill.r - shade,
                        g: _ctry.rootFill.g - shade,
                        b: _ctry.rootFill.b - shade
                    }
                    let animation = new HoverAnimation(_ctry,'hover',255,startFill,shade)
                    _ctry.animationMap.set('hover', animation);
                }
            } else {
                if(_ctry.animationMap.has('hover')) {
                    shade = -_ctry.animationMap.get('hover').endAnimation();
                    _ctry.animationMap.delete('hover')


                    if (!_ctry.animationMap.has('hoverReverse')) {
                        let startFill = {
                            r: _ctry.rootFill.r + shade,
                            g: _ctry.rootFill.g + shade,
                            b: _ctry.rootFill.b + shade
                        }
                        let animation = new HoverAnimation(_ctry,'hoverReverse',255,startFill,shade)
                        _ctry.animationMap.set('hoverReverse', animation);
                    }
                }
            }
        }

        P5.mouseMoved = () => {
            P5.cursor(P5.ARROW)
            ctryList.forEach((ctry, key) => {
                ctry.hover = ctry.detectInside([P5.mouseX, P5.mouseY])
                handleHoverAnimations(ctry);

            })
        }

        P5.mouseClicked = () => {
            let seenActive = false;
            ctryList.forEach((ctry, key) => {
                let clickActive = ctry.detectInside([P5.mouseX, P5.mouseY])
                if (clickActive == true && !seenActive) { 
                    ctry.active = true
                    seenActive = true
                    _activeChangeCallback(key)
                } else {
                    ctry.active = false
                }

            })
        }
    }

    function timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await Promise.all([
        new p5(sketch),
        timeout(100)
    ])
    return new Controller(ctryList, staticObjList)
}

function callback(_active: string): void {
    console.log(_active)
}

Promise.all([setupCanvas(COLOURSLIGHT, callback)]).then((obj) => {
    console.log(obj[0].CountryList)
    obj[0].CountryList.get('en').active = true
})