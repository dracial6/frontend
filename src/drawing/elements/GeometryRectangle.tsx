import DrawableUtil from "../../utils/DrawableUtil";
import GeometryObject from "./GeometryObject";
import { Color, GeometryAttribute, Point, Rectangle, Size } from "../structures";

class GeometryRectangle extends GeometryObject {
    constructor(name: string, x: number, y: number, width: number, height: number) {
        super(name);
        this.setSize(new Size(width, height));
        this.setLocation(new Point(x, y));
    }

    getHandleCount(): number {
        return 8;
    }

    clone(): GeometryObject {
        return this.fillDrawObjectFields();
    }

    drawTracker(ctx: CanvasRenderingContext2D, isResize: boolean): void {
        if (!this.isSelected || !this.enableMove || this.isBackground) return;

        for(let i = 1; i <= this.getHandleCount(); i++) {
            DrawableUtil.drawTracker(ctx, this.enableResizable, this.enableMove, DrawableUtil.getTrackerColor(isResize), this.getHandleRectangle(i));
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawRectangle(ctx);
        this.isChanged = false;
    }

    getHandle(handlerNumber: number): Point {
        const bounds = this.getBounds();
        let x = bounds.x;
        let y = bounds.y;
        const xCenter = bounds.x + bounds.width / 2;
        const yCenter = bounds.y + bounds.height / 2;

        switch(handlerNumber) {
            case 1:
                x = bounds.x;
                y = bounds.y;
                break;
            case 2:
                x = xCenter;
                y = bounds.y;
                break;
            case 3:
                x = bounds.x + bounds.width;
                y = bounds.y;
                break;
            case 4:
                x = bounds.x + bounds.width;
                y = yCenter;
                break;
            case 5:
                x = bounds.x + bounds.width;
                y = bounds.y + bounds.height;
                break;
            case 6:
                x = xCenter;
                y = bounds.y + bounds.height;
                break;
            case 7:
                x = bounds.x;
                y = bounds.y + bounds.height;
                break;
            case 8:
                x = bounds.x;
                y = yCenter;
                break;
        }

        if (this.degree !== 0) {
            let array = [];
            array.push(new Point(x, y));
            array = DrawableUtil.transformPoints(array, this.degree, this.rotationCenter);
            x = array[0].x;
            y = array[0].y;
        }

        return new Point(x, y);
    }

    getHandleRectangle(handlerNumber: number): Rectangle {
        const point = this.getHandle(handlerNumber);
        return new Rectangle(point.x, point.y, 7, 7);
    }

    protected drawRectangle(ctx: CanvasRenderingContext2D): void {
        if (this.getCurrentSize().equal(Size.Empty())) return;

        const matrix = ctx.getTransform();
        this.makeRotateTransform(ctx);
        DrawableUtil.setDashStyle(ctx, this.attribute.dashStyle);

        if (this.attribute.radius === 0) {
            if (this.attribute.isFill) {
                if (this.attribute.fillColor.toRGBA() !== Color.Transparent().toRGBA()) {
                    ctx.fillStyle = this.attribute.fillColor.toRGBA();
                    ctx.fillRect(this._currentLocation.x, this._currentLocation.y, this.getCurrentSize().width, this.getCurrentSize().height);
                }
            }

            ctx.strokeStyle = this.attribute.lineColor.toRGBA();
            ctx.strokeRect(this._currentLocation.x, this._currentLocation.y, this.getCurrentSize().width, this.getCurrentSize().height);
        } else {
            //TO-DO : draw round rectangle
        }

        this.rollBackTransform(ctx, matrix);
    }

    protected setRectangle(x: number, y: number, width: number, height: number) {
        this.minimumSize = new Size(0, 0);
        // check minimum size
        if (this.minimumSize.width !== 0 && this.minimumSize.height !== 0) {
            if (this.minimumSize.width > width && this.minimumSize.height > height) return;

            if (this.minimumSize.width > width) {
                width = this.minimumSize.width;
            }

            if (this.minimumSize.height > height) {
                height = this.minimumSize.height;
            }
        }

        this.setLocation(new Point(x, y));
        this.setSize(new Size(width, height));

        this.setCurrentLocation(new Point(x, y));
        this.setCurrentSize(new Size(width, height));

        this.onResizeGeometry();
    }

    getMaxXInMinBoundary(m_Scalef: number): number {
        let bound = this.getBounds();

        if (this.degree !== 0) {
            bound = this.getRealRectangle();
        }

        return (bound.x + bound.width) * m_Scalef + 0.5;
    }

    getMaxYInMinBoundary(m_Scalef: number): number {
        let bound = this.getBounds();
        
        if (this.degree !== 0) {
            bound = this.getRealRectangle();
        }

        return (bound.y + bound.height) * m_Scalef + 0.5;
    }

    normalize(): void {
        const bound = GeometryRectangle.getNormalizedRectangleRectangle(this.getBounds());
        this.setLocation(new Point(bound.x, bound.y));
        this.setSize(new Size(bound.width, bound.height));
    }

    intersectsWith(rect: Rectangle): boolean {
        let pointArray = DrawableUtil.getVertex(this.getBounds());
        if (this.degree !== 0)
        {
            pointArray = DrawableUtil.transformPoints(pointArray, this.degree, this.rotationCenter);
        }

        if (DrawableUtil.isContainRectangle(pointArray, rect)) {
            return true;
        }

        return false;
    }

    hitTest(point: Point): number {
        if (!this.visible) return -1;

        if (this.isSelected) {
            for (let i = 1; i <= this.getHandleCount(); i++) {
                if (this.getHandleRectangle(i).containsPoint(point)) {
                    return i;
                }
            }
        }

        if (this.pointInObject(point)) {
            return 0;
        }

        return -1;
    }

    move(deltaX: number, deltaY: number): void {
        const x = this.getBounds().x + deltaX;
        const y = this.getBounds().y + deltaY;

        if (this.getTotalDegree() !== 0) {
            this.rotationCenter = new Point(this.rotationCenter.x + deltaX, this.rotationCenter.y + deltaY);
        }

        this.setLocation(new Point(x, y));
        this.setCurrentLocation(new Point(x, y));

        this.onMoveGeometry();
    }

    moveHandleTo(point: Point, handleNumber: number): void {
        const bounds = this.getBounds();
        let left = bounds.x;
        let top = bounds.y;
        let right = bounds.x + bounds.width;
        let bottom = bounds.y + bounds.height;

        const realPos = this.transformByZeroBase(point, this.degree, this.rotationCenter);

        switch (handleNumber) {
            case 1:
                left = realPos.x;
                top = realPos.y;
                break;
            case 2:
                top = realPos.y;
                break;
            case 3:
                right = realPos.x;
                top = realPos.y;
                break;
            case 4:
                right = realPos.x;
                break;
            case 5:
                right = realPos.x;
                bottom = realPos.y;
                break;
            case 6:
                bottom = realPos.y;
                break;
            case 7:
                left = realPos.x;
                bottom = realPos.y;
                break;
            case 8:
                left = realPos.x;
                break;
        }

        this.setRectangle(left, top, right - left, bottom - top);
    }

    static getNormalizedRectanglePoint(p1: Point, p2: Point): Rectangle {
        return GeometryRectangle.getNormalizedRectangle(p1.x, p1.y, p2.x, p2.y);
    }

    static getNormalizedRectangleRectangle(r: Rectangle) {
        return GeometryRectangle.getNormalizedRectangle(r.x, r.y, r.x + r.width, r.y + r.height);
    }

    static getNormalizedRectangle(x1: number, y1: number, x2: number, y2: number) {
        if (x2 < x1) {
            const tmp = x2;
            x2 = x1;
            x1 = tmp;
        }

        if (y2 < y1) {
            const tmp = y2;
            y2 = y1;
            y1 = tmp;
        }

        return new Rectangle(x1, y1, x2 - x1, y2 - y1);
    }

    onResizeEnd(sender: any, event: MouseEvent): void {
        if (this.degree !== 0) {
            //영역의 중심을 축으로 회전하는 경우 크기 변화에 따라 중심 축의 위치를 변경해야 한다.
            const rotationCenter = new Point(0, 0);
            const bound = new Rectangle(0, 0, 0, 0);

            const flag = this.calculatedRotationCenter(rotationCenter, bound);
            if (flag)
            {
                this.rotationCenter = rotationCenter;
                this.setRectangle(bound.x, bound.y, bound.width, bound.height);
            }
        }
    }
}

export default GeometryRectangle;