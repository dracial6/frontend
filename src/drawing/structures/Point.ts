class Point {
    public x: number;
    public y: number;

    static empty(): Point {
        return new Point(0, 0);
    }

    static isEmpty(point: Point): boolean {
        return point.x === 0 && point.y === 0;
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static truncate(point: Point): Point {
        return new Point(Math.trunc(point.x), Math.trunc(point.y));
    }

    public equal(point: Point): boolean {
        if (this.x === point.x && this.y === point.y) {
            return true;
        }

        return false;
    }
}

export default Point;