import { Country, ContourObject, HoverAnimation, ColourScheme, RGB } from './types.js'
import { DEFAULTFILEPATHS, DEFAULTOFFSETS, COLOURSLIGHT, SCALINGCONSTANTS } from './config.js';
import { Controller } from './controller.js'
import { niPointsF, enPointsF, waPointsF, scPointsF, irPointsF } from './contours.js';

/**
 * Creates an instance of a canvas with a bound controller.
 * @param _colorScheme Colour scheme to use in the canvas.
 * @param _labelContainer Label container for the controller.
 * @returns A controller to the initalized canvas instance.
 */
export async function setupCanvas(_colorScheme: ColourScheme, _labelContainer: JQuery<HTMLElement>): Promise<Controller> {
    // Initialize controller variables "outside" of canvas scope.
    // Map of country objects rendered on the canvas.
    let ctryList: Map<string, Country>; 
    // Map of static objects rendered on the canvas.
    let staticObjList: Map<string, ContourObject>;
    // Height and Width Translation used as the position for all objects on the canvas.
    let heightTranslation: number, widthTranslation: number;
    // X and Y scale factors for all objects
    let scaleFactorX: number, scaleFactorY: number;

    // Define an Unitialized controller object.
    let controller: Controller;

    /**
     * Define a p5 scope as a variable.
     * Variables defined outside are still constant even within the scope.
     * @param P5 p5 library object.
     */
    var sketch = (P5: p5) => {
        // List used to store the points of countries during the loading phase.
        let ctryPtsList: Array<any>;
        // List used to store the points of objects during the loading phase.
        let objPtsList: Array<any>;
        // TEMPORARY
        let averageColour: RGB = {
            r: Math.abs(_colorScheme.gradientLight.r - _colorScheme.gradientDark.r),
            g: Math.abs(_colorScheme.gradientLight.g - _colorScheme.gradientDark.g),
            b: Math.abs(_colorScheme.gradientLight.b - _colorScheme.gradientDark.b),
        }
        /**
         * Load JSON Macro. Requests JSON objects from the server.
         * @returns 2D array, containing the sets of points needed to render the countries, and their extra attributes.
         */
        function loadCountries(): Array<any> {
            // Parses the requested JSON objects into objects.
            // let enPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.enContours)), offset: DEFAULTOFFSETS.en, key: 'en' }
            // let scPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.scContours)), offset: DEFAULTOFFSETS.sc, key: 'sc' }
            // let waPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.waContours)), offset: DEFAULTOFFSETS.wa, key: 'wa' }
            // let niPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.niContours)), offset: DEFAULTOFFSETS.ni, key: 'ni' }
            let enPoints: any = { pts: enPointsF, offset: DEFAULTOFFSETS.en, key: 'en'}
            let scPoints: any = { pts: scPointsF, offset: DEFAULTOFFSETS.sc, key: 'sc'}
            let waPoints: any = { pts: waPointsF, offset: DEFAULTOFFSETS.wa, key: 'wa'}
            let niPoints: any = { pts: niPointsF, offset: DEFAULTOFFSETS.ni, key: 'ni'}
            return ([enPoints, scPoints, waPoints, niPoints])
        }
        /**
         * Load JSON Macro. Requests JSON objects from the server.
         * @returns 
         */
        function loadObjects(): Array<any> {
            // Parses the requested JSON objects into objects.
            let irPoints: any = { pts: (P5.loadJSON(DEFAULTFILEPATHS.irContours)), offset: DEFAULTOFFSETS.ir, key: 'ir' }
            return ([irPoints])
        }
        /**
         * Sets the scaling attributes for the canvas, based on the provided scaling config.
         */
        function setScaleFactor(): void {
            scaleFactorX = P5.width * SCALINGCONSTANTS.scaleX
            scaleFactorY = P5.height * SCALINGCONSTANTS.scaleY
            heightTranslation = P5.height * SCALINGCONSTANTS.heightTranslation
            widthTranslation = P5.width * SCALINGCONSTANTS.widthTranslation
        }
        /**
         * Scales all of the objects in the static object list.
         */
        function scaleObjects(): void {
            // Iterate over the static object map.
            staticObjList.forEach((obj, key) => {
                // Each object scales itself.
                // Requires the scaleFactors of the canvas to size appropriately.
                obj.scalePoints(scaleFactorX, scaleFactorY)
            })
        }
        /**
         * Positions all of the objects in the static object list.
         */
        function positionObjects(): void {
            // Iterate over the static object map.
            staticObjList.forEach((obj, key) => {
                // Each object positions itself.
                // Requires the scaleFactors and root translations of the canvas to position appropriately.
                obj.positionPoints(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation)
            })
        }
        /**
         * Scales all of the countries in the country list.
         */
        function scaleCountries(): void {
            // Iterate over the country object map.
            ctryList.forEach((ctry, key) => {
                // Each country scales itself.
                // Requires the scaleFactors of the canvas to size appropriately.
                ctry.scaleObject(scaleFactorX, scaleFactorY)
            })
        }
        /**
         * Positions all of the countries in the country list.
         */
        function positionCountries(): void {
            // Iterate over the country object map.
            ctryList.forEach((ctry, key) => {
                // Each country positions itself.
                // Requires the scaleFactors and root translations of the canvas to position appropriately.
                ctry.positionObject(scaleFactorX, scaleFactorY, heightTranslation, widthTranslation)
            })
        }
        /**
         * Sets the preload function of the p5 object.
         * Called on pre-initialization of the p5 render.
         */
        P5.preload = () => {
            // Starts the profiler timer.
            let preloadStart = Date.now()
            // Load Country Points Macro.
            ctryPtsList = loadCountries();
            // Load Obj Points Macro.
            objPtsList = loadObjects();
            // Ends the the profiler timer.
            let preloadEnd = Date.now();
            // Output Profiler times.
            console.log(`[⧖]\tPreload\t|${preloadEnd - preloadStart}ms|\t[${preloadStart}, ${preloadEnd}]`)
        }
        /**
         * Sets the setup function of the p5 object.
         * Called after the preload function.
         */
        P5.setup = () => {
            // Starts the profiler timer.
            let setupStart = Date.now()
            // Creates the canvas within the p5 object.
            // Height and width are set to parent container's.            
            var cnv = P5.createCanvas($('#canvas-parent').innerWidth(), $('#canvas-parent').innerHeight())
            // Set canvas to render inside of parent container.
            cnv.parent('#canvas-parent')
            $('.p5Canvas').addClass('canvas-element')
            // Initalize country object list.
            ctryList = new Map();
            // Iterate over the map of preloaded country points.
            ctryPtsList.map((obj) => {
                // Set an Identifier and new Country object in the map.
                // New Country is passed it's defining points and its static offset.
                ctryList.set(obj.key, new Country(obj.pts, obj.offset[0], obj.offset[1]))
                // Set base properties of the country.
                ctryList.get(obj.key).rootFill = averageColour;
                ctryList.get(obj.key).fill = averageColour
            })
            // Iterate over the map of preloaded object points.
            staticObjList = new Map();
            objPtsList.map((obj) => {
                // Set an identifier and new Object in the map.
                // The object is passed its defining points and its static offset.
                staticObjList.set(obj.key, new ContourObject(obj.pts.points, obj.offset[0], obj.offset[1]))
            })
            // Call all of the rendering macros.
            setScaleFactor();
            scaleObjects();
            positionObjects();
            scaleCountries();
            positionCountries();
            // Ends the profiler timer.
            let setupEnd = Date.now()
            // Outputs profiler times.
            console.log(`[⧖]\tSetup\t|${setupEnd - setupStart}ms|\t[${setupStart}, ${setupEnd}]`)
        }
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
            controller.updateCanvasAttributes(scaleFactorX, scaleFactorY, widthTranslation, heightTranslation)
            // Repositions and renders labels for new screen size.
            controller.positionLabels();
            controller.renderLabels();
        }
        /**
         * Draws all of the objects in the object list.
         */
        function drawObjects() {
            // Sets the constant fill property in the p5 drawing context.
            P5.fill(_colorScheme.gradientNull.r, _colorScheme.gradientNull.g, _colorScheme.gradientNull.b)
            // Iterates over each object in the object list.
            staticObjList.forEach((obj, key) => {
                // Begins the contour shape.
                P5.beginShape()
                // For each point in the object's list.
                for (let point = 0; point < obj.contourPoints.length; point++) {
                    // Push a new point to the contour shape.
                    P5.vertex(
                        obj.contourPoints[point][0]
                        ,
                        obj.contourPoints[point][1]
                    )
                }
                // End the contour shape.
                // This completes the loop, and fills the hull of the points in.
                P5.endShape()
            })
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
                P5.stroke(_colorScheme.stroke.r, _colorScheme.stroke.g, _colorScheme.stroke.b)
                // If the country is active, darken the fill.
                if(ctry.active == true) {
                    P5.fill(_colorScheme.gradientDark.r * 0.5, _colorScheme.gradientDark.g * 0.5, _colorScheme.gradientDark.b * 0.5)
                }
                // else if (ctry.hover == true) {
                //     P5.fill(_colorScheme.gradientDark.r, _colorScheme.gradientDark.g, _colorScheme.gradientDark.b);
                // }
                // Begin the contour shape.
                P5.beginShape()
                // For each point in the country's list.
                for (let point = 0; point < ctry.contourPoints.length; point++) {
                    // Push a new point to the contour shape.
                    P5.vertex(
                        ctry.contourPoints[point][0]
                        ,
                        ctry.contourPoints[point][1]
                    )
                }
                // End the contour shape.
                P5.endShape()
                // !!!! SHOW DETECT BORDERS
                // P5.fill(255,255,255, 0)
                // P5.rect(ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[1], ctryList.at(it).detectPoints[2] - ctryList.at(it).detectPoints[0], ctryList.at(it).detectPoints[3] - ctryList.at(it).detectPoints[1])
            })

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
            drawCountries()

        }
        /**
         * Sets event handler for p5 mouse moved event.
         */
        P5.mouseMoved = () => {
            // BROKEN
            P5.cursor(P5.ARROW)
            // For each country in the country list.
            for( let [key, ctry] of ctryList) {
                // If the country's hoverlock is on, skip.
                if(ctry.hoverLock == true) continue;
                // Ask country whether it is being hovered over.
                ctry.hover = ctry.detectInside([P5.mouseX, P5.mouseY])
                // Process hover animations.
                controller.handleHoverAnimations(ctry);

            }
        }
        /**
         * Sets event handler for p5 mouse click event.
         */
        P5.mouseClicked = () => {
            // Sets optimisation value to false.
            let seenActive = false;
            // For each country in the country list.
            ctryList.forEach((ctry, key) => {
                // Assk the country whether the mouse is inside its points.
                let clickActive = ctry.detectInside([P5.mouseX, P5.mouseY])
                if (clickActive == true && !seenActive) { 
                    ctry.active = true
                    seenActive = true
                    controller.activeChangeCallback(key)
                } else {
                    ctry.active = false
                }

            })
            if (seenActive == false) {
                controller.activeChangeCallback("none")
            }
        }
    }
    // Helper setup function.
    function timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Create p5 reference pointer.
    let p5Context: p5;
    await Promise.all([
        // Initialize p5 canvas.
        p5Context = new p5(sketch),
        // AND wait 50ms
        timeout(50)
    ])
    // Return new instance of a controller with objects from this canvas instance.
    return controller = new Controller({ctryList, staticObjList}, _labelContainer, scaleFactorX, scaleFactorY, widthTranslation, heightTranslation)
}