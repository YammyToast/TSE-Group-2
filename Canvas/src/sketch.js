import { Country } from './types.js';
import { DEFAULTFILEPATHS, DEFAULTOFFSETS } from './config.js';
var sketch = function (P5) {
    var ptsList;
    var ctryList;
    var scaleFactor, heightTranslation, widthTranslation;
    function loadPoints() {
        var enPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.enContours)), offset: DEFAULTOFFSETS.en };
        var scPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.scContours)), offset: DEFAULTOFFSETS.sc };
        var waPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.waContours)), offset: DEFAULTOFFSETS.wa };
        var niPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.niContours)), offset: DEFAULTOFFSETS.ni };
        return ([enPoints, scPoints, waPoints, niPoints]);
    }
    function setScaleFactor() {
        scaleFactor = P5.height * 0.0018;
        heightTranslation = P5.height * 0.7;
        widthTranslation = P5.width * 0.6;
    }
    function scaleCountries() {
        for (var it = 0; it < ctryList.length; it++) {
            ctryList.at(it).scaleObject(scaleFactor);
        }
    }
    function positionCountries() {
        for (var it = 0; it < ctryList.length; it++) {
            ctryList.at(it).positionObject(scaleFactor, heightTranslation, widthTranslation);
        }
    }
    P5.preload = function () {
        var preloadStart = Date.now();
        ptsList = loadPoints();
        var preloadEnd = Date.now();
        console.log("[\u29D6]\tPreload\t|".concat(preloadEnd - preloadStart, "ms|\t[").concat(preloadStart, ", ").concat(preloadEnd, "]"));
    };
    P5.setup = function () {
        var setupStart = Date.now();
        var cnv = P5.createCanvas(((document.body.clientWidth / 6) * 2.90), ((document.body.clientHeight / 5) * 3.90));
        cnv.parent('#canvas-parent');
        ctryList = ptsList.map(function (obj) { return new Country(obj.pts, obj.offset[0], obj.offset[1]); });
        setScaleFactor();
        scaleCountries();
        positionCountries();
        var setupEnd = Date.now();
        console.log("[\u29D6]\tSetup\t|".concat(setupEnd - setupStart, "ms|\t[").concat(setupStart, ", ").concat(setupEnd, "]"));
    };
    P5.windowResized = function () {
        P5.resizeCanvas(((document.body.clientWidth / 6) * 2.90), ((document.body.clientHeight / 5) * 3.90));
        setScaleFactor();
        scaleCountries();
        positionCountries();
    };
    P5.draw = function () {
        P5.fill(71, 105, 204);
        P5.rect(0, 0, P5.width, P5.height);
        // P5.translate(P5.width * 0.6, P5.height * 0.7)
        for (var it = 0; it < ctryList.length; it++) {
            P5.fill(132, 173, 71);
            if (ctryList.at(it).active == true) {
                P5.fill(255, 255, 255);
            }
            P5.beginShape();
            for (var point_1 = 0; point_1 < ctryList.at(it).contourPoints.length; point_1++) {
                P5.vertex(ctryList.at(it).contourPoints[point_1][0], ctryList.at(it).contourPoints[point_1][1]);
            }
            P5.endShape();
            // P5.translate(-(P5.width * 0.6), -(P5.height * 0.7))
            P5.fill(255, 255, 255, 0);
            P5.rect(ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[1], ctryList.at(it).detectPoints[2] - ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[3] - ctryList.at(it).detectPoints[1]);
            // P5.translate(P5.width * 0.6, P5.height * 0.7)
        }
    };
    P5.mouseMoved = function () {
        for (var it = 0; it < ctryList.length; it++) {
            ctryList.at(it).detectInside([P5.mouseX, P5.mouseY]);
            if (ctryList.at(it).active == true)
                console.log("Active");
            // console.log(`${ctryList.at(it).detectPoints}, [${P5.mouseX}, ${P5.mouseY}]` )
        }
    };
};
new p5(sketch);
//# sourceMappingURL=sketch.js.map