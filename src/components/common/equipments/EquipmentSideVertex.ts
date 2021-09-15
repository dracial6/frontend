import { Point, Rectangle } from "../../../drawing/structures";

class EquipmentSideVertex {
    getTCVertex(width: number, height: number, legWidth: number, headHeight: number) : Point[] {
        return this.getTCAndSCAnVertex(width, height, legWidth, headHeight);
    }

    getTCLeftLegStartPos(width: number, height: number, legWidth: number, headHeight: number) : Point {
        return this.getTCAndSCLeftLegStartPos(width, height, legWidth, headHeight);
    }

    getTCRightLegStartPos(width: number, height: number, legWidth: number, headHeight: number) : Point {
        return this.getTCAndSCRightLegStartPos(width, height, legWidth, headHeight);
    }

    getSCVertex(width: number, height: number, legWidth: number, headHeight: number) : Point[] {
        return this.getTCAndSCAnVertex(width, height, legWidth, headHeight);
    }

    getSCLeftLegStartPos(width: number, height: number, legWidth: number, headHeight: number) : Point {
        return this.getTCAndSCLeftLegStartPos(width, height, legWidth, headHeight);
    }

    getSCRightLegStartPos(width: number, height: number, legWidth: number, headHeight: number) : Point {
        return this.getTCAndSCRightLegStartPos(width, height, legWidth, headHeight);
    }

    private getTCAndSCLeftLegStartPos(width: number, height: number, legWidth: number, headHeight: number) : Point {
        const boundary = new Rectangle(0, 0, width, height);
        return new Point(boundary.x, boundary.y + boundary.height);
    }

    private getTCAndSCRightLegStartPos(width: number, height: number, legWidth: number, headHeight: number) : Point {
        const boundary = new Rectangle(0, 0, width, height);
        return new Point(boundary.x + boundary.width - legWidth, boundary.y + boundary.height);
    }

    private getTCAndSCAnVertex(width: number, height: number, legWidth: number, headHeight: number) : Point[] {
        const pointList: Point[] = [];
        const boundary = new Rectangle(0, 0, width, height);
        pointList.push(new Point(boundary.x, boundary.y));
        pointList.push(new Point(boundary.x, boundary.y + boundary.height));
        pointList.push(new Point(boundary.x + legWidth, boundary.y + boundary.height));
        pointList.push(new Point(boundary.x + legWidth, boundary.y + headHeight));
        pointList.push(new Point(boundary.x + boundary.width - legWidth, boundary.y + headHeight));
        pointList.push(new Point(boundary.x + boundary.width - legWidth, boundary.y + boundary.height));
        pointList.push(new Point(boundary.x + boundary.width, boundary.y + boundary.height));
        pointList.push(new Point(boundary.x + boundary.width, boundary.y));
        pointList.push(new Point(boundary.x, boundary.y));
        return pointList;
    }

    getOtherLeftLegStartPos(width: number, height: number) : Point {
        const boundary = new Rectangle(0, 0, width, height);
        return new Point(boundary.x, boundary.y + boundary.height);
    }

    getOtherRightLegStartPos(width: number, height: number, legWidth: number) : Point {
        const boundary = new Rectangle(0, 0, width, height);
        return new Point(boundary.x + boundary.width - legWidth, boundary.y + boundary.height);
    }

    getOtherVertex(width: number, height: number, legWidth: number, blankHeight: number) : Point[] {
        const pointList: Point[] = [];
        const boundary = new Rectangle(0, 0, width, height);
        pointList.push(new Point(boundary.x, boundary.y));
        pointList.push(new Point(boundary.x, boundary.y + boundary.height));
        pointList.push(new Point(boundary.x + legWidth, boundary.y + boundary.height));
        pointList.push(new Point(boundary.x + legWidth, boundary.y + boundary.height - blankHeight));
        pointList.push(new Point(boundary.x + boundary.width - legWidth, boundary.y + boundary.height - blankHeight));
        pointList.push(new Point(boundary.x + boundary.width - legWidth, boundary.y + boundary.height));
        pointList.push(new Point(boundary.x + boundary.width, boundary.y + boundary.height));
        pointList.push(new Point(boundary.x + boundary.width, boundary.y));
        pointList.push(new Point(boundary.x + boundary.width - legWidth, boundary.y));
        pointList.push(new Point(boundary.x + boundary.width - legWidth, boundary.y + blankHeight));
        pointList.push(new Point(boundary.x + legWidth, boundary.y + blankHeight));
        pointList.push(new Point(boundary.x + legWidth, boundary.y));
        pointList.push(new Point(boundary.x, boundary.y));
        return pointList;
    }
}

export default EquipmentSideVertex;