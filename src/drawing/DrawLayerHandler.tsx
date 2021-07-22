import LayerUtil from "../utils/LayerUtil";
import SearchUtil from "../utils/SearchUtil";
import BaseDrawableObject from "./elements/BaseDrawableObject";
import DrawLayer from "./elements/DrawLayer";
import IDrawableGeometry from "./elements/IDrawableGeometry";
import { DisplayLayer } from "./structures";

class DrawLayerHandler {
    private _sortedLayerMap = new Map<DisplayLayer, DrawLayer>();

    addLayer(layer: DrawLayer, displayLayer: DisplayLayer): void {
        this._sortedLayerMap.set(displayLayer, layer);
    }

    removeLayer(displayLayer: DisplayLayer): void {
        if (this._sortedLayerMap.get(displayLayer)) {
            this._sortedLayerMap.delete(displayLayer);
        }
    }

    add(obj: IDrawableGeometry, displayLayer: DisplayLayer): void {
        this.getDrawLayer(displayLayer).add(obj);
    }

    addCheckDuplication(obj: IDrawableGeometry, checkDuplication: boolean, displayLayer: DisplayLayer): void {
        this.getDrawLayer(displayLayer).addCheckDuplication(obj, checkDuplication);
    }

    update(obj: IDrawableGeometry, displayLayer: DisplayLayer): void {
        this.getDrawLayer(displayLayer).update(obj);
    }

    getIndex(obj: IDrawableGeometry, displayLayer: DisplayLayer): number {
        return this.getDrawLayer(displayLayer).getIndex(obj);
    }

    getIndexKey(key: string, displayLayer: DisplayLayer): number {
        return this.getDrawLayer(displayLayer).getIndexKey(key);
    }

    insert(index: number, obj: IDrawableGeometry, displayLayer: DisplayLayer): void {
        this.getDrawLayer(displayLayer).insert(index, obj);
    }

    removeAt(index: number, displayLayer: DisplayLayer): void {
        this.getDrawLayer(displayLayer).removeAt(index);
    }

    removeKey(key: string, displayLayer: DisplayLayer): void {
        this.getDrawLayer(displayLayer).removeKey(key);
    }

    moveSelectionToTop(hiddenLayer?: DisplayLayer): boolean {
        let returnValue = false;
        if (this._sortedLayerMap.size === 0) return returnValue;

        const keys = this.getDrawLayerKeys(hiddenLayer);

        for (let i = 0; i < keys.length; i++) {
            if (this.getDrawLayer(keys[i]).moveSelectionToTop()) {
                returnValue = true;
                break;
            }
        }

        return returnValue;
    }


    moveSelectionToBottom(hiddenLayer?: DisplayLayer): boolean {
        let returnValue = false;
        if (this._sortedLayerMap.size === 0) return returnValue;

        const keys = this.getDrawLayerKeys(hiddenLayer);

        for (let i = 0; i < keys.length; i++) {
            if (this.getDrawLayer(keys[i]).moveSelectionToBottom()) {
                returnValue = true;
                break;
            }
        }

        return returnValue;
    }

    moveObjToForward(geometry: IDrawableGeometry, hiddenLayer?: DisplayLayer): boolean {
        let returnValue = false;
        if (this._sortedLayerMap.size === 0) return returnValue;

        const keys = this.getDrawLayerKeys(hiddenLayer);

        for (let i = 0; i < keys.length; i++) {
            if (this.getDrawLayer(keys[i]).moveObjToForward(geometry)) {
                returnValue = true;
                break;
            }
        }

        return returnValue;
    }

    moveObjsToForward(geomList: IDrawableGeometry[], hiddenLayer?: DisplayLayer): boolean {
        let returnValue = false;
        if (this._sortedLayerMap.size === 0) return returnValue;

        const keys = this.getDrawLayerKeys(hiddenLayer);

        for (let i = 0; i < keys.length; i++) {
            if (this.getDrawLayer(keys[i]).moveObjsToForward(geomList)) {
                returnValue = true;
                break;
            }
        }

        return returnValue;
    }

    moveToTopKey(key: string, hiddenLayer?: DisplayLayer): boolean {
        const keys = this.getDrawLayerKeys(hiddenLayer);

        keys.forEach(layerKey => {
            const geom = this.getDrawLayer(layerKey).getWithKey(key);

            if (geom) {
                return this.moveToTop(geom);
            }
        });

        return false;
    }

    moveToTop(geom: IDrawableGeometry): boolean {
        return this.getDrawLayer(geom.layer).moveToTop(geom.name);
    }

    moveToIndexKey(key: string, index: number, hiddenLayer?: DisplayLayer): boolean {
        const keys = this.getDrawLayerKeys(hiddenLayer);

        keys.forEach(layerKey => {
            const geom = this.getDrawLayer(layerKey).getWithKey(key);

            if (geom) {
                return this.moveToIndex(geom, index);
            }
        });

        return false;
    }

    moveToIndex(geom: IDrawableGeometry, index: number): boolean {
        return this.getDrawLayer(geom.layer).moveToIndex(geom.name, index);
    }

    moveToBottomKey(key: string, hiddenLayer?: DisplayLayer): boolean {
        const keys = this.getDrawLayerKeys(hiddenLayer);

        keys.forEach(layerKey => {
            const geom = this.getDrawLayer(layerKey).getWithKey(key);

            if (geom) {
                return this.moveToBottom(geom);
            }
        });

        return false;
    }

    moveToBottom(geom: IDrawableGeometry): boolean {
        return this.getDrawLayer(geom.layer).moveToBottom(geom.name);
    }

    clear(): void {
        if (this._sortedLayerMap.size === 0) return;

        this.clearMemoryCache();        
        const keys = Array.from(this._sortedLayerMap.keys());
        keys.forEach(layerKey => {
            const list = this.getDrawLayer(layerKey).getDrawList();

            if (list.length > 0) {
                list.length = 0;
            }
        });
    }

    clearMemoryCache(): void {
        const layerKeys = Array.from(this._sortedLayerMap.keys());

        layerKeys.forEach(layerKey => {
            const list = SearchUtil.getGeometryListByType(this.getDrawLayer(layerKey).getDrawList(), 'currentLocation', true, true, undefined);

            list.forEach(element => {
                if (element instanceof BaseDrawableObject) {
                    (element as BaseDrawableObject).clearMemoryCache();
                }
                element.isChanged = true;
            });
        });
    }

    clearDrawableObject(): void {
        if (this._sortedLayerMap.size === 0) return;

        const keys = Array.from(this._sortedLayerMap.keys());
        keys.forEach(layerKey => {
            const list = this.getDrawLayer(layerKey).getDrawList();
            
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i] instanceof BaseDrawableObject) {
                    list.slice(i, 1);
                }
            }
        });
    }

    getReverseLayerKeys(hiddenLayer?: DisplayLayer): DisplayLayer[] {
        if (this._sortedLayerMap.size === 0) return [];
        return LayerUtil.getReverseLayerKeys(Array.from(this._sortedLayerMap.keys()), hiddenLayer);
    }

    getReverseLayerKeysLinkLayer(hiddenLayer?: DisplayLayer, linkLayer?: DisplayLayer): DisplayLayer[] {
        if (this._sortedLayerMap.size === 0) return [];
        return LayerUtil.getReverseLayerKeysLinkLayer(Array.from(this._sortedLayerMap.keys()), hiddenLayer, linkLayer);
    }

    getDrawLayer(displayLayer: DisplayLayer): DrawLayer {
        if (!this._sortedLayerMap.has(displayLayer)) {
            this._sortedLayerMap.set(displayLayer, new DrawLayer());
        }

        return this._sortedLayerMap.get(displayLayer) as DrawLayer;
    }

    getDrawList(layer: DisplayLayer, memberName: string, visible: boolean | undefined, deepSearch: boolean): IDrawableGeometry[] {
        return SearchUtil.getGeometryListByType(this.getDrawLayer(layer).getDrawList(), memberName, visible, deepSearch, undefined);
    }

    getDrawListAll(hiddenLayer?: DisplayLayer): IDrawableGeometry[] {
        if (this._sortedLayerMap.size === 0) return [];

        if (Array.from(this._sortedLayerMap.keys()).length === 1) return Array.from(this._sortedLayerMap.values())[0].getDrawList();

        const list: IDrawableGeometry[] = [];
        const keys: DisplayLayer[] = this.getReverseLayerKeysLinkLayer(hiddenLayer);

        keys.forEach(key => {
            const layer = this._sortedLayerMap.get(key);
            if (layer) {
                list.push(...layer.getDrawList());
            }
        });

        return list;
    }

    getDrawListAllLinkLayer(hiddenLayer?: DisplayLayer, linkLayer?: DisplayLayer): IDrawableGeometry[] {
        if (this._sortedLayerMap.size === 0) return [];

        if (Array.from(this._sortedLayerMap.keys()).length === 1) return Array.from(this._sortedLayerMap.values())[0].getDrawList();

        const list: IDrawableGeometry[] = [];
        let keys: DisplayLayer[] = [];

        if (!linkLayer) {
            keys = this.getReverseLayerKeys(hiddenLayer);
            if (keys.length > 0) {
                const layer = this._sortedLayerMap.get(keys[0]);
                if (layer) {
                    return layer.getDrawList();
                }
            }
        }

        keys = this.getReverseLayerKeysLinkLayer(hiddenLayer);
        keys.forEach(key => {
            const layer = this._sortedLayerMap.get(key);
            if (layer) {
                list.push(...layer.getDrawList());
            }
        });

        return list;
    }

    getDrawLayerKeys(hiddenLayer?: DisplayLayer): DisplayLayer[] {
        return LayerUtil.getLayerKeys(Array.from(this._sortedLayerMap.keys()), hiddenLayer);
    }
}

export default DrawLayerHandler;