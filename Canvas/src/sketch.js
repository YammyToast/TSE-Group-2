var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Country, ContourObject } from './types.js';
import { DEFAULTOFFSETS, SCALINGCONSTANTS } from './config.js';
import { Controller } from './controller.js';
import { niPointsF, enPointsF, waPointsF, scPointsF, irPointsF } from './contours.js';
/**
 * Creates an instance of a canvas with a bound controller.
 * @param _colorScheme Colour scheme to use in the canvas.
 * @param _labelContainer Label container for the controller.
 * @returns A controller to the initalized canvas instance.
 */
export function setupCanvas(_colorScheme, _labelContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        // Initialize controller variables "outside" of canvas scope.
        // Map of country objects rendered on the canvas.
        let ctryList;
        // Map of static objects rendered on the canvas.
        let staticObjList;
        // Height and Width Translation used as the position for all objects on the canvas.
        let heightTranslation, widthTranslation;
        // X and Y scale factors for all objects
        let scaleFactorX, scaleFactorY;
        // Define an Unitialized controller object.
        let controller;
        /**
         * Define a p5 scope as a variable.
         * Variables defined outside are still constant even within the scope.
         * @param P5 p5 library object.
         */
        var sketch = (P5) => {
            // List used to store the points of countries during the loading phase.
            let ctryPtsList;
            // List used to store the points of objects during the loading phase.
            let objPtsList;
            // TEMPORARY
            let averageColour = {
                r: Math.abs(_colorScheme.gradientLight.r - _colorScheme.gradientDark.r),
                g: Math.abs(_colorScheme.gradientLight.g - _colorScheme.gradientDark.g),
                b: Math.abs(_colorScheme.gradientLight.b - _colorScheme.gradientDark.b),
            };
            /**
             * Load JSON Macro. Requests JSON objects from the server.
             * @returns 2D array, containing the sets of points needed to render the countries, and their extra attributes.
             */
            function loadCountries() {
                // Parses the requested JSON objects into objects.
                let enPoints = { pts: enPointsF, offset: DEFAULTOFFSETS.en, key: 'en' };
                let scPoints = { pts: scPointsF, offset: DEFAULTOFFSETS.sc, key: 'sc' };
                let waPoints = { pts: waPointsF, offset: DEFAULTOFFSETS.wa, key: 'wa' };
                let niPoints = { pts: niPointsF, offset: DEFAULTOFFSETS.ni, key: 'ni' };
                return ([enPoints, scPoints, waPoints, niPoints]);
            }
            /**
             * Load JSON Macro. Requests JSON objects from the server.
             * @returns
             */
            function loadObjects() {
                // Parses the requested JSON objects into objects.
                let irPoints = { pts: irPointsF, offset: DEFAULTOFFSETS.ir, key: 'ir' };
                return ([irPoints]);
            }
            /**
             * Sets the scaling attributes for the canvas, based on the provided scaling config.
             */
            function setScaleFactor() {
                scaleFactorX = P5.width * SCALINGCONSTANTS.scaleX;
                scaleFactorY = P5.height * SCALINGCONSTANTS.scaleY;
                heightTranslation = P5.height * SCALINGCONSTANTS.heightTranslation;
                widthTranslation = P5.width * SCALINGCONSTANTS.widthTranslation;
            }
            /**
             * Scales all of the objects in the static object list.
             */
            function scaleObjects() {
                // Iterate over the static object map.
                staticObjList.forEach((obj, key) => {
                    // Each object scales itself.
                    // Requires the scaleFactors of the canvas to size appropriately.
                    obj.scalePoints(scaleFactorX, scaleFactorY);
                });
            }
            /**
             * Positions all of the objects in the static object list.
             */
            function positionObjects() {
                // Iterate over the static object map.
                staticObjList.forEach((obj, key) => {
                    // Each object positions itself.
                    // Requires the scaleFactors and root translations of the canvas to position appropriately.
                    obj.positionPoints(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation);
                });
            }
            /**
             * Scales all of the countries in the country list.
             */
            function scaleCountries() {
                // Iterate over the country object map.
                ctryList.forEach((ctry, key) => {
                    // Each country scales itself.
                    // Requires the scaleFactors of the canvas to size appropriately.
                    ctry.scaleObject(scaleFactorX, scaleFactorY);
                });
            }
            /**
             * Positions all of the countries in the country list.
             */
            function positionCountries() {
                // Iterate over the country object map.
                ctryList.forEach((ctry, key) => {
                    // Each country positions itself.
                    // Requires the scaleFactors and root translations of the canvas to position appropriately.
                    ctry.positionObject(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation);
                });
            }
            /**
             * Sets the preload function of the p5 object.
             * Called on pre-initialization of the p5 render.
             */
            P5.preload = () => {
                // Starts the profiler timer.
                let preloadStart = Date.now();
                // Load Country Points Macro.
                ctryPtsList = loadCountries();
                // Load Obj Points Macro.
                objPtsList = loadObjects();
                // Ends the the profiler timer.
                let preloadEnd = Date.now();
                // Output Profiler times.
                console.log(`[⧖]\tPreload\t|${preloadEnd - preloadStart}ms|\t[${preloadStart}, ${preloadEnd}]`);
            };
            /**
             * Sets the setup function of the p5 object.
             * Called after the preload function.
             */
            P5.setup = () => {
                // Starts the profiler timer.
                let setupStart = Date.now();
                // Creates the canvas within the p5 object.
                // Height and width are set to parent container's.            
                var cnv = P5.createCanvas($('#canvas-parent').innerWidth(), $('#canvas-parent').innerHeight());
                // Set canvas to render inside of parent container.
                cnv.parent('#canvas-parent');
                $('.p5Canvas').addClass('canvas-element');
                // Initalize country object list.
                ctryList = new Map();
                // Iterate over the map of preloaded country points.
                ctryPtsList.map((obj) => {
                    // Set an Identifier and new Country object in the map.
                    // New Country is passed it's defining points and its static offset.
                    ctryList.set(obj.key, new Country(obj.pts, obj.offset[0], obj.offset[1]));
                    // Set base properties of the country.
                    ctryList.get(obj.key).rootFill = averageColour;
                    ctryList.get(obj.key).fill = averageColour;
                });
                // Iterate over the map of preloaded object points.
                staticObjList = new Map();
                objPtsList.map((obj) => {
                    // Set an identifier and new Object in the map.
                    // The object is passed its defining points and its static offset.
                    staticObjList.set(obj.key, new ContourObject(obj.pts.points, obj.offset[0], obj.offset[1]));
                });
                // Call all of the rendering macros.
                setScaleFactor();
                scaleObjects();
                positionObjects();
                scaleCountries();
                positionCountries();
                // Ends the profiler timer.
                let setupEnd = Date.now();
                // Outputs profiler times.
                console.log(`[⧖]\tSetup\t|${setupEnd - setupStart}ms|\t[${setupStart}, ${setupEnd}]`);
            };
            /**
             * Sets the windowResize event handler for the p5 object.
             * Called whenever the document is reloaded.
             */
            P5.windowResized = () => {
                // Remove as this seems to mess up the size of the canvas element itself.
                // Keep the rest as the items within the canvas need to be scaled.
                // P5.resizeCanvas(((document.body.clientWidth / 6) * 2.90), ((document.body.clientHeight / 5) * 3.90))
                setScaleFactor();
                scaleObjects();
                positionObjects();
                scaleCountries();
                positionCountries();
                // Updates the controller with the new canvas dimensions.
                controller.updateCanvasAttributes(scaleFactorX, scaleFactorY, widthTranslation, heightTranslation);
                // Repositions and renders labels for new screen size.
                controller.positionLabels();
                controller.renderLabels();
            };
            /**
             * Draws all of the objects in the object list.
             */
            function drawObjects() {
                // Sets the constant fill property in the p5 drawing context.
                P5.fill(_colorScheme.gradientNull.r, _colorScheme.gradientNull.g, _colorScheme.gradientNull.b);
                // Iterates over each object in the object list.
                staticObjList.forEach((obj, key) => {
                    // Begins the contour shape.
                    P5.beginShape();
                    // For each point in the object's list.
                    for (let point = 0; point < obj.contourPoints.length; point++) {
                        // Push a new point to the contour shape.
                        P5.vertex(obj.contourPoints[point][0], obj.contourPoints[point][1]);
                    }
                    // End the contour shape.
                    // This completes the loop, and fills the hull of the points in.
                    P5.endShape();
                });
            }
            /**
             * Draw all of the countries in the country list.
             */
            function drawCountries() {
                // For each country in the country list.
                ctryList.forEach((ctry, key) => {
                    // Process all country animations.
                    ctry.processAnimations();
                    // Redefine the stroke weight in the p5 context.
                    P5.strokeWeight(1);
                    // Set the fill in the p5 context to that of the current country's.
                    P5.fill(ctry.fill.r, ctry.fill.g, ctry.fill.b);
                    // Redefine the stroke colour in the p5 context.
                    P5.stroke(_colorScheme.stroke.r, _colorScheme.stroke.g, _colorScheme.stroke.b);
                    // If the country is active, darken the fill.
                    if (ctry.active == true) {
                        P5.fill(_colorScheme.gradientDark.r * 0.5, _colorScheme.gradientDark.g * 0.5, _colorScheme.gradientDark.b * 0.5);
                    }
                    // else if (ctry.hover == true) {
                    //     P5.fill(_colorScheme.gradientDark.r, _colorScheme.gradientDark.g, _colorScheme.gradientDark.b);
                    // }
                    // Begin the contour shape.
                    P5.beginShape();
                    // For each point in the country's list.
                    for (let point = 0; point < ctry.contourPoints.length; point++) {
                        // Push a new point to the contour shape.
                        P5.vertex(ctry.contourPoints[point][0], ctry.contourPoints[point][1]);
                    }
                    // End the contour shape.
                    P5.endShape();
                    // !!!! SHOW DETECT BORDERS
                    // P5.fill(255,255,255, 0)
                    // P5.rect(ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[1], ctryList.at(it).detectPoints[2] - ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[3] - ctryList.at(it).detectPoints[1])
                });
            }
            /**
             * Sets the draw function of the p5 object.
             */
            P5.draw = () => {
                // Set the fill to "water" colour.
                P5.fill(_colorScheme.background.r, _colorScheme.background.g, _colorScheme.background.b);
                // "Clean the canvas with the ocean"
                P5.rect(0, 0, P5.width, P5.height);
                // P5.translate(P5.width * 0.6, P5.height * 0.7)
                drawObjects();
                drawCountries();
            };
            /**
             * Sets event handler for p5 mouse moved event.
             */
            P5.mouseMoved = () => {
                // BROKEN
                P5.cursor(P5.ARROW);
                // For each country in the country list.
                for (let [key, ctry] of ctryList) {
                    // If the country's hoverlock is on, skip.
                    if (ctry.hoverLock == true)
                        continue;
                    // Ask country whether it is being hovered over.
                    ctry.hover = ctry.detectInside([P5.mouseX, P5.mouseY]);
                    // Process hover animations.
                    controller.handleHoverAnimations(ctry);
                }
            };
            /**
             * Sets event handler for p5 mouse click event.
             */
            P5.mouseClicked = () => {
                // Sets optimisation value to false.
                let seenActive = false;
                // For each country in the country list.
                ctryList.forEach((ctry, key) => {
                    // Assk the country whether the mouse is inside its points.
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
                if (seenActive == false) {
                    controller.activeChangeCallback("none");
                }
            };
        };
        // Helper setup function.
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        // Create p5 reference pointer.
        let p5Context;
        yield Promise.all([
            // Initialize p5 canvas.
            p5Context = new p5(sketch),
            // AND wait 50ms
            timeout(50)
        ]);
        // Return new instance of a controller with objects from this canvas instance.
        return controller = new Controller({ ctryList, staticObjList }, _labelContainer, scaleFactorX, scaleFactorY, widthTranslation, heightTranslation);
    });
}
//# sourceMappingURL=sketch.js.map