import DrawableUtil from "../../utils/DrawableUtil";
import BaseDraw from "./BaseDraw";
import { LineAlignment, Point, Rectangle, Size, TriangleDir } from "../structures";

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
        if (Size.isEmpty(this.getCurrentSize())) return;
        if (this.pointArray.length < 2) return;

        const matrix = ctx.getTransform();
        this.setTriangle(this._myDir);
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);

        if (this.degree !== 0) {
            this.rotate(ctx);
        }

        if (this.attribute.lineAlign !== LineAlignment.Outset) {
            ctx.lineWidth = this.attribute.lineThick;
        } else {
            ctx.lineWidth = this.attribute.lineThick * 2;
        }

        const insetGap = (this.attribute.lineAlign === LineAlignment.Inset && this.attribute.lineThick > 1) ? this.attribute.lineThick / 4 : 0;
        
        if (this.attribute.radiusEdge) {
            ctx.lineJoin = "round";
        }

        const middleCenter = new Point(this.getCurrentLocation().x + this.getSize().width / 2, this.getCurrentLocation().y + this.getSize().height / 2);

        const point = this.pointArray[0];
        let startX = point.x;
        let startY = point.y;
        if (point.x > middleCenter.x) {
            startX = point.x - insetGap;
        } else if (point.x < middleCenter.x) {
            startX = point.x + insetGap;
        }

        if (point.y > middleCenter.y) {
            startY = point.y - insetGap;
        } else if (point.y < middleCenter.y) {
            startY = point.y + insetGap;
        }

        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.beginPath();
        ctx.moveTo(startX, startY);                    
        this.pointArray.forEach((point) => {
            let x = point.x;
            let y = point.y;

            if (point.x > middleCenter.x) {
                x = point.x - insetGap;
            } else if (point.x < middleCenter.x) {
                x = point.x + insetGap;
            }

            if (point.y > middleCenter.y) {
                y = point.y - insetGap;
            } else if (point.y < middleCenter.y) {
                y = point.y + insetGap;
            }
            
            ctx.lineTo(x, y);
        });
        ctx.closePath();

        if (this.attribute.lineAlign !== LineAlignment.Outset) {
            ctx.globalCompositeOperation = "source-over";
            if (this.attribute.isFill) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fill();
            }
        }

        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.stroke();

        if (this.attribute.lineAlign === LineAlignment.Outset) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.fill();

            ctx.globalCompositeOperation = "source-over";
            if (this.attribute.isFill) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fill();
            }
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.setTransform(matrix);
        ctx.lineJoin = "miter";
        ctx.lineWidth = 1;
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