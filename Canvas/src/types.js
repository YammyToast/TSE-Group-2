import { COLOURSLIGHT, createLabel } from "./config.js";
// Implementation of https://stackoverflow.com/a/5624139
// export function RGBFromHex(_hex: string): RGB | null {
//     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hex);
//     return result ? {
//       r: parseInt(result[1], 16),
//       g: parseInt(result[2], 16),
//       b: parseInt(result[3], 16)
//     } : null;
// }
export class Manager {
    constructor(_controller) {
        this.controller = _controller;
        this.controller.managerChangeCallback = this.contextChangeCallback;
    }
    contextChangeCallback(_active) {
        console.log(_active);
    }
}
export class Controller {
    activeChangeCallback(_active) {
        if (_active == this.lastActive)
            return;
        this.lastActive = _active;
        // pass message to manager.
        this.managerChangeCallback(_active);
    }
    handleHoverAnimations(_ctry) {
        let shade = 12;
        if (_ctry.hover == true && _ctry.active == false) {
            if (_ctry.animationMap.has('hoverReverse')) {
                // shade = shade - Math.abs(_ctry.animationMap.get('hoverReverse').endAnimation());
                _ctry.animationMap.delete('hoverReverse');
            }
            // console.log(shade)
            if (!_ctry.animationMap.has('hover')) {
                let startFill = {
                    r: _ctry.rootFill.r - shade,
                    g: _ctry.rootFill.g - shade,
                    b: _ctry.rootFill.b - shade
                };
                let animation = new HoverAnimation(_ctry, 'hover', 255, startFill, shade);
                _ctry.animationMap.set('hover', animation);
            }
        }
        else {
            if (_ctry.animationMap.has('hover')) {
                shade = -_ctry.animationMap.get('hover').endAnimation();
                _ctry.animationMap.delete('hover');
                if (!_ctry.animationMap.has('hoverReverse')) {
                    let startFill = {
                        r: _ctry.rootFill.r + shade,
                        g: _ctry.rootFill.g + shade,
                        b: _ctry.rootFill.b + shade
                    };
                    let animation = new HoverAnimation(_ctry, 'hoverReverse', 255, startFill, shade);
                    _ctry.animationMap.set('hoverReverse', animation);
                }
            }
        }
    }
    checkLabelOwnerExists(_labelName) {
        for (let key of this.countryList.keys()) {
            if (_labelName == key)
                return true;
        }
        return false;
    }
    setupLabels(_labelConfig) {
        for (let config in Object.entries(_labelConfig)) {
            let info = Object.values(_labelConfig)[config];
            if (!this.checkLabelOwnerExists(info.owner))
                continue;
            let element = createLabel(COLOURSLIGHT);
            let country = this.countryList.get(info.owner);
            element.find('#canvas-label-title').text(info.title);
            let label = {
                content: element,
                offsetX: info.offset[0],
                offsetY: info.offset[1]
            };
            label.content.on('mouseenter', (e) => {
                country.hoverLock = true;
                country.hover = true;
                this.handleHoverAnimations(country);
            });
            label.content.on('mouseleave', (e) => {
                country.hoverLock = false;
            });
            label.content.on('click', (e) => {
                country.active = true;
            });
            this.labelList.set(info.owner, label);
        }
    }
    updateCanvasAttributes(_scaleFactorX, _scaleFactorY) {
        this.canvasScaleFactorX = _scaleFactorX;
        this.canvasScaleFactorY = _scaleFactorY;
    }
    positionLabels() {
        for (let [key, label] of this.labelList.entries()) {
            if (!this.checkLabelOwnerExists(key))
                continue;
            label.content.css({
                "top": (this.labelContainer.innerHeight() * 0.7) + (label.offsetY * this.canvasScaleFactorY),
                "left": (this.labelContainer.innerWidth() * 0.65) + (label.offsetX * this.canvasScaleFactorX)
            });
        }
    }
    renderLabels() {
        this.labelContainer.empty();
        this.labelList.forEach((obj, key) => {
            obj.content.appendTo(this.labelContainer);
        });
    }
    constructor(_objects, _labelContainer, _canvasHeightTranslation, _canvasWidthTranslation, _canvasScaleFactorX, _canvasScaleFactorY) {
        this.countryList = _objects.ctryList;
        this.staticObjectList = _objects.staticObjList;
        this.labelContainer = _labelContainer;
        this.lastActive = undefined;
        this.labelList = new Map();
        this.canvasHeightTranslation = _canvasHeightTranslation;
        this.canvasWidthTranslation = _canvasWidthTranslation;
        this.updateCanvasAttributes(_canvasScaleFactorX, _canvasScaleFactorY);
    }
}
/**
 * Class for creating static shapes from contours. Contours are a set of points linked together through a line/stroke that form a full path/image.
 */
export class ContourObject {
    /**
     * Initializing a Contour-based Object.
     * @param _pts
     * @param _offsetX
     * @param _offsetY
     */
    constructor(_pts, _offsetX, _offsetY) {
        try {
            if (_pts.length <= 0)
                throw 404;
            this.originContourPoints = _pts;
            this.rootOffsetX = _offsetX;
            this.rootOffsetY = _offsetY;
            // Javascript Deepcopy moment.
            this.contourPoints = JSON.parse(JSON.stringify(this.originContourPoints));
            this.animationMap = new Map();
        }
        catch (error) {
            console.log(error);
        }
    }
    scalePoints(_scaleFactorX, _scaleFactorY) {
        for (let it = 0; it < this.contourPoints.length; it++) {
            this.contourPoints[it][0] = this.contourPoints[it][0] * _scaleFactorX;
            this.contourPoints[it][1] = this.contourPoints[it][1] * _scaleFactorY;
        }
    }
    positionPoints(_scaleFactorX, _scaleFactorY, _heightTranslation, _widthTranslation) {
        for (let it = 0; it < this.contourPoints.length; it++) {
            this.contourPoints[it][0] = this.contourPoints[it][0] + (this.rootOffsetX * _scaleFactorX) + (_widthTranslation);
            this.contourPoints[it][1] = this.contourPoints[it][1] + (this.rootOffsetY * _scaleFactorY) + (_heightTranslation);
        }
    }
}
export class Country extends ContourObject {
    constructor(_Obj, _offsetX, _offSetY) {
        super(_Obj.points, _offsetX, _offSetY);
        /**
         * Stores the highest value that any coordinate reaches on a boundary.
         * Calculated post-scaling, but are not relative to screen position.
         * Calculated each time there is a context change.
         * TopLeft-X, TopLeft-Y, BottomRight-X, BottomRight-Y
         */
        this.boundaryPoints = [0, 0, 0, 0];
        /**
         * Stores the contextualized values of the boundaryPoints.
         * Calculated post scaling, and point values are absolute coordinates on the canvas.
         * Calculated each time there is a context change.
         */
        this.detectPoints = [0, 0, 0, 0];
        this.hover = false;
    }
    scaleObject(_scaleFactorX, _scaleFactorY) {
        this.contourPoints = JSON.parse(JSON.stringify(this.originContourPoints));
        this.scalePoints(_scaleFactorX, _scaleFactorY);
        this.setBoundaryPoints();
    }
    positionObject(_scaleFactorX, _scaleFactorY, _heightTranslation, _widthTranslation) {
        this.positionPoints(_scaleFactorX, _scaleFactorY, _heightTranslation, _widthTranslation);
        this.detectPoints[0] = _widthTranslation + this.boundaryPoints[0] + (_scaleFactorX * this.rootOffsetX);
        this.detectPoints[1] = _heightTranslation + this.boundaryPoints[1] + (_scaleFactorY * this.rootOffsetY);
        this.detectPoints[2] = _widthTranslation + this.boundaryPoints[2] + (_scaleFactorX * this.rootOffsetX);
        this.detectPoints[3] = _heightTranslation + this.boundaryPoints[3] + (_scaleFactorY * this.rootOffsetY);
    }
    setBoundaryPoints() {
        let points = this.contourPoints;
        for (let it = 0; it < points.length; it++) {
            if (points[it][0] < this.boundaryPoints[0])
                this.boundaryPoints[0] = points[it][0];
            if (points[it][1] < this.boundaryPoints[1])
                this.boundaryPoints[1] = points[it][1];
            if (points[it][0] > this.boundaryPoints[2])
                this.boundaryPoints[2] = points[it][0];
            if (points[it][1] > this.boundaryPoints[3])
                this.boundaryPoints[3] = points[it][1];
        }
    }
    angle2D(_x1, _y1, _x2, _y2) {
        let dtheta, theta1, theta2;
        theta1 = Math.atan2(_y1, _x1);
        theta2 = Math.atan2(_y2, _x2);
        dtheta = theta2 - theta1;
        while (dtheta > Math.PI) {
            dtheta -= 2 * Math.PI;
        }
        while (dtheta < -Math.PI) {
            dtheta += 2 * Math.PI;
        }
        return (dtheta);
    }
    //https://www.eecs.umich.edu/courses/eecs380/HANDOUTS/PROJ2/InsidePoly.html
    // IMPLEMENTATION OF ALGORITHM 2
    detectInside(_mouse) {
        if (((_mouse[0] >= this.detectPoints[0]) &&
            (_mouse[0] <= this.detectPoints[2]) &&
            (_mouse[1] >= this.detectPoints[1]) &&
            (_mouse[1] <= this.detectPoints[3]) == false)) {
            return false;
        }
        ;
        let angle = 0;
        let polygon = this.contourPoints;
        for (let i = 0; i < polygon.length - 1; i++) {
            let p1 = [polygon[i][0] - _mouse[0], polygon[i][1] - _mouse[1]];
            let p2 = [polygon[(i + 1) % polygon.length][0] - _mouse[0], polygon[(i + 1) % polygon.length][1] - _mouse[1]];
            angle += this.angle2D(p1[0], p1[1], p2[0], p2[1]);
        }
        if (Math.abs(angle) < Math.PI) {
            return false;
        }
        else {
            return true;
        }
    }
    processAnimations() {
        this.animationMap.forEach((animation, key) => {
            animation.processAnimation();
        });
    }
}
class Animation {
    getFramePercentage() {
        let timestamp = Date.now();
        return ((timestamp - this.startTime) / this.duration);
    }
    constructor(_country, _animationName, _duration) {
        this.country = _country;
        this.name = _animationName;
        this.startTime = Date.now();
        this.endTime = Date.now() + _duration;
        this.duration = this.endTime - this.startTime;
    }
}
export class HoverAnimation extends Animation {
    endAnimation() {
        // this.country.fill = this.startColour;
        let framePercentage = this.getFramePercentage();
        if (framePercentage >= 1)
            framePercentage = 1;
        return Math.floor(this.shadeStrength * framePercentage);
    }
    processAnimation() {
        let framePercentage = this.getFramePercentage();
        if (framePercentage >= 1) {
            return;
        }
        ;
        let frameShade = Math.floor(this.shadeStrength * framePercentage);
        this.country.fill = {
            r: this.startColour.r - frameShade,
            g: this.startColour.g - frameShade,
            b: this.startColour.b - frameShade
        };
        return;
    }
    constructor(_country, _animationName, _duration, _startColour, _shadeStrength) {
        super(_country, _animationName, _duration);
        this.startColour = _startColour;
        this.shadeStrength = _shadeStrength;
    }
}
//# sourceMappingURL=types.js.map