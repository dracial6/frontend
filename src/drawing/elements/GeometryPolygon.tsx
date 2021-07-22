import DrawableUtil from "../../utils/DrawableUtil";
import GeometryLine from "./GeometryLine";
import GeometryObject from "./GeometryObject";
import { Color, Cursors, DrawingDirection, Point, Rectangle, Size } from "../structures";

class GeometryPolygon extends GeometryLine {
    private _pointArray: Point[];

    constructor(name: string, pointArr: Point[]) {
        super(name, 0, 0, 0, 0);

        this._pointArray = pointArr;
        this.setPointArray(this._pointArray);
    }

    getHandleCount(): number {
        return this._pointArray.length;
    }

    getPointArray(): Point[] {
        return this._pointArray;
    }

    setPointArray(pointArr: Point[]): void {
        if (!this.baseLocation.equal(Point.Empty()) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            this._pointArray = DrawableUtil.getTransformedLocationArray(pointArr, this.baseLocation, this.drawingDirection);
            this.rotationCenter = DrawableUtil.getTransformedRotationCenter(DrawableUtil.getMinPointArray(this._pointArray), this.baseLocation, this.drawingDirection);
        } else {
            this._pointArray = pointArr;
        }

        this.setLocation(DrawableUtil.getMinPointArray(this._pointArray));
        this.setSize(DrawableUtil.getSizeArray(this._pointArray));
    }

    addPoint(point: Point): void {
        if (!this.baseLocation.equal(Point.Empty()) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            point = DrawableUtil.getTransformedLocationArray([point], this.baseLocation, this.drawingDirection)[0];
        }

        this._pointArray.push(point);
        this.setPointArray(this._pointArray);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawPolygon(ctx);
        this.isChanged = false;
    }

    private drawPolygon(ctx: CanvasRenderingContext2D): void {
        if (this._pointArray.length < 2) return;

        const matrix = ctx.getTransform();
        this.makeRotateTransform(ctx);
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        
        const startPoint = this._pointArray[0];
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
        this.rollBackTransform(ctx, matrix);
    }

    setCurrentSize(newSize: Size) {
        const oldSize = this._size;
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

    getHandle(handleNumber: number): Point {
        if (handleNumber < 1)
            handleNumber = 1;
        
        if (handleNumber > this._pointArray.length) {
            handleNumber = this._pointArray.length;
        }

        if (this.degree !== 0) {
             return DrawableUtil.rotatePoint(this.degree, this.rotationCenter, this._pointArray[handleNumber - 1]);
        } else {
            return (this._pointArray[handleNumber - 1]);
        }
    }
    
    drawTracker(ctx: CanvasRenderingContext2D, isResize: boolean): void {
        if (!this.isSelected || this.isBackground || !this.enableMove) return;

        for (let i = 1; i <= this.getHandleCount(); i++) {
            DrawableUtil.drawTracker(ctx, this.enableResizable, this.enableMove, DrawableUtil.getTrackerColor(isResize), this.getHandleRectangle(i));
        }
    }

    hitTest(point: Point): number {
        if (!this.visible) return -1;

        if (this.isSelected) {
            for (let i = 1; i <= this.getHandleCount(); i++) {
                if (this.getHandleRectangle(i).containsPoint(point))
                    return i;
            }
        }

        if (this.pointInObject(point))
            return 0;
        
        return -1;
    }

    move(deltaX: number, deltaY: number): void {
        let x, y;
        
        for (let i = 0; i < this._pointArray.length; i++) {
            x = this._pointArray[i].x + deltaX;
            y = this._pointArray[i].y + deltaY;

            this._pointArray[i] = new Point(x, y);
        }

        if (this.degree !== 0) {
            this.rotationCenter = new Point(this.rotationCenter.x + deltaX, this.rotationCenter.y + deltaY);
        }

        this.setLocation(DrawableUtil.getMinPointArray(this._pointArray));
        this.onMoveGeometry();
    }

    movePoint(point: Point): void {
        this.move(point.x - this._currentLocation.x, point.y - this._currentLocation.y);
    }

    moveHandleTo(point: Point, handleNumber: number): void {
        if (handleNumber < 1)
        handleNumber = 1;
    
        if (handleNumber > this._pointArray.length) {
            handleNumber = this._pointArray.length;
        }

        const realPos = this.transformByZeroBase(point, this.degree, this.rotationCenter);
        this._pointArray[handleNumber - 1] = realPos;

        this.setLocation(DrawableUtil.getMinPointArray(this._pointArray));
        this.setSize(DrawableUtil.getSizeArray(this._pointArray));
        this.onResizeGeometry();
    }

    getHandlerCursor(handleNumber: number): Cursors {
        return Cursors.all_scroll;
    }

    pointInObject(point: Point): boolean {
        let pointArr = this._pointArray;

        if (this.degree !== 0) {
            pointArr = DrawableUtil.transformPoints(pointArr, this.degree, this.rotationCenter);
        }

        if (DrawableUtil.isContainPoint(pointArr, point.x, point.y)) {
            return true;
        }

        return false;
    }

    intersectsWith(rectangle: Rectangle): boolean {
        let pointArr = this._pointArray;
        
        if (this.degree !== 0) {
            pointArr = DrawableUtil.transformPoints(pointArr, this.degree, this.rotationCenter);
        }

        if (DrawableUtil.isContainRectangle(pointArr, rectangle)) {
            return true;
        }

        return false;
    }
}

export default GeometryPolygon;