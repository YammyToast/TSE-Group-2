

/**
 * Typedef for the set of required file-paths for rendered objects.
 */
export interface ObjPaths {
    readonly enContours: string,
    readonly scContours: string,
    readonly waContours: string,
    readonly niContours: string
}

/**
 * Typedef for the set of offsets used on each object during rendering.
 */
export interface CtryOffsets {
    en: number[],
    sc: number[],
    wa: number[],
    ni: number[]
}

export interface ColourScheme {
    background: RGB,
    stroke: RGB,
    gradientDark: RGB,
    gradientLight: RGB,
    gradientNull: RGB
}

// Implementation of https://stackoverflow.com/a/5624139
export function RGBFromHex(_hex: string): RGB | null {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(_hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

type RGB = {
    r: number,
    g: number,
    b: number
}

/**
 * Class for creating static shapes from contours. Contours are a set of points linked together through a line/stroke that form a full path/image.
 */
class CountourObject {
    originContourPoints: number[][];
    contourPoints: number[][];
    rootOffsetX: number;
    rootOffsetY: number;
    fill: RGB;
    stroke: RGB;

    /**
     * Initializing a Contour-based Object.
     * @param _pts 
     * @param _offsetX 
     * @param _offsetY 
     */
    constructor(_pts: number[][], _offsetX: number, _offsetY: number) {
        try {
            if(_pts.length <= 0) throw 404;
            this.originContourPoints = _pts;
            this.rootOffsetX = _offsetX;
            this.rootOffsetY = _offsetY;
        }
        catch(error) {
            console.log(error);
        }
    }

    scalePoints(_scaleFactor: number) {
        for(let it = 0; it < this.contourPoints.length; it++) {
            this.contourPoints[it][0] = this.contourPoints[it][0] * _scaleFactor;
            this.contourPoints[it][1] = this.contourPoints[it][1] * _scaleFactor;
        }
    }

    positionPoints(_scaleFactor: number, _heightTranslation: number, _widthTranslation: number) {
        for(let it = 0; it < this.contourPoints.length; it++) {
            this.contourPoints[it][0] = this.contourPoints[it][0] + (this.rootOffsetX * _scaleFactor) + (_widthTranslation);
            this.contourPoints[it][1] = this.contourPoints[it][1] + (this.rootOffsetY * _scaleFactor) + (_heightTranslation);
        }

    }

}

export class Country extends CountourObject {
    /**
     * Stores the highest value that any coordinate reaches on a boundary. 
     * Calculated post-scaling, but are not relative to screen position.
     * Calculated each time there is a context change.
     * TopLeft-X, TopLeft-Y, BottomRight-X, BottomRight-Y
     */
    boundaryPoints: number[] = [0,0,0,0];
    /**
     * Stores the contextualized values of the boundaryPoints.
     * Calculated post scaling, and point values are absolute coordinates on the canvas.
     * Calculated each time there is a context change.
     */
    detectPoints: number[] = [0,0,0,0];
    active: boolean;

    constructor(_Obj: any, _offsetX: number, _offSetY: number) {
        super(_Obj.points, _offsetX, _offSetY)
        // Javascript Deepcopy moment.
        this.contourPoints = JSON.parse(JSON.stringify(this.originContourPoints));
        this.active = false;
    }

    scaleObject(_scaleFactor: number): void {
        this.contourPoints = JSON.parse(JSON.stringify(this.originContourPoints));
        this.scalePoints(_scaleFactor)
        this.setBoundaryPoints(_scaleFactor)
    }

    positionObject(_scaleFactor: number, _heightTranslation: number, _widthTranslation: number): void {
        this.positionPoints(_scaleFactor, _heightTranslation, _widthTranslation)

        this.detectPoints[0] = _widthTranslation + this.boundaryPoints[0] + (_scaleFactor * this.rootOffsetX)
        this.detectPoints[1] = _heightTranslation + this.boundaryPoints[1] + (_scaleFactor * this.rootOffsetY)
        this.detectPoints[2] = _widthTranslation + this.boundaryPoints[2] + (_scaleFactor * this.rootOffsetX)
        this.detectPoints[3] = _heightTranslation + this.boundaryPoints[3] + (_scaleFactor * this.rootOffsetY)
    }

    setBoundaryPoints(_scaleFactor: number): void {
        let points: number[][] = this.contourPoints;
        for(let it = 0; it < points.length; it++) {
            if(points[it][0] < this.boundaryPoints[0]) this.boundaryPoints[0] = points[it][0]
            if(points[it][1] < this.boundaryPoints[1]) this.boundaryPoints[1] = points[it][1]
            if(points[it][0] > this.boundaryPoints[2]) this.boundaryPoints[2] = points[it][0]
            if(points[it][1] > this.boundaryPoints[3]) this.boundaryPoints[3] = points[it][1]
        }
    }


    angle2D(_x1: number, _y1: number, _x2: number, _y2: number): number {
        let dtheta, theta1, theta2;
        
        theta1 = Math.atan2(_y1, _x1);
        theta2 = Math.atan2(_y2, _x2);
        dtheta = theta2 - theta1;
        while (dtheta > Math.PI) {
            dtheta -= 2 * Math.PI;
        }
        while (dtheta < - Math.PI) {
            dtheta += 2 * Math.PI;
        }
        
        return (dtheta);
    }
    
    //https://www.eecs.umich.edu/courses/eecs380/HANDOUTS/PROJ2/InsidePoly.html
    // IMPLEMENTATION OF ALGORITHM 2
    detectInside(_mouse: number[]) {
        if (
            ((_mouse[0] >= this.detectPoints[0]) &&
            (_mouse[0] <= this.detectPoints[2]) &&
            (_mouse[1] >= this.detectPoints[1]) &&
            (_mouse[1] <= this.detectPoints[3]) == false)
        ) {this.active = false; console.log("swag"); return};

        let angle: number = 0;
        let polygon = this.contourPoints;

        for (let i = 0; i < polygon.length - 1; i++) {
            let p1: number[] = [polygon[i][0] - _mouse[0], polygon[i][1] - _mouse[1]];
            let p2: number[] = [polygon[(i+1)%polygon.length][0] - _mouse[0], polygon[(i+1)%polygon.length][1] - _mouse[1]];
            angle += this.angle2D(p1[0], p1[1], p2[0], p2[1]);
        }

        if (Math.abs(angle) < Math.PI) {
            this.active = false;
            return;
        } else {
            this.active = true;
            return;
        }
    }

}