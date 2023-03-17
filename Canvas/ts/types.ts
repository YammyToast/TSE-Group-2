export interface ObjPaths {
    enContours: string,
    scContours: string,
    waContours: string,
    niContours: string
}

export interface CtryOffsets {
    en: number[],
    sc: number[],
    wa: number[],
    ni: number[]
}

class CountourObject {
    originContourPoints: number[][];
    contourPoints: number[][];
    rootOffsetX: number;
    rootOffsetY: number;

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

    positionPoints(_scaleFactor: number) {
        for(let it = 0; it < this.contourPoints.length; it++) {
            this.contourPoints[it][0] = this.contourPoints[it][0] + (this.rootOffsetX * _scaleFactor);
            this.contourPoints[it][1] = this.contourPoints[it][1] + (this.rootOffsetY * _scaleFactor);
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


    constructor(_Obj: any, _offsetX: number, _offSetY: number) {
        super(_Obj.points, _offsetX, _offSetY)
        // Javascript Deepcopy moment.
        this.contourPoints = JSON.parse(JSON.stringify(this.originContourPoints));
    }

    scaleObject(_scaleFactor: number): void {
        this.contourPoints = JSON.parse(JSON.stringify(this.originContourPoints));
        this.scalePoints(_scaleFactor)
        this.setBoundaryPoints(_scaleFactor)
    }

    positionObject(_scaleFactor: number): void {
        this.positionPoints(_scaleFactor)
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

}