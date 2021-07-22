import DrawableUtil from "../../utils/DrawableUtil";
import BaseDraw from "./BaseDraw";
import { Point, Rectangle, Size, TriangleDir } from "../structures";

class DrawTriangle extends BaseDraw {
    private _myDir = TriangleDir.Up;

    pointArray: Point[] = [];

    constructor(name: string, x: number, y: number, width: number, height: number) {
        super(name);

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
        this.setTriangle(this._myDir);
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);

        if (this.degree !== 0) {
            this.rotate(ctx);
        }

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
        ctx.setTransform(matrix);
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
        const bounds = this.getMBR();
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
}

export default DrawTriangle;