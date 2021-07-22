import DrawableUtil from "../../utils/DrawableUtil";
import BaseDrawableObject from "./BaseDrawableObject";
import IDrawableGeometry from "./IDrawableGeometry";
import { ResizeVertex, Point, DisplayLayer, Rectangle, Cursors, Size, GeometryAttribute, AnchorStyles, FrozenTypes, DrawingDirection } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";

abstract class BaseGeometry implements IDrawableGeometry {
    protected _location: Point = new Point(0, 0);
    protected _size: Size = new Size(0, 0);
    protected _currentLocation: Point = new Point(0, 0);
    protected _currentSize: Size = new Size(0, 0);

    private _isOvered = false;

    name = '';
    isSelected = false;
    isMemberGeomGroup = false;
    isBackground = false;
    enableResizable = false;
    enableMove = true;
    enableResizeVertex: ResizeVertex = 255;
    rotationCenter: Point = new Point(0, 0);
    enableMouseOver = false;
    layer: DisplayLayer = DisplayLayer.One;
    isChanged = true;
    isForceDraw = false;    
    rotateBoundary: Rectangle = new Rectangle(0, 0, 0, 0);
    isRotationCenter = true;
    parentGeometry!: BaseDrawableObject;
    anchor: AnchorStyles = AnchorStyles.None;
    tempRectangle: Rectangle = new Rectangle(0, 0, 0, 0);
    tempRotationCenter: Point = new Point(0, 0);
    frozenTypes: FrozenTypes = FrozenTypes.None;
    drawingDirection: DrawingDirection = DrawingDirection.LeftToRightAndTopToBottom;
    customRotationLocation: Point = new Point(0, 0);
    minimumSize: Size = new Size(0, 0);
    visible = true;
    degree = 0;    
    attribute: GeometryAttribute = new GeometryAttribute();
    baseLocation: Point = new Point(0, 0);
    frozenLineIndex = 0;

    constructor(name: string) {
        this.name = name;
    }

    getIsOvered(): boolean {
        return this._isOvered;
    }

    setIsOvered(isOvered: boolean): void {
        this._isOvered = isOvered;
    }

    getCurrentSize(): Size {
        return this._currentSize;
    }
    
    setCurrentSize(size: Size): void {
        this._currentSize = size;
        this.isChanged = true;
    }

    getLocation(): Point {
        return this._location;
    }

    getSize(): Size {
        return this._size;
    }

    getCurrentLocation(): Point {
        return this._currentLocation;
    }
    
    setLocation(point: Point): void {
        if (!this.baseLocation.equal(Point.Empty()) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            this._location = DrawableUtil.getTransformedLocation(point, this._size, this.baseLocation, this.drawingDirection);
            this._currentLocation = this._location;
            this.rotationCenter = DrawableUtil.getTransformedRotationCenter(this._location, this.baseLocation, this.drawingDirection);
        } else {
            this._location = point;
            this._currentLocation = point;
        }

        this.isChanged = true;
    }

    setSize(size: Size): void {
        this._size = size;
        this._currentSize = size;
        this.isChanged = true;
    }

    setCurrentLocation(point: Point): void {
        if (this.isMemberGeomGroup) {
            this._currentLocation = new Point(this._location.x + point.x, this._location.y + point.y);

            if (this.degree !== 0) {
                if (!this.isRotationCenter) {
                    this.rotationCenter = new Point(this.customRotationLocation.x + point.x
                                            , this.customRotationLocation.y + point.y);
                }
            }
        } else {
            this._currentLocation = point;
        }

        this.isChanged = true;
    }
 
    draw(ctx: CanvasRenderingContext2D): void {}

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, viewBoundary: Rectangle, isMemoryCache: boolean): void {}
    
    getRealRectangle(): Rectangle {
        return this.makeRealBoundary();
    }

    getMaxXInMinBoundary(scalef: number): number {
        return 0;
    }

    getMaxYInMinBoundary(scalef: number): number {
        return 0;
    }

    rotate(degree: number): void {
        this.degree = degree;
        const bounds = this.getBounds();
        this.rotationCenter = new Point(bounds.x + (bounds.width / 2), bounds.y + (bounds.height / 2));
        this.isRotationCenter = true;
        this.isChanged = true;
    }

    rotateCenter(centerPoint: Point, degree: number): void {
        this.degree = degree;
        this.rotationCenter = centerPoint;
        this.isRotationCenter = false;
        this.customRotationLocation = centerPoint;
        this.isChanged = true;
    }

    rotateAlign(align: ContentAlignment, degree: number): void {
        this.rotateCenter(this.alignPoint(align), degree);
    }

    alignPoint(align: ContentAlignment): Point {
        const bounds = this.getBounds();
        switch (align) {
            case ContentAlignment.TopLeft:
                return new Point(bounds.x, bounds.y);
            case ContentAlignment.TopCenter:
                return new Point(bounds.x + (bounds.width / 2), bounds.y);
            case ContentAlignment.TopRight:
                return new Point(bounds.x + bounds.width, bounds.y);
            case ContentAlignment.MiddleLeft:
                return new Point(bounds.x, bounds.y + (bounds.height / 2));
            case ContentAlignment.MiddleCenter:
                return new Point(bounds.x + (bounds.width / 2), bounds.y + (bounds.height / 2));
            case ContentAlignment.MiddleRight:
                return new Point(bounds.x + bounds.width, bounds.y + (bounds.height / 2));
            case ContentAlignment.BottomLeft:
                return new Point(bounds.x, bounds.y + bounds.height);
            case ContentAlignment.BottomCenter:
                return new Point(bounds.x + (bounds.width / 2), bounds.y + bounds.height);
            case ContentAlignment.BottomRight:
                return new Point(bounds.x + bounds.width, bounds.y + bounds.height);
        }
    }

    objectInCanvas(pageScale: number, viewBoundary: Rectangle): boolean {
        const degree = this.getTotalDegree();
        const bounds = this.getBounds();

        if (pageScale !== 1 && degree === 0) {
            return viewBoundary.intersectsWith(
                new Rectangle((bounds.x * pageScale) + 1,
                    (bounds.y * pageScale) + 1,
                    (bounds.width * pageScale) + 1,
                    (bounds.height * pageScale) + 1)
            );
        }

        if (degree !== 0) {
            const rectangle = this.getRealRectangle();

            if (pageScale !== 1) {
                return viewBoundary.intersectsWith(
                    new Rectangle((rectangle.x * pageScale) + 1,
                        (rectangle.y * pageScale) + 1,
                        (rectangle.width * pageScale) + 1,
                        (rectangle.height * pageScale) + 1)
                );
            }
            
            return viewBoundary.intersectsWith(new Rectangle(rectangle.x, rectangle.y, rectangle.width + 1, rectangle.height + 1));            
        }

        return viewBoundary.intersectsWith(new Rectangle(bounds.x, bounds.y, bounds.width + 1, bounds.height + 1));
    }

    getMBR(): Rectangle {
        if (this.degree === 0) {
            return this.getBounds();
        } else {
            return this.getRealRectangle();
        }
    }

    getDisplayedLocation(): Point {
        return this.makeRealBoundary().getLocation();
    }

    applyBaseLocation(baseLocation: Point, drawingDir: DrawingDirection): void {
        const normalLocation = Point.truncate(DrawableUtil.getNormalLocationGeometry(this));
        const normalRotationCenter = Point.truncate(DrawableUtil.getNormalLocation(this.baseLocation, this.rotationCenter, this.drawingDirection));

        this.drawingDirection = drawingDir;
        this.setBaseLocation(baseLocation, drawingDir);
        
        this.setLocation(Point.truncate(DrawableUtil.getTransformedLocation(normalLocation, this._size, this.baseLocation, this.drawingDirection)));
        this.rotationCenter = DrawableUtil.getTransformedRotationCenter(normalRotationCenter, this.baseLocation, this.drawingDirection);

        this.isChanged = true;
    }

    setBaseLocation(baseLocation: Point, drawingDir: DrawingDirection): void { 
        this.baseLocation = Point.truncate(DrawableUtil.getBaseLocation(this, baseLocation, drawingDir));
        this.isChanged = true;
    }

    getBounds(): Rectangle {
        return new Rectangle(this._currentLocation.x, this._currentLocation.y, this.getCurrentSize().width, this.getCurrentSize().height);
    }

    getHandlerCursor(handleNumber: number): Cursors {
        if (this.degree !== 0) {
            if (this.degree > 0) {
                const shiftCnt = this.degree / 45;
                handleNumber = (handleNumber + shiftCnt) % 8;
            } else if (this.degree < 0) {
                let shiftCnt = (this.degree / 45) % 8;
                shiftCnt = 8 + shiftCnt;
                handleNumber = (handleNumber + shiftCnt) % 8;
            }

            if (handleNumber === 0) {
                handleNumber = 8;
            }
        }

        switch (handleNumber) {
            case 1:
                return Cursors.nwse_resize;
            case 2:
                return Cursors.ns_resize;
            case 3:
                return Cursors.nesw_resize;
            case 4:
                return Cursors.ew_resize;
            case 5:
                return Cursors.nwse_resize;
            case 6:
                return Cursors.ns_resize;
            case 7:
                return Cursors.nesw_resize;
            case 8:
                return Cursors.ew_resize;
            default:
                return Cursors.default;
        }
    }

    hitTest(point: Point): number {
        return -1;
    }

    pointInObject(point: Point): boolean {
        if (this.degree !== 0) {
            const flag = DrawableUtil.isContainPoint(
                DrawableUtil.transformPoints(DrawableUtil.getVertex(this.getBounds()), this.degree
                , this.rotationCenter)
                , point.x, point.y);

            return flag;
        }

        if (this.parentGeometry && this.parentGeometry.degree !== 0) {
            const flag = DrawableUtil.isContainPoint(
                    DrawableUtil.transformPoints(DrawableUtil.getVertex(this.getBounds()), this.parentGeometry.degree
                    , this.parentGeometry.rotationCenter)
                    , point.x, point.y);

            return flag;
        }
        else
        {
            return this.getBounds().containsPoint(point);
        }
    }

    Contains(point: Point): boolean {
        return this.pointInObject(point);
    }

    containsAtMBRPoint(point: Point): boolean {
        return this.getBounds().containsPoint(point);
    }

    containsAtMBRRectangle(rectangle: Rectangle): number{
        const bounds = this.getBounds();

        if (bounds.containsRectangle(rectangle)) {
            return 1;
        }
        else if (rectangle.containsRectangle(bounds)) {
            return -1;
        }
        else if (bounds.intersectsWith(rectangle)) {
            return 2;
        }

        return 0;
    }

    move(deltaX: number, deltaY: number): void {        
    }

    moveHandleTo(point: Point, handleNumber: number): void {        
    }

    getHandleCursor(handleNumber: number): Cursors {
        if (this.degree !== 0) {
            //회전각에 따라 handleNumber 실제 값을 다시 계산한다.
            //handleNumber 최대값은 8 이며, 45도 각을 기준으로 좌또는 우로 한 칸씩 이동하게 된다.
            if (this.degree > 0) {
                //회전각이 양수(+) 인 경우(우측으로 이동)
                const shiftCnt = (this.degree / 45);
                handleNumber = (handleNumber + shiftCnt) % 8;
            } else if (this.degree < 0) {
                //회전각이 음수(-) 인 경우(좌측으로 이동)
                let shiftCnt = (this.degree / 45) % 8;
                shiftCnt = 8 + shiftCnt;
                handleNumber = (handleNumber + shiftCnt) % 8;
            }

            handleNumber = parseInt(handleNumber.toString());

            if (handleNumber === 0) {
                handleNumber = 8;
            }
        }
        
        switch (handleNumber) {
            case 1:
                return Cursors.nwse_resize;
            case 2:
                return Cursors.ns_resize;
            case 3:
                return Cursors.nesw_resize;
            case 4:
                return Cursors.ew_resize;
            case 5:
                return Cursors.nwse_resize;
            case 6:
                return Cursors.ns_resize;
            case 7:
                return Cursors.nesw_resize;
            case 8:
                return Cursors.ew_resize;
            default:
                return Cursors.default;
        }
    }

    normalize(): void {
    }

    drawSelectedOutLine(ctx: CanvasRenderingContext2D): void {        
    }

    intersectsWith(rectangle: Rectangle): boolean {
        if (this.degree !== 0) {
            return this.getRealRectangle().intersectsWith(rectangle);
        }

        return this.getBounds().intersectsWith(rectangle);
    }

    movePoint(point: Point): void {
        this.setLocation(point);
    }

    getTotalDegree(): number {
        if (this.parentGeometry) {
            return this.parentGeometry?.getTotalDegree() + this.degree;
        }

        return this.degree;
    }

    makeRealBoundary(): Rectangle {
        const degree = this.getTotalDegree();
        const bounds = this.getBounds();
        if (degree === 0) return bounds;

        if (bounds.equal(this.tempRectangle) && this.rotationCenter.equal(this.tempRotationCenter)) {
            return this.rotateBoundary;
        } else {
            this.tempRectangle = bounds;
            this.tempRotationCenter = this.rotationCenter;
        }

        let rCenter = this.rotationCenter;
        if (this.rotationCenter.equal(Point.Empty())) {
            rCenter = this.getParentRotationCenter();
        }

        const rectangle = DrawableUtil.rotateRectangle(degree, rCenter, bounds);
        this.rotateBoundary = rectangle;

        return rectangle;
    }

    protected transformByZeroBase(point: Point, degree: number, rotationCenter: Point): Point {
        const realPos = point;
        //회전에 따른 실제 좌표를 계산한다.
        if (degree !== 0) {
            //마우스가 움직인 좌표를 도형이 회전되기 전에 움직인 좌표로 변환한다.
            const myMatrix1 = new DOMMatrix().translate(rotationCenter.x, rotationCenter.y).rotate(degree * -1).translate(-rotationCenter.x, -rotationCenter.y);
            let p1 = new DOMPoint(point.x, point.y);
            p1 = myMatrix1.transformPoint(p1);

            //회전된 도형에 적용할 실제 좌표를 설정한다.
            realPos.x = p1.x;
            realPos.y = p1.y;
        }

        return realPos;
    }

    protected calculatedRotationCenter(rotationCenter: Point, bound: Rectangle): boolean {
        let flag = false;
        rotationCenter = new Point(0, 0);
        bound = new Rectangle(0, 0, 0, 0);

        if (this.degree !== 0 && this.isRotationCenter) {
            const realPosArr = DrawableUtil.rotatePointArray(this.degree, this.rotationCenter, this.getBounds());
            const realRotationCenter = DrawableUtil.intersectionPoint(realPosArr[0], realPosArr[3], realPosArr[2], realPosArr[1]);
            const tfPosArr = DrawableUtil.transformPoints(realPosArr, this.degree * -1, realRotationCenter);
            const realDisplayBound = DrawableUtil.getMBR(tfPosArr);

            rotationCenter.x = realRotationCenter.x;
            rotationCenter.y = realRotationCenter.y;
            bound.x = realDisplayBound.x;
            bound.y = realDisplayBound.y;
            bound.width = realDisplayBound.width;
            bound.height = realDisplayBound.height;

            flag = true;
        }

        return flag;
    }

    protected calculatedRotationCenterByVertex(pointArray: Point[], rotationCenter: Point, bound: Rectangle, pointList: Point[]): boolean {
        let flag = false;
        rotationCenter = new Point(0, 0);
        bound = new Rectangle(0, 0, 0, 0);
        pointList = [];

        if (this.degree !== 0 && this.isRotationCenter) {
            //현재 중심 좌표로 표현될 실제 좌표값.
            const tempRealPosArr = DrawableUtil.transformPoints(pointArray, this.degree, this.rotationCenter);
            const tempBounds = DrawableUtil.getMBR(tempRealPosArr);
            const realPosArr = DrawableUtil.getVertex(tempBounds);

            //표현된 실제 좌표를 기준으로 회전된 중심값.
            const realRotationCenter = DrawableUtil.intersectionPoint(realPosArr[0], realPosArr[2], realPosArr[1], realPosArr[3]);
            
            //변경된 중심값을 기준으로 표현될 좌표값
            const tfPosArr = DrawableUtil.transformPoints(tempRealPosArr, this.degree * -1, realRotationCenter);
            //실제 표현될 영역값
            const realDisplayBounds = DrawableUtil.getMBR(tfPosArr);

            for (let i = 0; i < tfPosArr.length; i++) {
                pointList.push(tfPosArr[i]);
            }
            
            rotationCenter = realRotationCenter;
            bound = realDisplayBounds;

            flag = true;
        }

        return flag;
    }

    getParentRotationCenter(): Point {
        if (!this.parentGeometry) {
            return Point.Empty();
        }

        return this.parentGeometry.rotationCenter;
    }

    protected makeRotateTransform(ctx: CanvasRenderingContext2D): void {
        if (this.degree !== 0) {
            const matrix = ctx.getTransform();

            if (this.isRotationCenter) {
                if (this.rotationCenter.equal(Point.Empty())) {
                    const bounds = this.getBounds();
                    const centerX = bounds.x + (bounds.width / 2);
                    const centerY = bounds.y + (bounds.height / 2);
                
                    this.rotationCenter = new Point(centerX, centerY);
                }
            }

            ctx.setTransform(matrix.translate(this.rotationCenter.x, this.rotationCenter.y).rotate(this.degree).translate(-this.rotationCenter.x, -this.rotationCenter.y));
        }
    }

    protected rollBackTransform(ctx: CanvasRenderingContext2D, matrix: DOMMatrix): void {
        if (this.degree !== 0) {
            ctx.setTransform(matrix);
        }
    }

    abstract drawTracker(ctx: CanvasRenderingContext2D, isResize: boolean): void;
}

export default BaseGeometry;