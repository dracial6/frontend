import DrawableUtil from "../../utils/DrawableUtil";
import BaseDraw from "./BaseDraw";
import { DrawingDirection, Point, Size } from "../structures";

class DrawLine extends BaseDraw {
    private _startPoint: Point = new Point(0, 0);
    private _endPoint: Point = new Point(0, 0);

    constructor(name: string, x1: number, y1: number, x2: number, y2: number) {
        super(name);
        this.setData(x1, y1, x2, y2);
    }

    getStartPoint(): Point {
        return this._startPoint;
    }

    getEndPoint(): Point {
        return this._endPoint;
    }

    setData(x1: number, y1: number, x2: number, y2: number): void {
        if (Point.isEmpty(this.baseLocation) === false || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            const locationArray: Point[] = [];
            locationArray.push(new Point(x1, y1));
            locationArray.push(new Point(x2, y2));

            const transformedLocationArray: Point[] = DrawableUtil.getTransformedLocationArray(locationArray, this.baseLocation, this.drawingDirection);
            this._startPoint = transformedLocationArray[0];
            this._endPoint = transformedLocationArray[1];
        } else {
            this._startPoint.x = x1;
            this._startPoint.y = y1;
            this._endPoint.x = x2;
            this._endPoint.y = y2;
        }

        this.setLocation(DrawableUtil.getMinPoint(this._startPoint.x, this._startPoint.y, this._endPoint.x, this._endPoint.y));
        this.setSize(DrawableUtil.getSize(this._startPoint.x, this._startPoint.y, this._endPoint.x, this._endPoint.y));
    }

    setStartPoint(point: Point): void {
        if (!Point.isEmpty(this.baseLocation) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            const locationArray = this.applyBaseLocationArray(this.baseLocation, this.drawingDirection);            
            this._startPoint = locationArray[0];
        } else {
            this._startPoint = point;
        }
    }

    setEndPoint(point: Point): void {
        if (!Point.isEmpty(this.baseLocation) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            const locationArray = this.applyBaseLocationArray(this.baseLocation, this.drawingDirection);            
            this._endPoint = locationArray[1];
        } else {
            this._endPoint = point;
        }
    }

    setCurrentSize(newSize: Size): void {
        const oldSize = this.getCurrentSize();
        super.setCurrentSize(newSize);

        const pointArray: Point[] = [];
        pointArray.push(this._startPoint);
        pointArray.push(this._endPoint);

        const resizeRateWidth = newSize.width / oldSize.width;
        const resizeRateHeight = newSize.height / oldSize.height;

        for (let idx = 0; idx < pointArray.length; idx++) {
            const tPoint = new Point(0, 0);
            tPoint.x = pointArray[idx].x * resizeRateWidth;
            tPoint.y = pointArray[idx].y * resizeRateHeight;
            pointArray[idx] = tPoint;
        }

        const point = DrawableUtil.getMinPointArray(pointArray);
        const deltaX = this.getCurrentLocation().x - point.x;
        const deltaY = this.getCurrentLocation().y - point.y;

        for (let idx = 0; idx < pointArray.length; idx++) {
            const tPoint = new Point(0, 0);

            tPoint.x = pointArray[idx].x + deltaX;
            tPoint.y = pointArray[idx].y + deltaY;
            pointArray[idx] = tPoint;
        }

        this.setStartPoint(pointArray[0]);
        this.setEndPoint(pointArray[1]);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawLine(ctx);
        this.isChanged = false;
    }

    private drawLine(ctx: CanvasRenderingContext2D): void {
        const matrix = ctx.getTransform();

        if (this.degree !== 0) {
            this.rotate(ctx);
        }
        
        ctx.lineWidth = this.attribute.lineThick;
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.beginPath();
        ctx.moveTo(this._startPoint.x, this._startPoint.y);
        ctx.lineTo(this._endPoint.x, this._endPoint.y);
        ctx.stroke();
        ctx.strokeStyle = 'black';
        ctx.setTransform(matrix);
        ctx.lineWidth = 1;
    }

    applyBaseLocation(baseLocation: Point, drawingDir: DrawingDirection): void {
        const transformedLocationArray = this.applyBaseLocationArray(baseLocation, drawingDir);
        this._startPoint = transformedLocationArray[0];
        this._endPoint = transformedLocationArray[1];
        //this.isChanged = true;
    }

    applyBaseLocationArray(baseLocation: Point, drawingDir: DrawingDirection): Point[] {
        const normalLocationArray = DrawableUtil.getNormalLocationArray(this);
        this.setBaseLocation(baseLocation, drawingDir);
        return DrawableUtil.getTransformedLocationArray(normalLocationArray, baseLocation, drawingDir);
    }

    clone(): BaseDraw {
        return this.fillDrawObjectFields();
    }
}

export default DrawLine;