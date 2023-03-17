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
var CountourObject = /** @class */ (function () {
    function CountourObject(_pts, _offsetX, _offsetY) {
        try {
            if (_pts.length <= 0)
                throw 404;
            this.originContourPoints = _pts;
            this.rootOffsetX = _offsetX;
            this.rootOffsetY = _offsetY;
        }
        catch (error) {
            console.log(error);
        }
    }
    CountourObject.prototype.scalePoints = function (_scaleFactor) {
        for (var it = 0; it < this.contourPoints.length; it++) {
            this.contourPoints[it][0] = this.contourPoints[it][0] * _scaleFactor;
            this.contourPoints[it][1] = this.contourPoints[it][1] * _scaleFactor;
        }
    };
    CountourObject.prototype.positionPoints = function (_scaleFactor) {
        for (var it = 0; it < this.contourPoints.length; it++) {
            this.contourPoints[it][0] = this.contourPoints[it][0] + (this.rootOffsetX * _scaleFactor);
            this.contourPoints[it][1] = this.contourPoints[it][1] + (this.rootOffsetY * _scaleFactor);
        }
    };
    return CountourObject;
}());
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
        // Javascript Deepcopy moment.
        _this.contourPoints = JSON.parse(JSON.stringify(_this.originContourPoints));
        return _this;
    }
    Country.prototype.scaleObject = function (_scaleFactor) {
        this.contourPoints = JSON.parse(JSON.stringify(this.originContourPoints));
        this.scalePoints(_scaleFactor);
        this.setBoundaryPoints(_scaleFactor);
    };
    Country.prototype.positionObject = function (_scaleFactor) {
        this.positionPoints(_scaleFactor);
    };
    Country.prototype.setBoundaryPoints = function (_scaleFactor) {
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
    return Country;
}(CountourObject));
export { Country };
//# sourceMappingURL=types.js.map