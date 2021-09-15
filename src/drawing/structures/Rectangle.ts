import { Point, Size } from ".";

class Rectangle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    static empty(): Rectangle {
        return new Rectangle(0, 0, 0, 0);
    }

    constructor (x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public getLocation(): Point {
        return new Point(this.x, this.y);
    }

    public getSize(): Size {
        return new Size(this.width, this.height);
    }

    public right(): number {
        return this.x + this.width;
    }

    public bottom(): number {
        return this.y + this.height;
    }

    public intersectsWith(bound: Rectangle): boolean {
        if (((bound.x + bound.width > this.x && bound.x + bound.width < this.x + this.width)
            || (bound.x > this.x && bound.x < this.x + this.width))
            && ((bound.y + bound.height > this.y && bound.y + bound.height < this.y + this.height)
            || (bound.y > this.y && bound.y < this.y + this.height))) {
            return true;
        }

        return false;
    }

    public containsPoint(point: Point): boolean {
        if (this.x - 3 > point.x || this.x + this.width - 3< point.x
            || this.y - 3 > point.y || this.y + this.height - 3 < point.y) {
            return false;
        }

        return true;
    }

    public containsRectangle(rectangle: Rectangle): boolean {
        if (this.x > rectangle.x + rectangle.width || this.x + this.width < rectangle.x
            || this.y > rectangle.y + rectangle.height || this.y + this.height < rectangle.y) {
            return false;
        }

        return true;
    }

    public equal(bound: Rectangle): boolean {
        if (this.x === bound.x && this.y === bound.y && this.width === bound.width && this.height === bound.height) {
            return true;
        }

        return false;
    }

    public inflate(size: Size): Rectangle {
        return new Rectangle(this.x, this.y, this.width + size.width, this.height + size.height);
    }

    public static union(rec1: Rectangle, rec2: Rectangle): Rectangle {
        if (rec1.x > rec2.x) rec1.x = rec2.x;
        if (rec1.y > rec2.y) rec1.y = rec2.y;
        if (rec1.x + rec1.width < rec2.x + rec2.width) rec1.width = rec2.x + rec2.width - rec1.x;
        if (rec1.y + rec1.height < rec2.y + rec2.height) rec1.height = rec2.y + rec2.height - rec1.y;

        return rec1;
    }
}

export default Rectangle;