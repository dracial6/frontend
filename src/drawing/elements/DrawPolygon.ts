import DrawableUtil from "../../utils/DrawableUtil";
import BaseDraw from "./BaseDraw";
import { Color, DrawingDirection, LineAlignment, Point, Size } from "../structures";

class DrawPolygon extends BaseDraw {
    private _pointArray: Point[];

    constructor(name: string, pointArr: Point[]) {
        super(name);

        this._pointArray = pointArr;
        this.setPointArray(this._pointArray);
    }

    getPointArray(): Point[] {
        return this._pointArray;
    }

    setPointArray(pointArr: Point[]): void {
        if (!Point.isEmpty(this.baseLocation) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            this._pointArray = DrawableUtil.getTransformedLocationArray(pointArr, this.baseLocation, this.drawingDirection);
        } else {
            this._pointArray = pointArr;
        }

        this.setLocation(DrawableUtil.getMinPointArray(this._pointArray));
        this.setSize(DrawableUtil.getSizeArray(this._pointArray));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawPolygon(ctx);
        this.isChanged = false;
    }

    private drawPolygon(ctx: CanvasRenderingContext2D): void {
        if (this._pointArray.length < 2) return;

        const matrix = ctx.getTransform();
        
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

        const point = this._pointArray[0];
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

        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.beginPath();
        ctx.moveTo(startX, startY);                    
        this._pointArray.forEach((point) => {
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
                ctx.fillStyle = Color.Transparent().toRGBA();
            }
        }

        ctx.stroke();

        if (this.attribute.lineAlign === LineAlignment.Outset) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.fill();

            ctx.globalCompositeOperation = "source-over";
            if (this.attribute.isFill) {
                ctx.fillStyle = this.attribute.fillColor.toRGBA();
                ctx.fill();
                ctx.fillStyle = Color.Transparent().toRGBA();
            }
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.setTransform(matrix);
        ctx.lineJoin = "miter";
        ctx.lineWidth = 1;
    }

    setCurrentSize(newSize: Size) {
        const oldSize = this.getCurrentSize();
        super.setCurrentSize(newSize);

        const resizeRateWidth = newSize.width / oldSize.width;
        const resizeRateHeight = newSize.height / oldSize.height;

        for (let idx = 0; idx < this._pointArray.length; idx++) {
            const tPoint = new Point(0, 0);
            tPoint.x = this._pointArray[idx].x * resizeRateWidth;
            tPoint.y = this._pointArray[idx].y * resizeRateHeight;
            this._pointArray[idx] = tPoint;
        }

        const point = DrawableUtil.getMinPointArray(this._pointArray);
        const deltaX = this._currentLocation.x - point.x;
        const deltaY = this._currentLocation.y - point.y;

        for (let idx = 0; idx < this._pointArray.length; idx++) {
            const tPoint = new Point(0, 0);
            tPoint.x = this._pointArray[idx].x + deltaX;
            tPoint.y = this._pointArray[idx].y + deltaY;
            this._pointArray[idx] = tPoint;
        }
    }

    applyBaseLocation(baseLocation: Point, drawingDir: DrawingDirection): void {
        this._pointArray = this.applyBaseLocationArray(baseLocation, drawingDir);
        this.setLocation(DrawableUtil.getMinPointArray(this._pointArray));
        this.setSize(DrawableUtil.getSizeArray(this._pointArray));
    }

    applyBaseLocationArray(baseLocation: Point, drawingDir: DrawingDirection): Point[] {
        const normalLocationArray = DrawableUtil.getNormalLocationArray(this);
        baseLocation = DrawableUtil.getBaseLocation(this, baseLocation, drawingDir);
        this.setBaseLocation(baseLocation, drawingDir);
        
        return DrawableUtil.getTransformedLocationArray(normalLocationArray, baseLocation, drawingDir);
    }
}

export default DrawPolygon;