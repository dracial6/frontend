import SearchUtil from "../utils/SearchUtil";
import BaseDrawArea from "./BaseDrawArea";
import BaseDrawableObject from "./elements/BaseDrawableObject";
import BaseGeometry from "./elements/BaseGeometry";
import DrawLayer from "./elements/DrawLayer";
import GeometryObject from "./elements/GeometryObject";
import IBaseGeometry from "./elements/IBaseGeometry";
import IDragable from "./elements/IDragable";
import IDrawableGeometry from "./elements/IDrawableGeometry";
import IDrawableMouseEvent from "./elements/IDrawableMouseEvent";
import { Point, Rectangle, Size } from "./structures";

abstract class BaseDrawableList {
    private _pageScale = 1;
    private _cachedMaxPoint = Point.Empty();

    isBringToTop: boolean;
    viewBoundary = Rectangle.Empty();

    constructor(isBringToTop: boolean) {
        this.isBringToTop = isBringToTop;
    }

    draw(ctx: CanvasRenderingContext2D, drawArea: BaseDrawArea): void {
        if (!this.getDefaultDrawLayer()) return;
        
        this._pageScale = ctx.getTransform().a;

        this.drawNormal(ctx, drawArea);
        this.drawSelectedMarkForIDragable(ctx, drawArea);
    }

    drawGeometry(ctx: CanvasRenderingContext2D, drawArea: BaseDrawArea, list: IDrawableGeometry[]) {
        let obj: IDrawableGeometry;
        const pageScale = ctx.getTransform().a;
        for (let i = list.length - 1; i >= 0; i--) {
            let drawableObj: BaseDrawableObject | undefined;
            obj = list[i];
            if (!obj.visible) continue;
            if (obj instanceof BaseDrawableObject) drawableObj = obj as BaseDrawableObject;

            if (!obj.objectInCanvas(pageScale, this.viewBoundary)) {
                continue;
            }

            this.handleDrawableMouseEvent(obj);

            if (drawableObj) {
                obj.drawDetail(ctx, pageScale, this.viewBoundary, drawableObj.isMemoryCache);
            } else {
                obj.draw(ctx);
            }

            this.drawSelectionTracker(ctx, obj, drawArea.isDrawableObjectResize, drawArea.isDrawableObjectMove);

            if (drawArea.isDrawableMemoryCache && !obj.getIsOvered() && !obj.isSelected) {
                obj.isSelected = false;
            }
        }
    }

    private handleDrawableMouseEvent(obj: IDrawableGeometry): void {
        if (obj.isSelected) {
            (obj as unknown as IDrawableMouseEvent).onSelected(undefined, new MouseEvent("onSelected"));
        } else if (obj.getIsOvered()) {
            (obj as unknown as IDrawableMouseEvent).onMouseHover(undefined, new MouseEvent("onMouseHover"));
        } else {
            //(obj as unknown as IDrawableMouseEvent).onMouseLeave(undefined, new MouseEvent("onMouseLeave"));
        }
    }

    private drawSelectedMarkForIDragable(ctx: CanvasRenderingContext2D, baseDrawArea: BaseDrawArea): void {
        const dragableList = this.getGeometryList("isDragable", true, true);
        let flag = false;

        if (baseDrawArea.getAllowDragAtDrawControl() && !baseDrawArea.isChildDrawableObjectSelect) {
            flag = true;
        } else if (!baseDrawArea.getAllowDragAtDrawControl() && baseDrawArea.isChildDrawableObjectSelect) {
            flag = false;
        }

        if (dragableList.length > 0) {
            let geometry;
            
            dragableList.forEach(element => {
                const dragableObj = element as unknown as IDragable;
                if (dragableObj && dragableObj.isDragable === flag && element.isSelected) {
                    element.drawTracker(ctx, false);
                }
            });
        }
    }

    private drawSelectionTracker(ctx: CanvasRenderingContext2D, obj: IDrawableGeometry, isResize: boolean, isMove: boolean): void {
        if (obj.isSelected) {
            if (isResize) {
                if (obj.enableResizable) {
                    obj.drawTracker(ctx, isResize);
                } else {
                    obj.drawTracker(ctx, false);
                }
            } else if (isMove) {
                obj.drawTracker(ctx, false);
            }
        }
    }

    add(obj: IDrawableGeometry): void {
        this.getDefaultDrawLayer().add(obj);
    }

    addCheckDuplication(obj: IDrawableGeometry, checkDuplication: boolean): void {
        this.getDefaultDrawLayer().addCheckDuplication(obj, checkDuplication);
    }

    update(obj: IDrawableGeometry): void {
        this.getDefaultDrawLayer().update(obj);
    }

    getIndex(obj: IDrawableGeometry): number {
        return this.getDefaultDrawLayer().getIndex(obj);
    }

    getIndexKey(key: string): number {
        return this.getDefaultDrawLayer().getIndexKey(key);
    }

    insert(index: number, obj: IDrawableGeometry): void {
        this.getDefaultDrawLayer().insert(index, obj);
    }

    remove(obj: IDrawableGeometry): void {
        this.getDefaultDrawLayer().remove(obj);
    }

    removeKey(key: string): void {
        this.getDefaultDrawLayer().removeKey(key);
    }

    select(geometry: IDrawableGeometry): void {
        if (this.invalidateCheckObject(geometry)) return;

        this.unSelectAll();
    }

    unSelectAll(): void {
        if (this.invalidateDrawList()) return;

        const list = this.getDrawObjectAll();

        list.forEach(element => {
            element.isSelected = false;
        });
    }

    selectAll(): void {
        if (this.invalidateDrawList()) return;

        const list = this.getDrawObjectAll();

        list.forEach(element => {
            element.isSelected = true;
        });
    }

    unOverAll(): void {
        if (this.invalidateDrawList()) return;

        const list = this.getDrawObjectAll();

        list.forEach(element => {
            element.setIsOvered(false);
        });
    }

    unOverGeometryObjectAll(): void {
        if (this.invalidateDrawList()) return;

        const list = this.getDrawList();

        list.forEach(element => {
            if (element instanceof GeometryObject && element.getIsOvered()) {
                element.setIsOvered(false);
            }
        });
    }

    getDragableList(): IDrawableGeometry[] {
        const dragableList = this.getGeometryList("isDragable", true, true);
        const returnList: IDrawableGeometry[] = [];

        if (dragableList.length > 0) {
            dragableList.forEach(element => {
                const dragableObj = element as unknown as IDragable;
                if (dragableObj && dragableObj.isDragable) {
                    returnList.push(element);
                }
            });
        }

        return returnList;
    }

    findFirstByKey(key: string): IBaseGeometry | undefined {
        if (this.invalidateDrawList()) return undefined;

        const drawList = this.getDrawList();

        for (let i = 0; i < drawList.length; i++) {
            const item = drawList[i];

            if (item.name === key) {
                return item;
            } else {
                if (!(item instanceof BaseDrawableObject)) continue;
                const geometry = (item as BaseDrawableObject).getGeomObject(key);
                if (geometry) {
                    return geometry;
                }
            }
        }
    }

    findAllByKey(key: string): IBaseGeometry[] {
        const returnList: IBaseGeometry[] = [];

        if (this.invalidateDrawList()) return returnList;

        const drawList = this.getDrawList();

        for (let i = 0; i < drawList.length; i++) {
            const item = drawList[i];

            if (item.name === key) {
                returnList.push(item);
            } else {
                if (!(item instanceof BaseDrawableObject)) continue;
                const geometry = (item as BaseDrawableObject).getGeomObject(key);
                if (geometry) {
                    returnList.push(geometry);
                }
            }
        }

        return returnList;
    }

    findAtPoint(point: Point): IBaseGeometry[] {
        const returnList: IBaseGeometry[] = [];

        if (this.invalidateDrawList()) return returnList;

        const drawList = this.getDrawList();

        for (let i = 0; i < drawList.length; i++) {
            const item = drawList[i];
            if (!(item instanceof BaseDrawableObject)) continue;

            if (item.hitTest(point) >= 0) {
                returnList.push(item);
            }
        }

        return returnList;
    }

    findAllAtPoint(point: Point): IDrawableGeometry[] {
        const returnList: IDrawableGeometry[] = [];

        if (this.invalidateDrawList()) return returnList;

        const drawList = this.getDrawList();

        for (let i = 0; i < drawList.length; i++) {
            const item = drawList[i];
            if (!(item instanceof BaseDrawableObject)) continue;

            if (item.hitTest(point) >= 0) {
                returnList.push(item);
            }

            const geomList = (item as BaseDrawableObject).getGeomList();
            for (let j = 0; j < geomList.length; j++) {
                const geometry = geomList[j];
                if(!(geometry instanceof BaseDrawableObject)) continue;
                if(geometry.hitTest(point) >= 0) {
                    returnList.push(geometry);
                }
            }
        }

        return returnList;
    }

    findAllAtBoundary(boundary: Rectangle, pageScale: number): IDrawableGeometry[] {
        const returnList: IDrawableGeometry[] = [];

        if (this.invalidateDrawList()) return returnList;

        const drawList = this.getDrawList();

        for (let i = 0; i < drawList.length; i++) {
            const item = drawList[i];
            if (!(item instanceof BaseDrawableObject)) continue;
            if (item.objectInCanvas(pageScale, boundary)) {
                returnList.push(item);
            }

            const geomList = (item as BaseDrawableObject).getGeomList();
            for (let j = 0; j < geomList.length; j++) {
                const geometry = geomList[j];
                if(!(geometry instanceof BaseDrawableObject)) continue;
                if(geometry.objectInCanvas(pageScale, boundary)) {
                    returnList.push(geometry);
                }
            }
        }

        return returnList;
    }

    findAtBoundary(boundary: Rectangle, pageScale: number): IDrawableGeometry[] {
        const returnList: IDrawableGeometry[] = [];

        if (this.invalidateDrawList()) return returnList;

        const drawList = this.getDrawList();

        for (let i = 0; i < drawList.length; i++) {
            const item = drawList[i];
            if (!(item instanceof BaseDrawableObject)) continue;
            if (item.objectInCanvas(pageScale, boundary)) {
                returnList.push(item);
            }
        }

        return returnList;
    }
    
    findSelection(): IDrawableGeometry[] {
        const drawList = this.getDrawList();
        const returnList: IDrawableGeometry[] = [];

        drawList.forEach(element => {
            if (element.isSelected) {
                returnList.push(element);
            }
        });

        return returnList;
    }

    findDrawableObjects(): IDrawableGeometry[] {
        const returnList: IDrawableGeometry[] = [];

        if (this.invalidateDrawList()) return returnList;

        const drawList = this.getDrawList();

        for (let i = 0; i < drawList.length; i++) {
            const item = drawList[i];
            if (!(item instanceof BaseDrawableObject)) continue;
            returnList.push(item);

            // const geomList = (item as BaseDrawableObject).getGeomList();
            // for (let j = 0; j < geomList.length; j++) {
            //     const geometry = geomList[j];
            //     if(!(geometry instanceof BaseDrawableObject)) continue;
            //     returnList.push(geometry);
            // }
        }

        return returnList;
    }

    getGeometryList(memberName: string, visible: boolean | undefined, deepSearch: boolean) {
        return SearchUtil.getGeometryListByType(this.getDrawList(), memberName, visible, deepSearch, undefined);
    }
    
    getDrawObjectAll(): IDrawableGeometry[] {
        return SearchUtil.getGeometryListByType(this.getDrawList(), "isSelected", undefined, true, undefined);
    }

    getDrawObjectAllVisible(visible: boolean): IDrawableGeometry[] {
        return SearchUtil.getGeometryListByType(this.getDrawList(), "isSelected", visible, true, undefined);
    }

    moveGeometry(deltaPoint: Point): void {
        if (this.invalidateDrawList()) return;

        const list = this.findSelection();

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!item.enableMove) {
                continue;
            }

            item.move(deltaPoint.x, deltaPoint.y);
        }
    }

    getMaxPoint(pageScale: number): Point {
        if (this.invalidateDrawList()) Point.Empty();

        const list = this.getDrawList();
        let maxX = 0;
        let maxY = 0;

        for (let i = list.length - 1; i >= 0; i--) {
            const item = list[i];

            if (item.visible) continue;

            const x = item.getMaxXInMinBoundary(pageScale);
            if (maxX < x) {
                maxX = x
            }

            const y = item.getMaxYInMinBoundary(pageScale);
            if (maxY < y) {
                maxY = y;
            }
        }

        return new Point(maxX, maxY);
    }

    abstract clear(): void;
    abstract clearDrawableObject(): void;
    abstract clearMemoryCache(): void;
    abstract getDrawList(): IDrawableGeometry[];
    abstract getDrawListAtEventHandle(): IDrawableGeometry[];

    abstract moveSelectionToTop(): boolean;
    abstract moveObjToForward(geometry: IDrawableGeometry): boolean;    
    abstract moveObjsToForward(list: IDrawableGeometry[]): boolean;
    abstract moveSelectionToBottom(): boolean;
    abstract moveToTop(key: string): boolean;
    abstract moveToBottom(key: string): boolean;
    abstract moveToIndex(key: string, index: number): boolean;

    protected abstract drawNormal(ctx: CanvasRenderingContext2D, drawArea: BaseDrawArea): void;
    protected abstract getDefaultDrawLayer(): DrawLayer;
    protected abstract invalidateDrawList(): boolean;
    protected abstract invalidateCheckObject(obj: IDrawableGeometry): boolean;
}

export default BaseDrawableList;