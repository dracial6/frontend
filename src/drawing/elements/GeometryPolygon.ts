import DrawableUtil from "../../utils/DrawableUtil";
import GeometryLine from "./GeometryLine";
import { Color, Cursors, DrawingDirection, LineAlignment, Point, Rectangle, Size } from "../structures";

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
        if (!Point.isEmpty(this.baseLocation) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            this._pointArray = DrawableUtil.getTransformedLocationArray(pointArr, this.baseLocation, this.drawingDirection);
            this.rotationCenter = DrawableUtil.getTransformedRotationCenter(DrawableUtil.getMinPointArray(this._pointArray), this.baseLocation, this.drawingDirection);
        } else {
            this._pointArray = pointArr;
        }

        this.setLocation(DrawableUtil.getMinPointArray(this._pointArray));
        this.setSize(DrawableUtil.getSizeArray(this._pointArray));
    }

    addPoint(point: Point): void {
        if (!Point.isEmpty(this.baseLocation) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
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
            }
        }

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        this.rollBackTransform(ctx, matrix);
        ctx.lineJoin = "miter";
        ctx.lineWidth = 1;
    }

    setDataList(list: Point[]): void {
        this.setPointArray(list);
        this.setLocation(DrawableUtil.getMinPointArray(this._pointArray));
        this.setSize(DrawableUtil.getSizeArray(this._pointArray));
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