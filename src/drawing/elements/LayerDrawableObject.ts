import DrawableUtil from "../../utils/DrawableUtil";
import { DisplayLayer, Rectangle } from "../structures";
import BaseDrawableObject from "./BaseDrawableObject";
import GeometryLayer from "./GeometryLayer";
import IBaseGeometry from "./IBaseGeometry";
import LayerHandler from "./LayerHandler";

class LayerDrawableObject extends BaseDrawableObject {
    private _layerHandler = new LayerHandler();

    hiddenLayer?: DisplayLayer;

    constructor(name: string) {
        super(name);
    }

    private getGeometryLayer(displayLayer: DisplayLayer): GeometryLayer {
        return this._layerHandler.getGeometryList(displayLayer);
    }

    drawGeometry(ctx: CanvasRenderingContext2D): void {
        const layerKeys = this._layerHandler.getLayerKeys(this.hiddenLayer);
        layerKeys.forEach(key => {
            const geomList = this.getGeometryLayer(key).getGeomList();
            const count = geomList.length;

            for (const obj of geomList) {
                if (!obj.visible) continue;
                obj.draw(ctx);
            }
        });
    }

    drawGeometryCache(ctx: CanvasRenderingContext2D, pageScale: number, viewBoundary: Rectangle, isMemoryCache: boolean): void {
        const layerKeys = this._layerHandler.getLayerKeys(this.hiddenLayer);

        layerKeys.forEach(key => {
            const geomList = this.getGeometryLayer(key).getGeomList();

            if (!isMemoryCache) {
                this.drawNormal(ctx, geomList, viewBoundary, isMemoryCache);
            } else {
                this.drawImage(ctx, geomList, viewBoundary, isMemoryCache);
            }
        });
    }

    addLayer(layer: GeometryLayer, displayLayer: DisplayLayer): void {
        this._layerHandler.addLayer(layer, displayLayer);
    }

    removeLayer(displayLayer: DisplayLayer): void {
        this._layerHandler.removeLayer(displayLayer);
    }

    addGeomObjectLayer(geomObj: IBaseGeometry, displayLayer: DisplayLayer): void {
        this.addGeomObjectLayerBackground(geomObj, true, displayLayer);
    }

    addGeomObjectLayerBackground(geomObj: IBaseGeometry, isBackground: boolean, displayLayer: DisplayLayer): void {
        this.getGeometryLayer(displayLayer).addGeomObjectBackground(geomObj, this, isBackground);
    }

    insertGeomObjectLayer(geomObj: IBaseGeometry, isBackground: boolean, index: number, displayLayer: DisplayLayer): void {
        this.getGeometryLayer(displayLayer).insertGeomObject(geomObj, this, isBackground, index);
    }

    removeGeomObjectLayerKey(key: string, displayLayer: DisplayLayer): void {
        this.getGeometryLayer(displayLayer).removeGeomObjectKey(key);
    }

    removeGeomObjectLayer(displayLayer: DisplayLayer): void {
        this.getGeometryLayer(displayLayer).clearGeomObject();
    }

    clearGeomObjectLayer(displayLayer: DisplayLayer): void {
        this.getGeometryLayer(displayLayer).clearGeomObject();
    }

    clearGeomObjectAll(): void {
        this._layerHandler.clearLayer();
    }

    getGeomObjectLayer(key: string, displayLayer: DisplayLayer): IBaseGeometry | undefined {
        return this.getGeometryLayer(displayLayer).getGeomObject(key);
    }

    getGeomObjectIndexLayer(key: string, displayLayer: DisplayLayer): number {
        return this.getGeometryLayer(displayLayer).getGeomObjectIndex(key);
    }

    getGeomList(): IBaseGeometry[] {
        return this._layerHandler.getGeomListAll(this.hiddenLayer);
    }

    getGeomListLayer(displayLayer: DisplayLayer): IBaseGeometry[] {
        return this.getGeometryLayer(displayLayer).getGeomList();
    }

    getGeomListByMemberLayer(memberName: string, displayLayer: DisplayLayer): IBaseGeometry[] {
        return this.getGeometryLayer(displayLayer).getGeomListType(memberName);
    }

    private getGeomListAll(): IBaseGeometry[] {
        return this._layerHandler.getGeomListAll(undefined);
    }

    getGeomListByMember(memberName: string): IBaseGeometry[] {
        return this._layerHandler.getGeomListAllType(this.hiddenLayer, memberName);
    }

    protected getDefaultLayer(): GeometryLayer {
        return this._layerHandler.getGeometryList(DisplayLayer.One);
    }

    moveFirstLayer(geom: IBaseGeometry, displayLayer: DisplayLayer): boolean {
        return this.getGeometryLayer(displayLayer).moveFirst(geom);
    }

    moveFirstKeyLayer(key: string, displayLayer: DisplayLayer): boolean {
        return this.getGeometryLayer(displayLayer).moveFirstKey(key);
    }

    moveLastLayer(geom: IBaseGeometry, displayLayer: DisplayLayer): boolean {
        return this.getGeometryLayer(displayLayer).moveLast(geom);
    }

    moveLastKeyLayer(key: string, displayLayer: DisplayLayer): boolean {
        return this.getGeometryLayer(displayLayer).moveLastKey(key);
    }

    moveToIndexLayer(geom: IBaseGeometry, index: number, displayLayer: DisplayLayer): boolean {
        return this.moveToIndexKeyLayer(geom.name, index, displayLayer);
    }

    moveToIndexKeyLayer(key: string, index: number, displayLayer: DisplayLayer): boolean {
        return this.getGeometryLayer(displayLayer).moveToIndexKey(key, index);
    }

    protected calculateAncher(): void {
        const geomList = this.getGeomListAll();

        geomList.forEach(element => {
            DrawableUtil.calculateAncher(this, element);
        });
    }

    onMouseDown(sender: any, event: MouseEvent): void {
        
    }
    onMouseMove(sender: any, event: MouseEvent): void {
        
    }
    onMouseUp(sender: any, event: MouseEvent): void {
        
    }
    onSelected(sender: any, event: MouseEvent): void {
        
    }
    onMouseHover(sender: any, event: MouseEvent): void {
        
    }
    onMouseLeave(sender: any, event: MouseEvent): void {
        
    }
    onMouseClick(sender: any, event: MouseEvent): void {
        
    }
    onResize(sender: any, event: MouseEvent): void {
        
    }
}

export default LayerDrawableObject;