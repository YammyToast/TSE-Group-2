var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Country, ContourObject, Controller } from './types.js';
import { DEFAULTFILEPATHS, DEFAULTOFFSETS } from './config.js';
export function setupCanvas(_colorScheme, _labelContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        let ctryList;
        let staticObjList;
        let active;
        let heightTranslation, widthTranslation;
        let scaleFactorX, scaleFactorY;
        // Pass by object to force shared pointer to lists.
        let controller;
        var sketch = (P5) => {
            let ctryPtsList;
            let objPtsList;
            let averageColour = {
                r: Math.abs(_colorScheme.gradientLight.r - _colorScheme.gradientDark.r),
                g: Math.abs(_colorScheme.gradientLight.g - _colorScheme.gradientDark.g),
                b: Math.abs(_colorScheme.gradientLight.b - _colorScheme.gradientDark.b),
            };
            function loadCountries() {
                let enPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.enContours)), offset: DEFAULTOFFSETS.en, key: 'en' };
                let scPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.scContours)), offset: DEFAULTOFFSETS.sc, key: 'sc' };
                let waPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.waContours)), offset: DEFAULTOFFSETS.wa, key: 'wa' };
                let niPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.niContours)), offset: DEFAULTOFFSETS.ni, key: 'ni' };
                return ([enPoints, scPoints, waPoints, niPoints]);
            }
            function loadObjects() {
                let irPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.irContours)), offset: DEFAULTOFFSETS.ir, key: 'ir' };
                return ([irPoints]);
            }
            function setScaleFactor() {
                scaleFactorX = P5.width * 0.0015;
                scaleFactorY = P5.height * 0.0018;
                heightTranslation = P5.height * 0.7;
                widthTranslation = P5.width * 0.65;
            }
            function scaleObjects() {
                staticObjList.forEach((obj, key) => {
                    obj.scalePoints(scaleFactorX, scaleFactorY);
                });
            }
            function positionObjects() {
                staticObjList.forEach((obj, key) => {
                    obj.positionPoints(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation);
                });
            }
            function scaleCountries() {
                ctryList.forEach((ctry, key) => {
                    ctry.scaleObject(scaleFactorX, scaleFactorY);
                });
            }
            function positionCountries() {
                ctryList.forEach((ctry, key) => {
                    ctry.positionObject(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation);
                });
            }
            P5.preload = () => {
                let preloadStart = Date.now();
                ctryPtsList = loadCountries();
                objPtsList = loadObjects();
                let preloadEnd = Date.now();
                console.log(`[⧖]\tPreload\t|${preloadEnd - preloadStart}ms|\t[${preloadStart}, ${preloadEnd}]`);
            };
            P5.setup = () => {
                let setupStart = Date.now();
                var cnv = P5.createCanvas(((document.body.clientWidth / 6) * 2.90), ((document.body.clientHeight / 5) * 3.90));
                cnv.parent('#canvas-parent');
                ctryList = new Map();
                ctryPtsList.map((obj) => {
                    ctryList.set(obj.key, new Country(obj.pts, obj.offset[0], obj.offset[1]));
                    ctryList.get(obj.key).rootFill = averageColour;
                    ctryList.get(obj.key).fill = averageColour;
                });
                staticObjList = new Map();
                objPtsList.map((obj) => {
                    staticObjList.set(obj.key, new ContourObject(obj.pts.points, obj.offset[0], obj.offset[1]));
                });
                setScaleFactor();
                scaleObjects();
                positionObjects();
                scaleCountries();
                positionCountries();
                let setupEnd = Date.now();
                console.log(`[⧖]\tSetup\t|${setupEnd - setupStart}ms|\t[${setupStart}, ${setupEnd}]`);
            };
            P5.windowResized = () => {
                P5.resizeCanvas(((document.body.clientWidth / 6) * 2.90), ((document.body.clientHeight / 5) * 3.90));
                setScaleFactor();
                scaleObjects();
                positionObjects();
                scaleCountries();
                positionCountries();
                controller.updateCanvasAttributes(scaleFactorX, scaleFactorY);
                controller.positionLabels();
                controller.renderLabels();
            };
            function drawObjects() {
                P5.fill(_colorScheme.gradientNull.r, _colorScheme.gradientNull.g, _colorScheme.gradientNull.b);
                staticObjList.forEach((obj, key) => {
                    P5.beginShape();
                    for (let point = 0; point < obj.contourPoints.length; point++) {
                        P5.vertex(obj.contourPoints[point][0], obj.contourPoints[point][1]);
                    }
                    P5.endShape();
                });
            }
            function drawCountries() {
                ctryList.forEach((ctry, key) => {
                    ctry.processAnimations();
                    P5.strokeWeight(1);
                    P5.fill(ctry.fill.r, ctry.fill.g, ctry.fill.b);
                    P5.stroke(_colorScheme.stroke.r, _colorScheme.stroke.g, _colorScheme.stroke.b);
                    if (ctry.active == true) {
                        P5.fill(_colorScheme.gradientDark.r * 0.5, _colorScheme.gradientDark.g * 0.5, _colorScheme.gradientDark.b * 0.5);
                    }
                    // else if (ctry.hover == true) {
                    //     P5.fill(_colorScheme.gradientDark.r, _colorScheme.gradientDark.g, _colorScheme.gradientDark.b);
                    // }
                    P5.beginShape();
                    for (let point = 0; point < ctry.contourPoints.length; point++) {
                        P5.vertex(ctry.contourPoints[point][0], ctry.contourPoints[point][1]);
                    }
                    P5.endShape();
                    // !!!! SHOW DETECT BORDERS
                    // P5.fill(255,255,255, 0)
                    // P5.rect(ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[1], ctryList.at(it).detectPoints[2] - ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[3] - ctryList.at(it).detectPoints[1])
                });
            }
            P5.draw = () => {
                P5.fill(_colorScheme.background.r, _colorScheme.background.g, _colorScheme.background.b);
                P5.rect(0, 0, P5.width, P5.height);
                // P5.translate(P5.width * 0.6, P5.height * 0.7)
                drawObjects();
                drawCountries();
            };
            P5.mouseMoved = () => {
                P5.cursor(P5.ARROW);
                for (let [key, ctry] of ctryList) {
                    if (ctry.hoverLock == true)
                        continue;
                    ctry.hover = ctry.detectInside([P5.mouseX, P5.mouseY]);
                    controller.handleHoverAnimations(ctry);
                }
            };
            P5.mouseClicked = () => {
                let seenActive = false;
                ctryList.forEach((ctry, key) => {
                    let clickActive = ctry.detectInside([P5.mouseX, P5.mouseY]);
                    if (clickActive == true && !seenActive) {
                        ctry.active = true;
                        seenActive = true;
                        controller.activeChangeCallback(key);
                    }
                    else {
                        ctry.active = false;
                    }
                });
            };
        };
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        let p5Context;
        yield Promise.all([
            p5Context = new p5(sketch),
            timeout(50)
        ]);
        return controller = new Controller({ ctryList, staticObjList }, _labelContainer, heightTranslation, widthTranslation, scaleFactorX, scaleFactorY);
    });
}
//# sourceMappingURL=sketch.js.map