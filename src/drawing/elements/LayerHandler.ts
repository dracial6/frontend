import LayerUtil from "../../utils/LayerUtil";
import { DisplayLayer } from "../structures";
import BaseDrawableObject from "./BaseDrawableObject";
import GeometryLayer from "./GeometryLayer";
import IBaseGeometry from "./IBaseGeometry";

class LayerHandler {
    private _layerList = new Map<DisplayLayer, GeometryLayer>();

    addLayer(layer: GeometryLayer, displayLayer: DisplayLayer): void {
        this._layerList.set(displayLayer, layer);
        this._layerList = new Map([...Array.from(this._layerList.entries())].sort());
    }

    removeLayer(displayLayer: DisplayLayer): void {
        this._layerList.delete(displayLayer);
    }

    addGeomObject(geomObj: IBaseGeometry, parentGeom: BaseDrawableObject, displayLayer: DisplayLayer): void {
        const list = this.getGeometryList(displayLayer);
        list.addGeomObject(geomObj, parentGeom);
    }

    addGeomObjectBackground(geomObj: IBaseGeometry, parentGeom: BaseDrawableObject, displayLayer: DisplayLayer, isBackground: boolean): void {
        const list = this.getGeometryList(displayLayer);
        list.addGeomObjectBackground(geomObj, parentGeom, isBackground);
    }

    insertGeomObject(geomObj: IBaseGeometry, parentGeom: BaseDrawableObject, displayLayer: DisplayLayer, isBackground: boolean, index: number): void {
        const list = this.getGeometryList(displayLayer);
        list.insertGeomObject(geomObj, parentGeom, isBackground, index);
    }

    removeGeomObjectKey(key: string, displayLayer: DisplayLayer): void {
        const list = this.getGeometryList(displayLayer);
        list.removeGeomObjectKey(key);
    }

    removeGeomObject(geomObj: IBaseGeometry, displayLayer: DisplayLayer): void {
        const list = this.getGeometryList(displayLayer);
        list.removeGeomObject(geomObj);
    }

    clearGeomObject(displayLayer: DisplayLayer): void {
        const list = this.getGeometryList(displayLayer);
        list.clearGeomObject();
    }

    getGeomObject(key: string, displayLayer: DisplayLayer): IBaseGeometry | undefined {
        const list = this.getGeometryList(displayLayer);
        return list.getGeomObject(key);
    }

    getGeomObjectIndex(key: string, displayLayer: DisplayLayer): number {
        const list = this.getGeometryList(displayLayer);
        return list.getGeomObjectIndex(key);
    }

    getGeomList(displayLayer: DisplayLayer): IBaseGeometry[] {
        const list = this.getGeometryList(displayLayer);
        return list.getGeomList();
    }

    getGeomListAll(hiddenLayer: DisplayLayer | undefined): IBaseGeometry[] {
        if (this._layerList.size === 1) {
            return Array.from(this._layerList.values())[0].getGeomList();
        }

        const list: IBaseGeometry[] = [];
        const keys = this.getReverseLayerKeys(hiddenLayer);
        keys.forEach(key => {
            if (this._layerList.has(key)) {
                list.push(...(this._layerList.get(key) as GeometryLayer).getGeomList());
            }
        });
        
        return list;
    }

    getGeomListAllType(hiddenLayer: DisplayLayer | undefined, memberName: string): IBaseGeometry[] {
        if (this._layerList.size === 1) {
            return Array.from(this._layerList.values())[0].getGeomListType(memberName);
        }

        const list: IBaseGeometry[] = [];
        const keys = this.getReverseLayerKeys(hiddenLayer);
        keys.forEach(key => {
            if (this._layerList.has(key)) {
                list.push(...(this._layerList.get(key) as GeometryLayer).getGeomListType(memberName));
            }
        });
        
        return list;
    }

    getGeometryList(displayLayer: DisplayLayer): GeometryLayer {
        if (this._layerList.has(displayLayer)) return this._layerList.get(displayLayer) as GeometryLayer;

        const layer = new GeometryLayer();
        this._layerList.set(displayLayer, layer);
        
        return layer;
    }

    clearLayer(): void {
        if (this._layerList.size === 1) Array.from(this._layerList.values())[0].clearGeomObject();

        Array.from(this._layerList.keys()).forEach(layer => {
            if (this._layerList.has(layer)) {
                (this._layerList.get(layer) as GeometryLayer).clearGeomObject();
            }
        });

        this._layerList.clear();
    }

    getLayerKeys(hiddenLayer: DisplayLayer | undefined): DisplayLayer[] {
        return LayerUtil.getLayerKeys(Array.from(this._layerList.keys()), hiddenLayer);
    }

    getReverseLayerKeys(hiddenLayer: DisplayLayer | undefined): DisplayLayer[] {
        return LayerUtil.getReverseLayerKeys(Array.from(this._layerList.keys()), hiddenLayer);
    }
}

export default LayerHandler;