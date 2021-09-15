import DrawableUtil from "../../utils/DrawableUtil";
import BaseDraw from "./BaseDraw";
import BaseGeometry from "./BaseGeometry";
import GeometryLayer from "./GeometryLayer";
import GeometryRectangle from "./GeometryRectangle";
import IBaseGeometry from "./IBaseGeometry";
import IDrawable from "./IDrawable";
import IDrawableGeometry from "./IDrawableGeometry";
import IDrawableMouseEvent from "./IDrawableMouseEvent";
import { Color, DrawingDirection, FrozenTypes, Padding, Point, Rectangle, Size } from "../structures";
import ContentAlignment from "../structures/ContentAlignment";

abstract class BaseDrawableObject extends BaseGeometry implements IDrawableMouseEvent {
    private _memoryImage!: ImageData;
    
    IDrawableGeometry = 0;
    /// <summary>
    /// 컨텍스트 메뉴
    /// </summary>
    //private TContextMenuStrip _contextMenuStrip;
    padding: Padding = new Padding(0, 0, 0, 0);
    imageURL = '';
    /// <summary>
    /// 저장된 이미지 정보가 Byte 형태로 변경된 정보.
    /// </summary>
    imageBytes: ArrayBuffer = new ArrayBuffer(8);
    /// <summary>
    /// 이미지 사용 여부.
    /// </summary>
    isMemoryCache = false;
    /// <summary>
    /// 보여지는 실제영역 체크 여부
    /// </summary>
    isCheckViewBoundary = true;
    /// <summary>
    /// MemoryCache 초기화 여부 
    /// </summary>
    isAlreadyClearMemoryCache = false;
    /// <summary>
    /// 이미지 안쪽 여백
    /// </summary>
    imagePadding: Padding = new Padding(0, 0, 0, 0);
    
    removeWhiteSpaceOfImage = false;

    /// <summary>
    /// 조작 가능한 위치의 개수를 가져옵니다..
    /// Number of handles
    /// </summary>
    readonly HandleCount = 8;

    constructor(name: string) {
        super(name);
    }
    
    setLocation(point: Point): void {
        super.setLocation(point);
        this.calculateAncher();
        this.isChanged = true;
    }

    setSize(size: Size): void {
        super.setSize(size);
        this.calculateAncher();
        this.isChanged = true;
    }

    setCurrentLocation(point: Point): void {
        if (this.isMemberGeomGroup) {
            this._currentLocation = new Point(this._location.x + point.x, this._location.y + point.y);
        } else {
            this._currentLocation = point;
        }

        this.calculateAncher();
        this.isChanged = true;
    }

    setIsOvered(isOvered: boolean): void {
        const geomList = this.getGeomList();
        if (geomList.length === 0) return;
        super.setIsOvered(isOvered);

        if (!isOvered) {
            geomList.forEach((element) => {
                if (element instanceof BaseDrawableObject) {
                    (element as BaseDrawableObject).setIsOvered(isOvered);
                }
            });
        }

        if (!isOvered) {
            this.onMouseLeave(undefined, new MouseEvent("MouseLeave"));
        }

        this.isChanged = true;
    }

    getHandle(handleNumber: number): Point {
        let x, y;
        const bound = this.getBounds();

        const xCenter = bound.x + bound.width / 2;
        const yCenter = bound.y + bound.height / 2;
        x = bound.x;
        y = bound.y;

        switch (handleNumber) {
            case 1:
                x = bound.x;
                y = bound.y;
                break;
            case 2:
                x = xCenter;
                y = bound.y;
                break;
            case 3:
                x = bound.x + bound.width;
                y = bound.y;
                break;
            case 4:
                x = bound.x + bound.width;
                y = yCenter;
                break;
            case 5:
                x = bound.x + bound.width;
                y = bound.y + bound.height;
                break;
            case 6:
                x = xCenter;
                y = bound.y + bound.height;
                break;
            case 7:
                x = bound.x;
                y = bound.y + bound.height;
                break;
            case 8:
                x = bound.x;
                y = yCenter;
                break;
        }

        if (this.degree !== 0) {
            const p1 = DrawableUtil.rotatePoint(this.degree, this.rotationCenter, new Point(x, y));
            x = p1.x;
            y = p1.y;
        }

        return new Point(x, y);
    }

    getHandleRectangle(handleNumber: number): Rectangle {
        const point = this.getHandle(handleNumber);
        return new Rectangle(point.x, point.y, 7, 7);
    }

    drawTracker(ctx: CanvasRenderingContext2D, isResize: boolean): void {
        if (!this.isSelected || this.isBackground) return;

        for (let i = 1; i <= this.HandleCount; i++) {
            if (this.enableResizable) {
                let resizable = true;
                if ((this.enableResizeVertex & (1 << (i - 1))) === 0) {
                    resizable = false;
                }
                DrawableUtil.drawTracker(ctx, resizable, this.enableMove, Color.Red(), this.getHandleRectangle(i));
            } else {
                DrawableUtil.drawTracker(ctx, this.enableResizable, this.enableMove, Color.DarkGray(), this.getHandleRectangle(i));
            }
        }
    }

    drawSelectedOutLine(ctx: CanvasRenderingContext2D): void {
        if (!this.isSelected) return;

        const style = ctx.strokeStyle;
        ctx.strokeStyle = this.attribute.lineColor.toRGBA();
        ctx.strokeRect(this._currentLocation.x, this._currentLocation.y, this._size.width, this._size.height);
        ctx.strokeStyle = style;
    }

    hitTest(point: Point): number {
        if (!this.visible) return -1;

        if (this.isSelected) {
            for (let i = 1; i <= this.HandleCount; i++) {
                if (this.getHandleRectangle(i).containsPoint(point)) {
                    return i;
                }
            }
        }

        if (this.pointInObject(point))
            return 0;
        
        return -1;
    }

    move(deltaX: number, deltaY: number) {
        const x = this._currentLocation.x + deltaX;
        const y = this._currentLocation.y + deltaY;

        this.setLocation(new Point(x, y));
        this.setCurrentLocation(new Point(x, y));

        if (this.degree !== 0) {
            if (Point.isEmpty(this.rotationCenter)) {
                this.rotationCenter = new Point(this._currentLocation.x + this._size.width / 2
                                        , this._currentLocation.y + this._size.height / 2);
            }

            this.rotationCenter = new Point(this.rotationCenter.x + deltaX
                                    , this.rotationCenter.y + deltaY);
        }
    }

    moveHandleTo(point: Point, handleNumber: number): void {
        let left = this._currentLocation.x;
        let top = this._currentLocation.y;
        let right = this._currentLocation.x + this._size.width;
        let bottom = this._currentLocation.y + this._size.height;

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

        this.setCurrentLocation(new Point(left, top));
        const size = DrawableUtil.getMaxSize(right - left, bottom - top, this.minimumSize);

        if (!Size.isEmpty(size))
            this._currentSize = size;
        
        if (this.degree !== 0) {
            if (Point.isEmpty(this.rotationCenter)) {
                this.rotationCenter = new Point(this._currentLocation.x + this._size.width / 2
                                        , this._currentLocation.y + this._size.height / 2);
            }
        }
    }

    normalize(): void {
        const rectangle = GeometryRectangle.getNormalizedRectangleRectangle(this.getBounds());
        this.setLocation(new Point(rectangle.x, rectangle.y));
        this.setSize(new Size(rectangle.width, rectangle.height));
    }

    applyBaseLocation(baseLocation: Point, drawingDir: DrawingDirection) {
        const geomList = this.getGeomList();

        if (geomList.length > 0) {
            for (let i = 0; i < geomList.length; i++) {
                geomList[i].applyBaseLocation(baseLocation, drawingDir);
            }
        }
        this.applyBaseLocation(baseLocation, drawingDir);
        this.calculateAncher();
        this.isChanged = true;
    }

    private hasChildChangedValue(): boolean {
        let returnValue = false;
        const geomList = this.getGeomList();

        for (let i = 0; i < geomList.length; i++) {
            const item = geomList[i];

            if (item.isChanged) {
                returnValue = true;
                break;
            }

            if (item instanceof BaseDrawableObject) {
                if ((item as BaseDrawableObject).hasChildChangedValue()){
                    returnValue = true;
                    break;
                }
            }
        }

        return returnValue;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const matrix = ctx.getTransform();
        this.makeRotateTransform(ctx);
        this.drawGeometry(ctx);
        this.rollBackTransform(ctx, matrix);
    }

    drawDetail(ctx: CanvasRenderingContext2D, pageScale: number, viewBoundary: Rectangle, isMemoryCache: boolean): void {
        this.isAlreadyClearMemoryCache = false;
        let realBR = new Rectangle(0, 0, 0, 0);

        if (isMemoryCache) {
            realBR = this.getRealRectangle();
        }

        this.setCacheImage(ctx, realBR, isMemoryCache);
        const matrix = ctx.getTransform();
        matrix.a = pageScale;
        matrix.d = pageScale;
        ctx.setTransform(matrix);
        this.makeRotateTransform(ctx);
        this.drawBackColor(ctx);
        this.drawGeometryCache(ctx, pageScale, viewBoundary, isMemoryCache);
        this.drawBoundaryLine(ctx);

        if (isMemoryCache && this.parentGeometry) {
            this.drawCacheImage(ctx, realBR, pageScale);
        }

        matrix.a = 1;
        matrix.d = 1;
        this.rollBackTransform(ctx, matrix);
    }

    protected setCacheImage(ctx: CanvasRenderingContext2D, realBR: Rectangle, isMemoryCache: boolean): void {
        if (isMemoryCache && this.parentGeometry) {
            this._memoryImage = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            realBR = this.getRealRectangle();
            
            if (this.imagePadding.left === 0 && this.imagePadding.top) {
                ctx.setTransform(ctx.getTransform().translate(-realBR.x, -realBR.y));
            } else {
                ctx.setTransform(ctx.getTransform().translate(-(realBR.x - this.imagePadding.left), -(realBR.x - this.imagePadding.top)));
            }
        }
    }

    private drawBackColor(ctx: CanvasRenderingContext2D): void {
        if (this.attribute.isFill) {
            const style = ctx.fillStyle;
            ctx.fillStyle = this.attribute.fillColor.toRGBA();
            ctx.fillRect(this._currentLocation.x, this._currentLocation.y, this._size.width, this._size.height);
            ctx.fillStyle = style;
        }
    }

    private drawBoundaryLine(ctx: CanvasRenderingContext2D): void {
        if (this.attribute.isOutLine && this.attribute.outLineColor.toRGBA() !== Color.Transparent().toRGBA()) {
            const style = ctx.strokeStyle;
            ctx.strokeStyle = this.attribute.outLineColor.toRGBA();
            ctx.strokeRect(this._currentLocation.x, this._currentLocation.y, this._size.width, this._size.height);
            ctx.strokeStyle = style;
        }
    }

    private drawCacheImage(ctx: CanvasRenderingContext2D, drawBoundary: Rectangle, pageScale: number): void {
        if (pageScale !== 1) {
            ctx.resetTransform();
            const matrix = ctx.getTransform();
            const offsetX = matrix.e * pageScale;
            const offsetY = matrix.f * pageScale;
            ctx.putImageData(this._memoryImage, drawBoundary.x * pageScale + offsetX, drawBoundary.y * pageScale - 0.5 + offsetY);
        } else {
            ctx.putImageData(this._memoryImage, drawBoundary.x, drawBoundary.y);
        }
    }

    protected isDrawCancel(geometry: IBaseGeometry, pageScale: number, viewBoundary: Rectangle): boolean {
        return this.isCheckViewBoundary && !geometry.objectInCanvas(pageScale, viewBoundary);
    }

    protected setFrozenGeomLocation(geometry: IBaseGeometry, viewBoundary: Rectangle, isDeep: boolean): void {
        let isSetFrozen = false;

        if ((geometry.frozenTypes & FrozenTypes.Left) !== 0) {
            if (geometry.getCurrentLocation().x < viewBoundary.x) {
                geometry.setCurrentLocation(new Point(viewBoundary.x - ((geometry.frozenLineIndex > 0) ? 0 : geometry.getLocation().x), geometry.getCurrentLocation().y - geometry.getLocation().y));
                isSetFrozen = true;
                geometry.isChanged = true;
            } else {
                geometry.setCurrentLocation(new Point(geometry.getCurrentLocation().x - geometry.getLocation().x, geometry.getCurrentLocation().y - geometry.getLocation().y));
            }
        } else if ((geometry.frozenTypes & FrozenTypes.Right) !== 0) {
            if (geometry.getCurrentLocation().x < viewBoundary.x) {
                geometry.setCurrentLocation(new Point(viewBoundary.x + viewBoundary.width - geometry.getCurrentSize().width - ((geometry.frozenLineIndex > 0) ? 0 : geometry.getLocation().x), geometry.getCurrentLocation().y - geometry.getLocation().y));
                isSetFrozen = true;
                geometry.isChanged = true;
            } else {
                geometry.setCurrentLocation(new Point(geometry.getCurrentLocation().x - geometry.getLocation().x, geometry.getCurrentLocation().y - geometry.getLocation().y));
            }
        }

        if ((geometry.frozenTypes & FrozenTypes.Top) !== 0) {
            if (geometry.getCurrentLocation().y < viewBoundary.y) {
                geometry.setCurrentLocation(new Point(geometry.getCurrentLocation().x - geometry.getLocation().x, viewBoundary.y - ((geometry.frozenLineIndex > 0) ? 0 : geometry.getLocation().y)));
                isSetFrozen = true;
                geometry.isChanged = true;
            } else {
                geometry.setCurrentLocation(new Point(geometry.getCurrentLocation().x - geometry.getLocation().x, geometry.getCurrentLocation().y - geometry.getLocation().y));
            }
        } else if ((geometry.frozenTypes & FrozenTypes.Bottom) !== 0) {
            if (geometry.getCurrentLocation().x < viewBoundary.x) {
                geometry.setCurrentLocation(new Point(geometry.getCurrentLocation().x - geometry.getLocation().x, viewBoundary.y + viewBoundary.height - geometry.getCurrentSize().height - ((geometry.frozenLineIndex > 0) ? 0 : geometry.getLocation().y)));
                isSetFrozen = true;
                geometry.isChanged = true;
            } else {
                geometry.setCurrentLocation(new Point(geometry.getCurrentLocation().x - geometry.getLocation().x, geometry.getCurrentLocation().y - geometry.getLocation().y));
            }
        }

        if (geometry instanceof BaseDrawableObject && isDeep && !isSetFrozen) {
            const childList = (geometry as BaseDrawableObject).getGeomList();

            childList.forEach((child) => {
                this.setFrozenGeomLocation(child, viewBoundary, isDeep);
            });
        }

        this.isChanged = true;
    }

    protected drawNormal(ctx: CanvasRenderingContext2D, geomList: IBaseGeometry[], viewBoundary: Rectangle, isMemoryCache: boolean): void {
        const pageScale = ctx.getTransform().a;
        const count = geomList.length;

        const frozenGeomList: IBaseGeometry[] = [];

        for (let idx = count - 1; idx >= 0; idx--) {
            if (!geomList[idx].visible) continue;

            if (geomList[idx].frozenTypes !== FrozenTypes.None) {
                const rect = ctx.canvas.getBoundingClientRect();
                this.setFrozenGeomLocation(geomList[idx], new Rectangle(rect.x, rect.y, rect.width, rect.height), false);
                continue;
            }

            if (geomList[idx].isForceDraw === false) {
                if (this.isDrawCancel(geomList[idx], pageScale, viewBoundary)) {
                    continue;
                }
            }

            if (geomList[idx] instanceof BaseDrawableObject) {
                this.handleDrawableMouseEvent(geomList[idx] as BaseDrawableObject);
                (geomList[idx] as IDrawable).drawDetail(ctx, pageScale, viewBoundary, isMemoryCache);
            } else {
                (geomList[idx] as IDrawable).draw(ctx);
            }

            geomList[idx].isChanged = false;
        }

        if (frozenGeomList.length > 0) {
            frozenGeomList.forEach((frozenGeom) => {
                if (frozenGeom instanceof BaseDrawableObject) {
                    this.handleDrawableMouseEvent(frozenGeom as BaseDrawableObject);
                    (frozenGeom as IDrawable).drawDetail(ctx, pageScale, viewBoundary, isMemoryCache);
                } else {
                    (frozenGeom as IDrawable).draw(ctx);
                }

                frozenGeom.isChanged = false;
            });
        }
    }

    protected drawImage(ctx: CanvasRenderingContext2D, geomList: IBaseGeometry[], viewBoundary: Rectangle, isMemoryCache: boolean): void {
        const pageScale = ctx.getTransform().a;
        const count = geomList.length;

        for (let idx = count - 1; idx >= 0; idx--) {
            if (!geomList[idx].visible) continue;

            if (geomList[idx].isForceDraw === false) {
                if (this.isDrawCancel(geomList[idx], pageScale, viewBoundary)) {
                    continue;
                }
            }

            if (geomList[idx] instanceof BaseDrawableObject) {
                this.handleDrawableMouseEvent(geomList[idx] as BaseDrawableObject);
                (geomList[idx] as IDrawable).drawDetail(ctx, pageScale, viewBoundary, isMemoryCache);
            } else {
                (geomList[idx] as IDrawable).draw(ctx);
            }

            geomList[idx].isChanged = false;
        }
    }

    private handleDrawableMouseEvent(obj: BaseDrawableObject): void {
        if (obj.isSelected) {
            (obj as IDrawableMouseEvent).onSelected(this, new MouseEvent("Selected"));
        } else if (obj.getIsOvered()) {
            (obj as IDrawableMouseEvent).onMouseHover(this, new MouseEvent("Hover"));
        } else {
            //(obj as IDrawableMouseEvent).onMouseLeave(this, new MouseEvent("Leave"));
        }
    }

    getMaxXInMinBoundary(scalef: number): number {
        if (this.degree !== 0) {
            const rec = this.getRealRectangle();
            return (rec.x + rec.width) * scalef;
        }

        return (this._currentLocation.x + this._size.width) * scalef;
    }

    getMaxYInMinBoundary(scalef: number): number {
        if (this.degree !== 0) {
            const rec = this.getRealRectangle();
            return (rec.y + rec.height) * scalef;
        }

        return (this._currentLocation.y + this._size.height) * scalef;
    }

    addGeomObject(geomObj: IBaseGeometry): void {
        this.addGeomObjectBackground(geomObj, true);
    }

    addGeomObjectBackground(geomObj: IBaseGeometry, isBackground: boolean): void {
        this.isChanged = true;
        this.getDefaultLayer().addGeomObjectBackground(geomObj, this, isBackground);
    }

    insertGeomObject(geomObj: IBaseGeometry, isBackground: boolean, index: number): void {
        this.isChanged = true;
        this.getDefaultLayer().insertGeomObject(geomObj, this, isBackground, index);
    }

    removeGeomObjectKey(key: string): void {
        this.isChanged = true;
        this.getDefaultLayer().removeGeomObjectKey(key);
    }

    removeGeomObject(geomObj: IBaseGeometry): void {
        this.isChanged = true;
        this.getDefaultLayer().removeGeomObject(geomObj);
    }

    clearGeomObject(): void {
        this.isChanged = true;
        this.getDefaultLayer().clearGeomObject();
    }

    getGeomObject(key: string): IBaseGeometry | undefined {
        return this.getDefaultLayer().getGeomObject(key);
    }

    getGeomObjectIndex(key: string): number {
        return this.getDefaultLayer().getGeomObjectIndex(key);
    }

    rotate(degree: number): void {
        this.degree = degree;
        const bounds = this.getBounds();
        this.rotationCenter = new Point(bounds.x + (bounds.width / 2), bounds.y + (bounds.height / 2));
        this.isChanged = true;
    }

    rotateCenter(centerPoint: Point, degree: number): void {
        this.degree = degree;
        this.rotationCenter = centerPoint;
        this.isChanged = true;
    }

    rotateAlign(align: ContentAlignment, degree: number): void {
        this.rotateCenter(this.alignPoint(align), degree);
    }

    protected makeRotateTransform(ctx: CanvasRenderingContext2D): void {
        if (this.degree !== 0) {
            const matrix = ctx.getTransform();

            if (this.isRotationCenter) {
                if (Point.isEmpty(this.rotationCenter)) {
                    const bounds = this.getBounds();
                    const centerX = bounds.x + (bounds.width / 2);
                    const centerY = bounds.y + (bounds.height / 2);
                
                    this.rotationCenter = new Point(centerX, centerY);
                }
            }
            
            ctx.setTransform(matrix.translate(this.rotationCenter.x, this.rotationCenter.y).rotate(this.degree).translate(-this.rotationCenter.x, -this.rotationCenter.y));
        }
    }

    intersectsWith(rectangle: Rectangle): boolean {
        let pointArray = DrawableUtil.getVertex(this.getBounds());
        
        if (this.parentGeometry.degree + this.degree !== 0) {
            pointArray = DrawableUtil.transformPoints(pointArray, this.degree, this.rotationCenter);
        }

        if (DrawableUtil.isContainRectangle(pointArray, rectangle)) {
            return true;
        }

        return false;
    }

    updateMBR(): void {
        const geomList = this.getGeomList();
        if (geomList.length === 0) return;

        let tempLocation = new Point(0, 0);

        if (!Point.isEmpty(this._location)) {
            tempLocation = this._location;
            this.setLocation(Point.empty());
        }

        let boundary = new Rectangle(0, 0, 0, 0);
        let geom;
        for (let i = 0; i < geomList.length; i++) {
            geom = geomList[i];
            if (geom.visible) {
                const itemBoundary = geom.getMBR();
                if (itemBoundary.equal(Rectangle.empty())) continue;
                boundary = Rectangle.union(boundary, itemBoundary);
            }
        }

        boundary.width += this.padding.right;
        boundary.height += this.padding.bottom;

        this._currentLocation = new Point(boundary.x, boundary.y);
        this._currentSize = new Size(boundary.width, boundary.height);

        this._location = this._currentLocation;
        this._size = this._currentSize;

        if (!Point.isEmpty(tempLocation)) {
            this.setLocation(tempLocation);
        }
        this.isChanged = true;
    }

    updateSize(): void {
        const geomList = this.getGeomList();
        if (geomList.length === 0) return;

        let boundary = new Rectangle(this._currentLocation.x, this._currentLocation.y, 0, 0);
        let geom;
        for (let i = 0; i < geomList.length; i++) {
            geom = geomList[i];
            if (geom.visible) {
                const itemBoundary = geom.getMBR();
                if (itemBoundary.equal(Rectangle.empty())) continue;
                boundary = Rectangle.union(boundary, itemBoundary);
            }
        }

        boundary.width += this.padding.right;
        boundary.height += this.padding.bottom;

        this._currentSize = new Size(boundary.width, boundary.height);
        this._size = this._currentSize;
        this.isChanged = true;
    }

    getDrawableObject(point: Point): IBaseGeometry {
        const geomList = this.getGeomList();
        if (geomList.length === 0) return this;

        let geom;
        let n;
        for (let i = 0; i < geomList.length; i++) {
            geom = geomList[i];
            if (geom instanceof BaseDraw) continue;
            if ((geom as IDrawableGeometry).isBackground) continue;
            if (geom instanceof BaseDrawableObject) {
                n = (geom as IDrawableGeometry).hitTest(point);
                if (n >= 0) {
                    return geom;
                }
            }
        }

        return this;
    }

    protected getRealLocation(point: Point): Point {
        return new Point(this._currentLocation.x + point.x, this._currentLocation.y + point.y);
    }

    moveFirst(pGeometry: IBaseGeometry): boolean {
        this.isChanged = true;
        return this.getDefaultLayer().moveFirst(pGeometry);
    }

    moveFirstKey(key: string): boolean {
        this.isChanged = true;
        return this.getDefaultLayer().moveFirstKey(key);
    }

    moveLast(pGeometry: IBaseGeometry): boolean {
        this.isChanged = true;
        return this.getDefaultLayer().moveLast(pGeometry);
    }

    moveLastKey(key: string): boolean {
        this.isChanged = true;
        return this.getDefaultLayer().moveLastKey(key);
    }

    moveToIndex(pGeometry: IBaseGeometry, index: number): boolean {
        this.isChanged = true;
        return this.getDefaultLayer().moveToIndex(pGeometry, index);
    }

    moveToIndexKey(key: string, index: number): boolean {
        this.isChanged = true;
        return this.getDefaultLayer().moveToIndexKey(key, index);
    }

    find(key: string): IBaseGeometry | undefined {
        return this.getGeomObject(key);
    }

    findList(point: Point): BaseGeometry[] {
        const geomList: BaseGeometry[] = [];
        const geomListAll = this.getGeometryAll();
        geomListAll.forEach(element => {
            if (element instanceof BaseGeometry) {
                if ((element as BaseGeometry).pointInObject(point)) {
                    geomList.push(element);
                }
            }
        });

        return geomList;
    }

    findAtBoundary(boundary: Rectangle): BaseGeometry[] {
        const geomList: BaseGeometry[] = [];
        const geomListAll = this.getGeometryAll();
        geomListAll.forEach(element => {
            if (element instanceof BaseGeometry) {
                if ((element as BaseGeometry).objectInCanvas(1, boundary)) {
                    geomList.push(element);
                }
            }
        });

        return geomList;
    }

    contains(point: Point): boolean {
        const geomList = this.getGeomList();
        if (geomList.length === 0) return false;

        geomList.forEach(element => {
            if (element instanceof BaseGeometry) {
                if ((element as BaseGeometry).pointInObject(point)) {
                    return true;
                }
            }
        });

        return false;
    }

    containsAtMBR(point: Point): boolean {
        return this.getBounds().containsPoint(point);
    }

    containsAtMBRAtBoundary(boundary: Rectangle): number {
        let returnValue = 0;
        const currentBoundary = this.getBounds();
        if (currentBoundary.containsRectangle(boundary)) {
            returnValue = 1;
        } else if (boundary.containsRectangle(currentBoundary)) {
            returnValue = -1;
        } else if (currentBoundary.intersectsWith(boundary)) {
            returnValue = 2;
        }

        return returnValue;
    }

    getGeometryAll(): IBaseGeometry[] {
        const list: IBaseGeometry[] = [];
        let tempList: IBaseGeometry[] = [];
        const geomList: IBaseGeometry[] = this.getGeomList();

        geomList.forEach(element => {
            if (element instanceof BaseDrawableObject) {
                tempList = this.getSubGeometryAll(element as BaseDrawableObject);
                
                if (tempList.length > 0) {
                    list.push(...tempList);
                }

                list.push(element);
            }
        });

        return list;
    }

    getSubGeometryAll(pDrawableObj: BaseDrawableObject): IBaseGeometry[] {
        const list: IBaseGeometry[] = [];
        const subList = pDrawableObj.getGeomList();
        
        subList.forEach(element => {
            if (element instanceof BaseDrawableObject) {
                const tempDrawObj = element as BaseDrawableObject;
                const tempList = this.getSubGeometryAll(tempDrawObj);

                if (tempList.length > 0) {
                    list.push(...tempList);
                }

                list.push(tempDrawObj);
            }
        });

        return list;
    }

    private getImage(pageScale: number, ctx: CanvasRenderingContext2D): ImageData {
        let imageData = new ImageData(0, 0);
        
        if (!this._memoryImage) {
            const rect = this.getRealRectangle();

            if (this.imagePadding.equal(Padding.Empty)) {
                imageData = ctx.getImageData(0, 0, rect.width * pageScale + 1.5, rect.height * pageScale + 1.5);
            } else {
                const paddingWidth = this.imagePadding.left + this.imagePadding.right + 1;
                const paddingHeight = this.imagePadding.top + this.imagePadding.bottom + 1;
                imageData = ctx.getImageData(0, 0, rect.width * pageScale + paddingWidth, rect.height * pageScale + paddingHeight);
            }

            if (this.removeWhiteSpaceOfImage) {
                const length = imageData.data.length;
                for(let i = 3; i < length; i += 4){  
                    imageData.data[i] = 50;
                }
            }
        } else {
            if (this._memoryImage) {
                imageData = this._memoryImage;
            }
        }

        return imageData;
    }

    public clearMemoryCache(): void {
        if (this.isAlreadyClearMemoryCache) return;

        if (this._memoryImage) this._memoryImage = new ImageData(0, 0);

        const list = this.getGeomList();
        list.forEach(element => {
            element.isChanged = true;

            if (element instanceof BaseDrawableObject) {
                (element as BaseDrawableObject).clearMemoryCache();
            }
        });

        this.isAlreadyClearMemoryCache = true;
        this.isChanged = true;
    }

    // public getBitmap(zoomPercent: number): ImageData {
    //     const rectangle = this.getRealRectangle();
    //     return this.getBitmapSize(rectangle.width * zoomPercent / 100, rectangle.height * zoomPercent / 100);
    // }

    abstract drawGeometry(ctx: CanvasRenderingContext2D): void;
    abstract drawGeometryCache(ctx: CanvasRenderingContext2D, pageScale: number, viewBoundary: Rectangle, isMemoryCache: boolean): void;    
    abstract getGeomList(): IBaseGeometry[];
    abstract getGeomListByMember(memberName: string): IBaseGeometry[];
    protected abstract getDefaultLayer(): GeometryLayer;
    protected abstract calculateAncher(): void;
    abstract onMouseDown(sender: any, event: MouseEvent): void;
    abstract onMouseMove(sender: any, event: MouseEvent): void;
    abstract onMouseUp(sender: any, event: MouseEvent): void;
    abstract onSelected(sender: any, event: MouseEvent): void;
    abstract onMouseHover(sender: any, event: MouseEvent): void;
    abstract onMouseLeave(sender: any, event: MouseEvent): void;
    abstract onMouseClick(sender: any, event: MouseEvent): void;
    abstract onResize(sender: any, event: MouseEvent): void;
    onResizeBegin(sender: any, event: MouseEvent): void {
        return;
    }
    onResizeEnd(sender: any, event: MouseEvent): void {
        if (this.degree !== 0) {
            //영역의 중심을 축으로 회전하는 경우 크기 변화에 따라 중심 축의 위치를 변경해야 한다.
            const rotationCenter = new Point(0, 0);
            const bounds = new Rectangle(0, 0, 0, 0);

            const flag = this.calculatedRotationCenter(rotationCenter, bounds);
            if (flag) {
                this.rotationCenter = rotationCenter;
                this.setCurrentLocation(new Point(bounds.x, bounds.y));
                this._currentSize = new Size(bounds.width, bounds.height);
            }
        }
    }
    onMoveBegin(sender: any, event: MouseEvent): void {}
    onMouseEnd(sender: any, event: MouseEvent): void {}
}

export default BaseDrawableObject;