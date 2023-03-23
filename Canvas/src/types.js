var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Implementation of https://stackoverflow.com/a/5624139
export function RGBFromHex(_hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hex);
    console.log(result);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
var Controller = /** @class */ (function () {
    function Controller(_ctryList, _stObjList) {
        this.CountryList = _ctryList;
        this.StaticObjectList = _stObjList;
    }
    return Controller;
}());
export { Controller };
/**
 * Class for creating static shapes from contours. Contours are a set of points linked together through a line/stroke that form a full path/image.
 */
var ContourObject = /** @class */ (function () {
    /**
     * Initializing a Contour-based Object.
     * @param _pts
     * @param _offsetX
     * @param _offsetY
     */
    function ContourObject(_pts, _offsetX, _offsetY) {
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
    ContourObject.prototype.scalePoints = function (_scaleFactorX, _scaleFactorY) {
        for (var it = 0; it < this.contourPoints.length; it++) {
            this.contourPoints[it][0] = this.contourPoints[it][0] * _scaleFactorX;
            this.contourPoints[it][1] = this.contourPoints[it][1] * _scaleFactorY;
        }
    };
    ContourObject.prototype.positionPoints = function (_scaleFactorX, _scaleFactorY, _heightTranslation, _widthTranslation) {
        for (var it = 0; it < this.contourPoints.length; it++) {
            this.contourPoints[it][0] = this.contourPoints[it][0] + (this.rootOffsetX * _scaleFactorX) + (_widthTranslation);
            this.contourPoints[it][1] = this.contourPoints[it][1] + (this.rootOffsetY * _scaleFactorY) + (_heightTranslation);
        }
    };
    return ContourObject;
}());
export { ContourObject };
var Country = /** @class */ (function (_super) {
    __extends(Country, _super);
    function Country(_Obj, _offsetX, _offSetY) {
        var _this = _super.call(this, _Obj.points, _offsetX, _offSetY) || this;
        /**
         * Stores the highest value that any coordinate reaches on a boundary.
         * Calculated post-scaling, but are not relative to screen position.
         * Calculated each time there is a context change.
         * TopLeft-X, TopLeft-Y, BottomRight-X, BottomRight-Y
         */
        _this.boundaryPoints = [0, 0, 0, 0];
        /**
         * Stores the contextualized values of the boundaryPoints.
         * Calculated post scaling, and point values are absolute coordinates on the canvas.
         * Calculated each time there is a context change.
         */
        _this.detectPoints = [0, 0, 0, 0];
        _this.hover = false;
        return _this;
    }
    Country.prototype.scaleObject = function (_scaleFactorX, _scaleFactorY) {
        this.contourPoints = JSON.parse(JSON.stringify(this.originContourPoints));
        this.scalePoints(_scaleFactorX, _scaleFactorY);
        this.setBoundaryPoints();
    };
    Country.prototype.positionObject = function (_scaleFactorX, _scaleFactorY, _heightTranslation, _widthTranslation) {
        this.positionPoints(_scaleFactorX, _scaleFactorY, _heightTranslation, _widthTranslation);
        this.detectPoints[0] = _widthTranslation + this.boundaryPoints[0] + (_scaleFactorX * this.rootOffsetX);
        this.detectPoints[1] = _heightTranslation + this.boundaryPoints[1] + (_scaleFactorY * this.rootOffsetY);
        this.detectPoints[2] = _widthTranslation + this.boundaryPoints[2] + (_scaleFactorX * this.rootOffsetX);
        this.detectPoints[3] = _heightTranslation + this.boundaryPoints[3] + (_scaleFactorY * this.rootOffsetY);
    };
    Country.prototype.setBoundaryPoints = function () {
        var points = this.contourPoints;
        for (var it = 0; it < points.length; it++) {
            if (points[it][0] < this.boundaryPoints[0])
                this.boundaryPoints[0] = points[it][0];
            if (points[it][1] < this.boundaryPoints[1])
                this.boundaryPoints[1] = points[it][1];
            if (points[it][0] > this.boundaryPoints[2])
                this.boundaryPoints[2] = points[it][0];
            if (points[it][1] > this.boundaryPoints[3])
                this.boundaryPoints[3] = points[it][1];
        }
    };
    Country.prototype.angle2D = function (_x1, _y1, _x2, _y2) {
        var dtheta, theta1, theta2;
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
    };
    //https://www.eecs.umich.edu/courses/eecs380/HANDOUTS/PROJ2/InsidePoly.html
    // IMPLEMENTATION OF ALGORITHM 2
    Country.prototype.detectInside = function (_mouse) {
        if (((_mouse[0] >= this.detectPoints[0]) &&
            (_mouse[0] <= this.detectPoints[2]) &&
            (_mouse[1] >= this.detectPoints[1]) &&
            (_mouse[1] <= this.detectPoints[3]) == false)) {
            return false;
        }
        ;
        var angle = 0;
        var polygon = this.contourPoints;
        for (var i = 0; i < polygon.length - 1; i++) {
            var p1 = [polygon[i][0] - _mouse[0], polygon[i][1] - _mouse[1]];
            var p2 = [polygon[(i + 1) % polygon.length][0] - _mouse[0], polygon[(i + 1) % polygon.length][1] - _mouse[1]];
            angle += this.angle2D(p1[0], p1[1], p2[0], p2[1]);
        }
        if (Math.abs(angle) < Math.PI) {
            return false;
        }
        else {
            return true;
        }
    };
    Country.prototype.processAnimations = function () {
        this.animationMap.forEach(function (animation, key) {
            animation.processAnimation();
        });
    };
    return Country;
}(ContourObject));
export { Country };
var Animation = /** @class */ (function () {
    function Animation(_country, _animationName, _duration) {
        this.country = _country;
        this.name = _animationName;
        this.startTime = Date.now();
        this.endTime = Date.now() + _duration;
        this.duration = this.endTime - this.startTime;
    }
    Animation.prototype.getFramePercentage = function () {
        var timestamp = Date.now();
        return ((timestamp - this.startTime) / this.duration);
    };
    return Animation;
}());
var HoverAnimation = /** @class */ (function (_super) {
    __extends(HoverAnimation, _super);
    function HoverAnimation(_country, _animationName, _duration, _startColour, _shadeStrength) {
        var _this = _super.call(this, _country, _animationName, _duration) || this;
        _this.startColour = _startColour;
        _this.shadeStrength = _shadeStrength;
        return _this;
    }
    HoverAnimation.prototype.endAnimation = function () {
        // this.country.fill = this.startColour;
        var framePercentage = this.getFramePercentage();
        if (framePercentage >= 1)
            framePercentage = 1;
        return Math.floor(this.shadeStrength * framePercentage);
    };
    HoverAnimation.prototype.processAnimation = function () {
        var framePercentage = this.getFramePercentage();
        if (framePercentage >= 1) {
            return;
        }
        ;
        var frameShade = Math.floor(this.shadeStrength * framePercentage);
        this.country.fill = {
            r: this.startColour.r - frameShade,
            g: this.startColour.g - frameShade,
            b: this.startColour.b - frameShade
        };
        return;
    };
    return HoverAnimation;
}(Animation));
export { HoverAnimation };
//# sourceMappingURL=types.js.map