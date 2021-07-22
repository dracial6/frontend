import DrawableUtil from "../../utils/DrawableUtil";
import GeometryObject from "./GeometryObject";
import { Cursors, DrawingDirection, Point, Rectangle, Size } from "../structures";

class GeometryLine extends GeometryObject {
    private _currentStartPoint = new Point(0, 0);
    private _currentEndPoint = new Point(0, 0);
    private _validHitBoundary: Point[] = [];
    
    arcLength = 120;

    getHandleCount(): number {
        return 2;
    }

    getCurrentStartPoint(): Point {
        return this._currentStartPoint;
    }

    getCurrentEndPoint(): Point {
        return this._currentEndPoint;
    }

    constructor(name: string, x1: number, y1: number, x2: number, y2: number){
        super(name);
        this.setData(x1, y1, x2, y2);
    }

    setData(x1: number, y1: number, x2: number, y2: number) {
        if (!this.baseLocation.equal(Point.Empty()) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            const locationArray: Point[] = [];
            locationArray.push(new Point(x1, y1));
            locationArray.push(new Point(x2, y2));

            const transformedLocationArray: Point[] = DrawableUtil.getTransformedLocationArray(locationArray, this.baseLocation, this.drawingDirection);
            this._currentStartPoint = transformedLocationArray[0];
            this._currentEndPoint = transformedLocationArray[1];
            
            this.calculateValidHitTestBoundary();

            this.setLocation(DrawableUtil.getMinPoint(this._currentStartPoint.x, this._currentStartPoint.y, this._currentEndPoint.x, this._currentEndPoint.y));
            this.setSize(DrawableUtil.getSize(this._currentStartPoint.x, this._currentStartPoint.y, this._currentEndPoint.x, this._currentEndPoint.y));
            this.isChanged = true;

            this.rotationCenter = DrawableUtil.getTransformedRotationCenter(this.getCurrentLocation(), this.baseLocation, this.drawingDirection);
        } else {
            this._currentStartPoint.x = x1;
            this._currentStartPoint.y = y1;
            this._currentEndPoint.x = x2;
            this._currentEndPoint.y = y2;

            this.calculateValidHitTestBoundary();

            this.setLocation(DrawableUtil.getMinPoint(x1, y1, x2, y2));
            this.setSize(DrawableUtil.getSize(x1, y1, x2, y2));
            this.isChanged = true;
        }
    }

    setCurrentSize(newSize: Size): void {
        const oldSize = this._size;
        super.setCurrentSize(newSize);

        const pointArray: Point[] = [];
        pointArray.push(this._currentStartPoint);
        pointArray.push(this._currentEndPoint);

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

        this._currentStartPoint = pointArray[0];
        this._currentEndPoint = pointArray[1];

        this.calculateValidHitTestBoundary();
    }

    private calculateValidHitTestBoundary(): void {
        const sp = this._currentStartPoint;
        const ep = this._currentEndPoint;

        const x1 = Math.abs(sp.x - ep.x);
        const y1 = Math.abs(sp.y - ep.y);
        const r = Math.sqrt((x1 * x1) + (y1 + y1));
        const movingAngle = this.arcLength / r;

        this._validHitBoundary.push(DrawableUtil.rotatePoint(movingAngle, ep, sp));
        this._validHitBoundary.push(DrawableUtil.rotatePoint(-movingAngle, ep, sp));
        this._validHitBoundary.push(DrawableUtil.rotatePoint(movingAngle, sp, ep));
        this._validHitBoundary.push(DrawableUtil.rotatePoint(-movingAngle, sp, ep));
    }

    clone(): GeometryObject {
        return this.fillDrawObjectFields();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawLine(ctx);
        this.isChanged = false;
    }

    private drawLine(ctx: CanvasRenderingContext2D): void {
        const matrix = ctx.getTransform();
        this.makeRotateTransform(ctx);
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);
        
        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.beginPath();
        ctx.moveTo(this._currentStartPoint.x, this._currentStartPoint.y);
        ctx.lineTo(this._currentEndPoint.x, this._currentEndPoint.y);
        ctx.stroke();
        ctx.strokeStyle = 'black';

        this.rollBackTransform(ctx, matrix);
    }

    applyBaseLocation(baseLocation: Point, drawingDir: DrawingDirection): void {
        const transformedLocationArray = this.applyBaseLocationArray(baseLocation, drawingDir);
        this._currentStartPoint = transformedLocationArray[0];
        this._currentEndPoint = transformedLocationArray[1];
        this.calculateValidHitTestBoundary();

        this.setLocation(DrawableUtil.getMinPoint(this._currentStartPoint.x, this._currentStartPoint.y, this._currentEndPoint.x, this._currentEndPoint.y));
        this.setSize(DrawableUtil.getSize(this._currentStartPoint.x, this._currentStartPoint.y, this._currentEndPoint.x, this._currentEndPoint.y));
        this.isChanged = true;
    }

    applyBaseLocationArray(baseLocation: Point, drawingDir: DrawingDirection): Point[] {
        const normalLocationArray = DrawableUtil.getNormalLocationArray(this);
        const normalRotationCenter = DrawableUtil.getNormalLocation(this.baseLocation, this.rotationCenter, this.drawingDirection);
        baseLocation = DrawableUtil.getBaseLocation(this, baseLocation, drawingDir);
        this.setBaseLocation(baseLocation, drawingDir);
        this.drawingDirection = drawingDir;
        this.rotationCenter = DrawableUtil.getTransformedRotationCenter(normalRotationCenter, baseLocation, drawingDir);
        
        return DrawableUtil.getTransformedLocationArray(normalLocationArray, baseLocation, drawingDir);
    }

    getMaxXInMinBoundary(m_Scalef: number){
        let rectangle;

        if (this.degree !== 0) {
            rectangle = this.getRealRectangle();
        } else {
            rectangle = this.getBounds();
        }

        return (rectangle.x + rectangle.width) * m_Scalef;
    }

    getMaxYInMinBoundary(m_Scalef: number){
        let rectangle;

        if (this.degree !== 0) {
            rectangle = this.getRealRectangle();
        } else {
            rectangle = this.getBounds();
        }

        return (rectangle.y + rectangle.height) * m_Scalef;
    }

    getHandle(handleNumber: number): Point {
        let point = new Point(0, 0);

        if (handleNumber === 1)
            point = this._currentStartPoint;
        else
            point = this._currentEndPoint;

        point = DrawableUtil.rotatePoint(this.degree, this.rotationCenter, point);

        return point;
    }

    getHandleRectangle(handleNumber: number): Rectangle {
        const point = this.getHandle(handleNumber);
        return new Rectangle(point.x, point.y, 7, 7);
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
        this._currentStartPoint.x += deltaX;
        this._currentStartPoint.y += deltaY;

        this._currentEndPoint.x += deltaX;
        this._currentEndPoint.y += deltaY;

        this.calculateValidHitTestBoundary();

        if (this.degree !== 0) {
            this.rotationCenter = new Point(this.rotationCenter.x + deltaX, this.rotationCenter.y + deltaY);
        }

        this.setLocation(DrawableUtil.getMinPoint(this._currentStartPoint.x, this._currentStartPoint.y, this._currentEndPoint.x, this._currentEndPoint.y));
        this.onMoveGeometry();
    }

    movePoint(point: Point): void {
        this.move(point.x - this.getCurrentLocation().x, point.y - this.getCurrentLocation().y);
    }

    moveHandleTo(point: Point, handleNumber: number): void {
        const realPos = this.transformByZeroBase(point, this.degree, this.rotationCenter);

        if (handleNumber === 1) {
            this._currentStartPoint = realPos;
        } else {
            this._currentEndPoint = realPos;
        }

        this.setLocation(DrawableUtil.getMinPoint(this._currentStartPoint.x, this._currentStartPoint.y
            , this._currentEndPoint.x, this._currentEndPoint.y));
        this.setSize(DrawableUtil.getSize(this._currentStartPoint.x, this._currentStartPoint.y
            , this._currentEndPoint.x, this._currentEndPoint.y));
        
        this.calculateValidHitTestBoundary();
        this.onResizeGeometry();
    }

    getHandlerCursor(handleNumber: number): Cursors {
        switch(handleNumber) {
            case 1:
            case 2:
                return Cursors.all_scroll;
            default:
                return Cursors.default;
        }
    }

    pointInObject(point: Point): boolean {
        const realPos = this.transformByZeroBase(point, this.degree, this.rotationCenter);
        return DrawableUtil.isContainPoint(this._validHitBoundary, realPos.x, realPos.y);
    }

    intersectsWith(rectangle: Rectangle): boolean {
        return DrawableUtil.isContainRectangle(this._validHitBoundary, rectangle)
    }
}

export default GeometryLine;