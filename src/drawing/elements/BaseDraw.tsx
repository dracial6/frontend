import DrawableUtil from '../../utils/DrawableUtil';
import BaseDrawableObject from './BaseDrawableObject';
import IBaseGeometry from './IBaseGeometry';
import { Point, Size, GeometryAttribute, AnchorStyles, DrawableGeometry, FrozenTypes, DrawingDirection, Rectangle } from '../structures';

class BaseDraw implements IBaseGeometry {
    protected _location: Point = new Point(0, 0);
    protected _size: Size = new Size(0, 0);
    protected _currentLocation: Point = new Point(0, 0);
    protected _currentSize: Size = new Size(0, 0);

    name = '';
    visible = true;
    attribute: GeometryAttribute = new GeometryAttribute();
    anchor: AnchorStyles = AnchorStyles.None;
    degree = 0;
    isChanged = true;
    isForceDraw = false;
    parentGeometry!: BaseDrawableObject;
    frozenTypes: FrozenTypes = FrozenTypes.None;
    drawingDirection: DrawingDirection = DrawingDirection.LeftToRightAndTopToBottom;
    baseLocation: Point = new Point(0, 0);
    frozenLineIndex = 0;
    
    constructor(name: string) {
        this.name  = name;
    }
    
    getCurrentSize(): Size {
        return new Size(this._currentSize.width, this._currentSize.height);
    }

    setCurrentSize(size: Size): void {
        this._currentSize = size;
        this.isChanged = true;
    }

    getLocation(): Point {
        return new Point(this._location.x, this._location.y);
    }

    getSize(): Size {
        return new Size(this._size.width, this._size.height);
    }

    getCurrentLocation(): Point {
        return new Point(this._currentLocation.x, this._currentLocation.y);
    }

    setLocation(point: Point): void {
        if (!this.baseLocation.equal(Point.Empty()) || this.drawingDirection !== DrawingDirection.LeftToRightAndTopToBottom) {
            this._location = DrawableUtil.getTransformedLocation(point, this._size, this.baseLocation, this.drawingDirection);
            this._currentLocation = this._location;
        } else {
            this._location = point;
            this._currentLocation = point;
        }
    }

    setSize(size: Size): void {
        this._size = size;
        this._currentSize = size;
        this.isChanged = true;
    }

    setCurrentLocation(point: Point): void {
        this._currentLocation = new Point(point.x + this._location.x, point.y + this._location.y);
        this.isChanged = true;
    }

    protected fillDrawObjectFields(): BaseDraw {
        return JSON.parse(JSON.stringify(this));
    }

    rotate(ctx: CanvasRenderingContext2D) {
        ctx.translate(this._currentLocation.x + this._currentSize.width / 2, this._currentLocation.y + this._currentSize.height / 2);
        ctx.rotate(this.degree * Math.PI / 180);
        ctx.translate(-(this._currentLocation.x + this._currentSize.width / 2), -(this._currentLocation.y + this._currentSize.height / 2));
        this.isChanged = true;
    }

    setBaseLocation(baseLocation: Point, drawingDir: DrawingDirection): void {
        this.baseLocation = DrawableUtil.getBaseLocation(this, baseLocation, drawingDir);
        this.isChanged = true;
    }

    objectInCanvas(m_Scalef: number, canvasRectangle: Rectangle): boolean {
        if (m_Scalef !== 1) {
            return canvasRectangle.intersectsWith(
                new Rectangle(this._currentLocation.x * m_Scalef
                    , this._currentLocation.y * m_Scalef
                    , this._currentSize.width * m_Scalef
                    , this._currentSize.height * m_Scalef));
        }

        return canvasRectangle.intersectsWith(this.getMBR());
    }
    
    getMBR(): Rectangle {
        return new Rectangle(this._currentLocation.x, this._currentLocation.y, this._currentSize.width, this._currentSize.height);
    }

    getDisplayedLocation(): Point {
        return new Point(this._currentLocation.x, this._currentLocation.y);
    }

    applyBaseLocation(baseLocation: Point, drawingDir: DrawingDirection): void {
        const normalLocation = DrawableUtil.getNormalLocationSize(this.baseLocation, this._location, this._size, this.drawingDirection);
        this.drawingDirection = drawingDir;
        this._location = DrawableUtil.getTransformedLocation(normalLocation, this._size, this.baseLocation, this.drawingDirection);
        this._currentLocation = this._location;
        this.isChanged = true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        throw new Error('Method not implemented.');
    }
}

export default BaseDraw;