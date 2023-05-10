import { HoverAnimation, } from "./types.js";
import { createLabel, COLOURSLIGHT, ViewTypes, createSelectItems, GRAPHIDS, } from "./config.js";
import { drawYearAverageGraph } from "./graph.js";
/**
 * Interface / View-Controller Abstraction layer for the canvas.
 * Controls canvas through access to abstraction objects.
 * Provides an API to a single canvas instance.
 */
export class Controller {
    /**
     * Callback function for the canvas renderer when a change,
     * in the active country is detected by the canvas renderer.
     * @param _active Identifier of the new active country.
     * @returns Void
     */
    activeChangeCallback(_active) {
        // If the new active country is the same as the last, do nothing.
        if (_active == this.lastActive)
            return;
        // Set the last selected country to the newly selected.
        this.lastActive = _active;
        // Access the manager through the bound callback function.
        this.managerChangeCallback(_active);
    }
    /**
     * Process the animation map of the provided country.
     * This is called regardless of the whether the renderer
     * detects the country as being hovered over.
     * @param _ctry Country Object containing the Animation map to process.
     */
    handleHoverAnimations(_ctry) {
        // Maximum shade to exert for the hover animation.
        let shade = 12;
        /*
            If the country has been detected as being hovered by the renderer,
            and is also not currently active, add hovering shade.
             */
        if (_ctry.hover == true && _ctry.active == false) {
            // If the animation map contains the reverse animation,
            // remove it.
            if (_ctry.animationMap.has("hoverReverse")) {
                _ctry.animationMap.delete("hoverReverse");
            }
            // If the country doesn't already have a hover animation in its map.
            if (!_ctry.animationMap.has("hover")) {
                // Set the start fill for the animation to revert when the animation finishes.
                let startFill = {
                    r: _ctry.rootFill.r - shade,
                    g: _ctry.rootFill.g - shade,
                    b: _ctry.rootFill.b - shade,
                };
                // Create a new animation, referencing the hovered country, that lasts
                // for 255ms.
                let animation = new HoverAnimation(_ctry, "hover", 255, startFill, shade);
                // Add the animation to the animationMap of the hovered country.
                _ctry.animationMap.set("hover", animation);
            }
        }
        // If the country isn't currently being hovered over.
        else {
            // If the country has previously been hovered over.
            if (_ctry.animationMap.has("hover")) {
                // Set the shade to "undo" based on the progress of the hover animation.
                shade = -_ctry.animationMap.get("hover").endAnimation();
                // Delete the hover animation from the country's map.
                _ctry.animationMap.delete("hover");
                // If the country doesn't currently have a reverse animation.
                if (!_ctry.animationMap.has("hoverReverse")) {
                    // Set the target colour based on the "undo" shade.
                    let startFill = {
                        r: _ctry.rootFill.r + shade,
                        g: _ctry.rootFill.g + shade,
                        b: _ctry.rootFill.b + shade,
                    };
                    // Create a new animation, referencing the hovered country, that lasts
                    // for 255ms.
                    let animation = new HoverAnimation(_ctry, "hoverReverse", 255, startFill, shade);
                    // Add the reverse animation to the animationMap of the hovered country.
                    _ctry.animationMap.set("hoverReverse", animation);
                }
            }
        }
    }
    /**
     * Handles the changing of parameters of the map when a new view is selected.
     * @param _view Identifier of the new view to render.
     * @returns Void
     */
    viewChange(_view) {
        // If the newly selected view is the same as the last, don't do anything.
        if (this.viewActive == _view)
            return;
        // Set the last selected view as the newly selected.
        this.viewActive = _view;
        // Rerender the map's labels with attributes for the new view.
        this.renderSelectBarLabels();
        this.manager.handleYearSelection(document.getElementById("yearslider").value);
    }
    /**
     * Helper function, to verify whether the provided Identifier exists
     * within the country set.
     * @param _labelName
     * @returns True: Identifier exists in set. False: Identifier doesn't exist in set.
     */
    checkLabelOwnerExists(_labelName) {
        // Iterate over each country's identifier (key).
        for (let key of this.countryList.keys()) {
            // If the key and identifier match, there is a valid owner.
            if (_labelName == key)
                return true;
        }
        // Return if false if no matching identifier was found.
        return false;
    }
    /**
     * Intialize Label HTML elements from the provided config. Doesn't render labels
     * onto map.
     * @param _labelConfig Configuration from which to create the labels.
     */
    setupLabels(_labelConfig) {
        // For each item in the labelConfig.
        for (let config in Object.entries(_labelConfig)) {
            // Access values of this iteration of the config.
            let info = Object.values(_labelConfig)[config];
            // If the owner of this iteration instance doesn't exist, skip to the next object.
            if (!this.checkLabelOwnerExists(info.owner))
                continue;
            // A JQuery-Wrapper Label Element.
            let element = createLabel(COLOURSLIGHT);
            // Get the Country for which the label will be bound to.
            let country = this.countryList.get(info.owner);
            // Set the title of the label from the config.
            element.find("#canvas-label-title").text(info.title);
            // Create the controller's reference to the label element.
            // Offsets are obtained from the labelConfig.
            let label = {
                content: element,
                offsetX: info.offset[0],
                offsetY: info.offset[1],
            };
            // Add an event listener to the label.
            // This event listener will allow for the hover animation of its bound
            // owner to be played when this label is hovered over.
            label.content.on("mouseenter", (e) => {
                // Set the hoverLock to true, requirement of the current animation system.
                // Prevents the hover attribute from being set to false.
                country.hoverLock = true;
                country.hover = true;
                // Manually call to process animations.
                this.handleHoverAnimations(country);
            });
            // Reverse of the above bound hover event.
            // Once a country leaves the bounds of the label.
            label.content.on("mouseleave", (e) => {
                // Remove the hoverLock.
                // Setting the hover value to false is unneccesary, as it is handled
                // on the next frame by the renderer.
                country.hoverLock = false;
            });
            // WIP.
            label.content.on("click", (e) => {
                country.active = true;
            });
            // Add the label the reference to the set of labels.
            this.labelList.set(info.owner, label);
        }
    }
    /**
     * Updates the saved atrributes relating to the owner canvas. This is done on every
     * context change, i.e. screen resize.
     * @param _scaleFactorX New scaleX factor being used in the render.
     * @param _scaleFactorY New scaleY factor being used in the render.
     * @param _widthTranslation New width translation being used in the render.
     * @param _heightTranslation New height translation being used in the render.
     */
    updateCanvasAttributes(_scaleFactorX, _scaleFactorY, _widthTranslation, _heightTranslation) {
        // Object.assign(this, {_scaleFactorX, _scaleFactorY, _widthTranslation, _heightTranslation});
        this.canvasScaleFactorX = _scaleFactorX;
        this.canvasScaleFactorY = _scaleFactorY;
        this.canvasHeightTranslation = _heightTranslation;
        this.canvasWidthTranslation = _widthTranslation;
    }
    /**
     * (Re)position all labels owned by the controller after a context change.
     */
    positionLabels() {
        // Iterate over each label in the map.
        for (let [key, label] of this.labelList.entries()) {
            // Skip the positioning of the label if it has no existing owner.
            if (!this.checkLabelOwnerExists(key))
                continue;
            // Position the labels by assigning CSS properties.
            // The root position of the label is the top left of the labelContainer.
            label.content.css({
                top: this.canvasHeightTranslation +
                    label.offsetY * this.canvasScaleFactorY,
                left: this.canvasWidthTranslation + label.offsetX * this.canvasScaleFactorX,
            });
        }
    }
    /**
     * Render the labels onto the canvas.
     */
    renderLabels() {
        // Iterate over each label in the map.
        for (let obj of this.labelList.values()) {
            // Apppend the HTML element to the label container
            // "Rendering" the item.
            obj.content.appendTo(this.labelContainer);
        }
    }
    /**
     * Renders each item of the view-select container.
     * @returns Void
     */
    renderSelectBarLabels() {
        // Find the select-bar element.
        let selectBar = this.labelContainer.find("#canvas-label-select-bar");
        // If the element could not be found, return.
        if (!selectBar)
            return;
        // Empty the select-bar element of any previous buttons.
        selectBar.empty();
        // Iterate over each entry in the ViewTypes enum.
        for (let key = 0; key < Object.entries(ViewTypes).length; key++) {
            // Create a HTML element according to the enum Identifier, using the current colour scheme.
            let element = createSelectItems(Object.entries(ViewTypes)[key][0], COLOURSLIGHT);
            // If the current iterated view is selected as active.
            if (key == this.viewActive) {
                // Add the active class to change its appearance.
                element.addClass("canvas-label-select-bar-item-active");
                // Show the dropdown element of the button.
                element.find(".canvas-label-select-bar-dropdown").show();
            }
            else {
                // Add an event listener to the label to allow it to be select as active.
                // The active element won't retain its event as the label-container is cleared
                // on each iteration.
                element.on("click", (e) => {
                    this.viewChange(key);
                });
                // Hide the dropdown element of the button.
                element.find(".canvas-label-select-bar-dropdown").hide();
            }
            // Append the button to the select-bar container.
            element.appendTo(selectBar);
        }
    }
    /**
     * Renders the intensity of data on to the country objects, to create the
     * data visualization.
     * @param _yearAverages Requested data of the yearly averages to be rendered on the countries.
     * this is inclusive of data not relevant to the current view.
     * @param _dataMinValue Minimum value of the current data type in the dataset.
     * @param _dataMaxValue Maximum value of the current data type in the dataset.
     * @param _colourScheme Colour Scheme to render the intensity to.
     */
    renderYearAverages(_yearAverages, _dataMinValue, _dataMaxValue, _colourScheme) {
        try {
            let range = _dataMaxValue - _dataMinValue;
            let colourGradient = {
                r: (_colourScheme.gradientDark.r - _colourScheme.gradientLight.r) /
                    range,
                g: (_colourScheme.gradientDark.g - _colourScheme.gradientLight.g) /
                    range,
                b: (_colourScheme.gradientDark.b - _colourScheme.gradientLight.b) /
                    range,
            };
            let data = {};
            switch (this.viewActive) {
                case ViewTypes.rainfall:
                    data.en = _yearAverages.en.rainfall;
                    data.sc = _yearAverages.sc.rainfall;
                    data.wa = _yearAverages.wa.rainfall;
                    data.ni = _yearAverages.ni.rainfall;
                    break;
                case ViewTypes.sunshine:
                    data.en = _yearAverages.en.sunshine;
                    data.sc = _yearAverages.sc.sunshine;
                    data.ni = _yearAverages.ni.sunshine;
                    data.wa = _yearAverages.wa.sunshine;
                    break;
                case ViewTypes.lowTemp:
                    data.en = _yearAverages.en.lowTemp;
                    data.sc = _yearAverages.sc.lowTemp;
                    data.wa = _yearAverages.wa.lowTemp;
                    data.ni = _yearAverages.ni.lowTemp;
                    break;
                case ViewTypes.highTemp:
                    data.en = _yearAverages.en.highTemp;
                    data.sc = _yearAverages.sc.highTemp;
                    data.wa = _yearAverages.wa.highTemp;
                    data.ni = _yearAverages.ni.highTemp;
                    break;
            }
            // console.log(this.countryList)
            if (this.countryList.has("en")) {
                let groundedVal = data.en - _dataMinValue;
                let colour = {
                    r: _colourScheme.gradientDark.r - colourGradient.r * groundedVal,
                    g: _colourScheme.gradientDark.g - colourGradient.g * groundedVal,
                    b: _colourScheme.gradientDark.b - colourGradient.b * groundedVal,
                };
                this.countryList.get("en").fill = colour;
                this.countryList.get("en").rootFill = colour;
            }
            if (this.countryList.has("ni")) {
                let groundedVal = data.ni - _dataMinValue;
                let colour = {
                    r: _colourScheme.gradientDark.r - colourGradient.r * groundedVal,
                    g: _colourScheme.gradientDark.g - colourGradient.g * groundedVal,
                    b: _colourScheme.gradientDark.b - colourGradient.b * groundedVal,
                };
                this.countryList.get("ni").fill = colour;
                this.countryList.get("ni").rootFill = colour;
            }
            if (this.countryList.has("sc")) {
                let groundedVal = data.sc - _dataMinValue;
                let colour = {
                    r: _colourScheme.gradientDark.r - colourGradient.r * groundedVal,
                    g: _colourScheme.gradientDark.g - colourGradient.g * groundedVal,
                    b: _colourScheme.gradientDark.b - colourGradient.b * groundedVal,
                };
                this.countryList.get("sc").fill = colour;
                this.countryList.get("sc").rootFill = colour;
            }
            if (this.countryList.has("wa")) {
                let groundedVal = data.wa - _dataMinValue;
                let colour = {
                    r: _colourScheme.gradientDark.r - colourGradient.r * groundedVal,
                    g: _colourScheme.gradientDark.g - colourGradient.g * groundedVal,
                    b: _colourScheme.gradientDark.b - colourGradient.b * groundedVal,
                };
                this.countryList.get("wa").fill = colour;
                this.countryList.get("wa").rootFill = colour;
            }
            this.setLabelValues(_yearAverages);
        }
        catch (error) {
            console.error(error);
        }
    }
    setLabelValues(_yearAverages) {
        if (this.labelList.has("en")) {
            let content = this.labelList.get("en").content;
            content
                .find("#canvas-label-text-rainfall")
                .text(_yearAverages.en.rainfall + "mm/yr");
            content
                .find("#canvas-label-text-sunshine")
                .text(_yearAverages.en.sunshine);
            content
                .find("#canvas-label-text-lowTemp")
                .text(_yearAverages.en.lowTemp + "°");
            content
                .find("#canvas-label-text-highTemp")
                .text(_yearAverages.en.highTemp + "°");
        }
        if (this.labelList.has("sc")) {
            let content = this.labelList.get("sc").content;
            content
                .find("#canvas-label-text-rainfall")
                .text(_yearAverages.sc.rainfall + "mm/yr");
            content
                .find("#canvas-label-text-sunshine")
                .text(_yearAverages.sc.sunshine);
            content
                .find("#canvas-label-text-lowTemp")
                .text(_yearAverages.sc.lowTemp + "°");
            content
                .find("#canvas-label-text-highTemp")
                .text(_yearAverages.sc.highTemp + "°");
        }
        if (this.labelList.has("wa")) {
            let content = this.labelList.get("wa").content;
            content
                .find("#canvas-label-text-rainfall")
                .text(_yearAverages.wa.rainfall + "mm/yr");
            content
                .find("#canvas-label-text-sunshine")
                .text(_yearAverages.wa.sunshine);
            content
                .find("#canvas-label-text-lowTemp")
                .text(_yearAverages.wa.lowTemp + "°");
            content
                .find("#canvas-label-text-highTemp")
                .text(_yearAverages.wa.highTemp + "°");
        }
        if (this.labelList.has("ni")) {
            let content = this.labelList.get("ni").content;
            content
                .find("#canvas-label-text-rainfall")
                .text(_yearAverages.ni.rainfall + "mm/yr");
            content
                .find("#canvas-label-text-sunshine")
                .text(_yearAverages.ni.sunshine);
            content
                .find("#canvas-label-text-lowTemp")
                .text(_yearAverages.ni.lowTemp + "°");
            content
                .find("#canvas-label-text-highTemp")
                .text(_yearAverages.ni.highTemp + "°");
        }
    }
    collectLabels(_list) {
        return _list.map((subList) => {
            return subList[subList.length - 1];
        });
    }
    collectData(_list) {
        return _list.map((subList) => {
            return subList[this.viewActive];
        });
    }
    setGraphYearAverages(_dataRange) {
        // console.log(_dataRange.en)
        let typeLabel;
        switch (this.viewActive) {
            case ViewTypes.rainfall:
                typeLabel = "Rainfall";
                break;
            case ViewTypes.sunshine:
                typeLabel = "Sunshine";
                break;
            case ViewTypes.lowTemp:
                typeLabel = "Lowest Temperature";
                break;
            case ViewTypes.highTemp:
                typeLabel = "Highest Temperature";
                break;
            default:
                typeLabel = "Unknown";
        }
        // CLEAN GRAPHS
        Object.entries(GRAPHIDS).forEach(([key, value]) => {
            let content = $(`#${value}`);
            content.empty();
            content.append(`
        <canvas id = "${key}"></canvas>
      `);
        });
        drawYearAverageGraph(document.getElementById('graph1'), this.collectLabels(_dataRange.en), this.collectData(_dataRange.en), `England ${typeLabel}`);
        drawYearAverageGraph(document.getElementById('graph2'), this.collectLabels(_dataRange.wa), this.collectData(_dataRange.wa), `Wales ${typeLabel}`);
        drawYearAverageGraph(document.getElementById('graph3'), this.collectLabels(_dataRange.sc), this.collectData(_dataRange.sc), `Scotland ${typeLabel}`);
        drawYearAverageGraph(document.getElementById('graph4'), this.collectLabels(_dataRange.ni), this.collectData(_dataRange.ni), `Northern Ireland ${typeLabel}`);
    }
    constructor(_objects, _labelContainer, _scaleFactorX, _scaleFactorY, _widthTranslation, _heightTranslation) {
        this.countryList = _objects.ctryList;
        this.staticObjectList = _objects.staticObjList;
        this.labelContainer = _labelContainer;
        this.labelList = new Map();
        this.lastActive = undefined;
        this.updateCanvasAttributes(_scaleFactorX, _scaleFactorY, _widthTranslation, _heightTranslation);
        // this.graphList = new Map();
        // Object.entries(GRAPHIDS).forEach(([key, value]) => {
        //   this.graphList.set(
        //     value,
        //     document.getElementById(value) as HTMLCanvasElement
        //   );
        // });
        // for (let [key, value] of this.graphList.entries()) {
        //   drawGraph(value);
        // }
        this.viewActive = ViewTypes.highTemp;
    }
}
//# sourceMappingURL=controller.js.map