import DrawableUtil from "../../utils/DrawableUtil";
import GeometryRectangle from "./GeometryRectangle";
import { Point, Rectangle, Size, TriangleDir } from "../structures";

class GeometryTriangle extends GeometryRectangle {
    private _myDir = TriangleDir.Up;

    pointArray: Point[] = [];

    constructor(name: string, x: number, y: number, width: number, height: number) {
        super(name, x, y, width, height);

        this.setLocation(new Point(x, y));
        this.setSize(new Size(width, height));
        this.initTriangle();
    }

    getDirection(): TriangleDir {
        return this._myDir;
    }

    setDirection(dir: TriangleDir) {
        this._myDir = dir;
        this.setTriangle(this._myDir);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawTriangle(ctx);
        this.isChanged = false;
    }

    private drawTriangle(ctx: CanvasRenderingContext2D): void {
        if (this.getCurrentSize().equal(Size.Empty())) return;
        if (this.pointArray.length < 2) return;

        const startPoint = this.pointArray[0];
        const matrix = ctx.getTransform();
        this.makeRotateTransform(ctx);
        this.setTriangle(this._myDir);
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);

        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);                    
        this.pointArray.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();

        if (this.attribute.isFill) {
            const origin = ctx.fillStyle;
            ctx.fillStyle = this.attribute.fillColor.toRGBA();
            ctx.fill();
            ctx.fillStyle = origin;
        }

        const origin = ctx.strokeStyle;
        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.stroke();
        ctx.strokeStyle = origin;

        this.rollBackTransform(ctx, matrix);
    }

    private initTriangle(): void {
        for (let index = 0; index < 3; index++) {
            this.pointArray.push(new Point(0, 0));
        }
    }

    private setTriangle(dir: TriangleDir): void {
        this.getPoints(dir);
    }

    private getPoints(dir: TriangleDir): Point[] {
        const bounds = this.getBounds();
        if (bounds.width > 0 && bounds.height > 0) {
            if (dir === TriangleDir.Up) {
                this.pointArray[0].x = bounds.x; this.pointArray[0].y = bounds.y + bounds.height;
                this.pointArray[1].x = bounds.x + bounds.width / 2; this.pointArray[1].y = bounds.y;
                this.pointArray[2].x = bounds.x + bounds.width; this.pointArray[2].y = bounds.y + bounds.height;
            } else if (dir === TriangleDir.Down) {
                this.pointArray[0].x = bounds.x; this.pointArray[0].y = bounds.y;
                this.pointArray[1].x = bounds.x + bounds.width; this.pointArray[1].y = bounds.y;
                this.pointArray[2].x = bounds.x + bounds.width / 2; this.pointArray[2].y = bounds.y + bounds.height;
            } else if (dir === TriangleDir.Left) {
                this.pointArray[0].x = bounds.x; this.pointArray[0].y = bounds.y + bounds.height / 2;
                this.pointArray[1].x = bounds.x + bounds.width;
                this.pointArray[1].y = bounds.y;
                this.pointArray[2].x = bounds.x + bounds.width;
                this.pointArray[2].y = bounds.y + bounds.height;
            } else if (dir === TriangleDir.Right) {
                this.pointArray[0].x = bounds.x; this.pointArray[0].y = bounds.y;
                this.pointArray[1].x = bounds.x + bounds.width;
                this.pointArray[1].y = bounds.y + bounds.height / 2;
                this.pointArray[2].x = bounds.x;
                this.pointArray[2].y = bounds.y + bounds.height;
            }
        }

        return this.pointArray;
    }

    pointInObject(point: Point): boolean {
        try {
            let pointArray = [];

            for (let i = 0; i < 3; i++) {
                pointArray[i] = new Point(this.pointArray[i].x, this.pointArray[i].y);
            }
            
            if (this.degree !== 0) {
                pointArray = DrawableUtil.transformPoints(pointArray, this.degree
                , this.rotationCenter);
            }

            if (DrawableUtil.isContainPoint(pointArray, point.x, point.y)) {
                return true;
            }
        } catch (error) {
            console.log(error);
        }

        return false;
    }

    intersectsWith(rect: Rectangle): boolean {
        try {
            const degree = this.getTotalDegree();
            let pointArray = [];

            for (let i = 0; i < 3; i++) {
                pointArray[i] = new Point(this.pointArray[i].x, this.pointArray[i].y);
            }
            
            if (this.degree !== 0) {
                pointArray = DrawableUtil.transformPoints(pointArray, this.degree
                , this.rotationCenter);
            }

            if (DrawableUtil.isContainRectangle(pointArray, rect)) {
                return true;
            }
        } catch (error) {
            console.log(error);
        }

        return false;
    }
}

export default GeometryTriangle;