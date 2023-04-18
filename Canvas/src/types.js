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