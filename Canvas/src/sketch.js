var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Country } from './types.js';
import { DEFAULTFILEPATHS, DEFAULTOFFSETS } from './config.js';
var ctryList;
function setupCanvas() {
    return __awaiter(this, void 0, void 0, function () {
        function timeout(ms) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        }
        var sketch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sketch = function (P5) {
                        var ptsList;
                        var scaleFactorX, scaleFactorY;
                        var heightTranslation, widthTranslation;
                        function loadPoints() {
                            var enPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.enContours)), offset: DEFAULTOFFSETS.en, key: 'en' };
                            var scPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.scContours)), offset: DEFAULTOFFSETS.sc, key: 'sc' };
                            var waPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.waContours)), offset: DEFAULTOFFSETS.wa, key: 'wa' };
                            var niPoints = { pts: (P5.loadJSON(DEFAULTFILEPATHS.niContours)), offset: DEFAULTOFFSETS.ni, key: 'ni' };
                            return ([enPoints, scPoints, waPoints, niPoints]);
                        }
                        function setScaleFactor() {
                            scaleFactorX = P5.width * 0.0025;
                            scaleFactorY = P5.height * 0.0015;
                            heightTranslation = P5.height * 0.7;
                            widthTranslation = P5.width * 0.6;
                        }
                        function scaleCountries() {
                            ctryList.forEach(function (ctry, key) {
                                ctry.scaleObject(scaleFactorX, scaleFactorY);
                            });
                        }
                        function positionCountries() {
                            ctryList.forEach(function (ctry, key) {
                                ctry.positionObject(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation);
                            });
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
                            ctryList = new Map();
                            ptsList.map(function (obj) { return ctryList.set(obj.key, new Country(obj.pts, obj.offset[0], obj.offset[1])); });
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
                        function drawCountries() {
                            ctryList.forEach(function (ctry, key) {
                                P5.fill(132, 173, 71);
                                if (ctry.active == true) {
                                    P5.fill(255, 255, 255);
                                }
                                P5.beginShape();
                                for (var point_1 = 0; point_1 < ctry.contourPoints.length; point_1++) {
                                    P5.vertex(ctry.contourPoints[point_1][0], ctry.contourPoints[point_1][1]);
                                }
                                P5.endShape();
                                // !!!! SHOW DETECT BORDERS
                                // P5.fill(255,255,255, 0)
                                // P5.rect(ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[1], ctryList.at(it).detectPoints[2] - ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[3] - ctryList.at(it).detectPoints[1])
                            });
                        }
                        P5.draw = function () {
                            P5.fill(71, 105, 204);
                            P5.rect(0, 0, P5.width, P5.height);
                            // P5.translate(P5.width * 0.6, P5.height * 0.7)
                            drawCountries();
                        };
                        P5.mouseMoved = function () {
                            ctryList.forEach(function (ctry, key) {
                                ctry.active = ctry.detectInside([P5.mouseX, P5.mouseY]);
                            });
                        };
                    };
                    return [4 /*yield*/, Promise.all([
                            new p5(sketch),
                            timeout(1000)
                        ]).then(function () {
                            return "jfghoiwghawoighwagiohoinjhbdf";
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
console.log("Start");
Promise.all([setupCanvas()]).then(function () {
    console.log("Done");
});
//# sourceMappingURL=sketch.js.map