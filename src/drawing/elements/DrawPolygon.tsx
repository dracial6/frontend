import DrawableUtil from "../../utils/DrawableUtil";
import BaseDraw from "./BaseDraw";
import { Color, DrawingDirection, Point, Size } from "../structures";

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
        if (!this.baseLocation.equal(Point.Empty()) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
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

        const startPoint = this._pointArray[0];
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);                    
        this._pointArray.forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();

        if (this.attribute.isFill) {
            ctx.fillStyle = this.attribute.fillColor.toRGBA();
            ctx.fill();
            ctx.fillStyle = Color.Transparent().toRGBA();
        }

        ctx.stroke();
        ctx.strokeStyle = Color.Black().toRGBA();
        ctx.setTransform(matrix);
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