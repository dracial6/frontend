import LayerUtil from "../utils/LayerUtil";
import BaseDrawableList from "./BaseDrawableList";
import BaseDrawArea from "./BaseDrawArea";
import DrawLayerHandler from "./DrawLayerHandler";
import DrawLayer from "./elements/DrawLayer";
import IDrawableGeometry from "./elements/IDrawableGeometry";
import { DisplayLayer } from "./structures";

class LayerDrawableList extends BaseDrawableList {
    private _layerHandler = new DrawLayerHandler();

    hiddenLayer?: DisplayLayer;
    linkLayer = LayerUtil.getDisplayLayerLinkAll(true);

    constructor(isBringToTop: boolean) {
        super(isBringToTop);
    }

    addLayer(layer: DrawLayer, displayLayer: DisplayLayer): void {
        this._layerHandler.addLayer(layer, displayLayer);
    }

    removeLayer(displayLayer: DisplayLayer): void {
        this._layerHandler.removeLayer(displayLayer);
    }

    getDrawListInLayer(layer: DisplayLayer): IDrawableGeometry[] {
        let drawLayer = this._layerHandler.getDrawLayer(layer);
        let list: IDrawableGeometry[] = [];

        if (drawLayer) {
            list = drawLayer.getDrawList();
        }

        return list;
    }

    addToLayer(obj: IDrawableGeometry, displayLayer: DisplayLayer): void {
        this._layerHandler.add(obj, displayLayer);
    }

    addToLayerCheckDuplication(obj: IDrawableGeometry, checkDuplication: boolean, displayLayer: DisplayLayer): void {
        this._layerHandler.addCheckDuplication(obj, checkDuplication, displayLayer);
    }

    updateToLayer(obj: IDrawableGeometry, displayLayer: DisplayLayer): void {
        this._layerHandler.update(obj, displayLayer);
    }

    getIndexInLayer(obj: IDrawableGeometry, displayLayer: DisplayLayer): number {
        return this._layerHandler.getIndex(obj, displayLayer);
    }

    getIndexKeyInLayer(key: string, displayLayer: DisplayLayer): number {
        return this._layerHandler.getIndexKey(key, displayLayer);
    }

    insertToLayer(index: number, obj: IDrawableGeometry, displayLayer: DisplayLayer): void {
        this._layerHandler.insert(index, obj, displayLayer);
    }

    removeAtInLayer(index: number, displayLayer: DisplayLayer): void {
        this._layerHandler.removeAt(index, displayLayer);
    }

    removeKeyInLayer(key: string, displayLayer: DisplayLayer): void {
        this._layerHandler.removeKey(key, displayLayer);
    }

    getDrawListInLayerDetail(layer: DisplayLayer, memberName: string, visible: boolean, deepSearch: boolean): IDrawableGeometry[] {
        return this._layerHandler.getDrawList(layer, memberName, visible, deepSearch);
    }

    clear(): void {
        this._layerHandler.clear();
    }

    clearDrawableObject(): void {
        this._layerHandler.clearDrawableObject();
    }

    clearMemoryCache(): void {
        this._layerHandler.clearMemoryCache();
    }

    getDrawList(): IDrawableGeometry[] {
        return this._layerHandler.getDrawListAll(this.hiddenLayer);
    }

    getDrawListAtEventHandle(): IDrawableGeometry[] {
        return this._layerHandler.getDrawListAllLinkLayer(this.hiddenLayer, this.linkLayer);
    }

    moveSelectionToTop(): boolean {
        return this._layerHandler.moveSelectionToTop(this.hiddenLayer);
    }

    moveObjToForward(geometry: IDrawableGeometry): boolean {
        return this._layerHandler.moveObjToForward(geometry, this.hiddenLayer);
    }

    moveObjsToForward(list: IDrawableGeometry[]): boolean {
        return this._layerHandler.moveObjsToForward(list);
    }

    moveSelectionToBottom(): boolean {
        return this._layerHandler.moveSelectionToBottom(this.hiddenLayer);
    }

    moveToTop(key: string): boolean {
        return this._layerHandler.moveToTopKey(key, this.hiddenLayer);
    }

    moveToBottom(key: string): boolean {
        return this._layerHandler.moveToBottomKey(key);
    }

    moveToIndex(key: string, index: number): boolean {
        return this._layerHandler.moveToIndexKey(key, index);
    }

    protected drawNormal(ctx: CanvasRenderingContext2D, drawArea: BaseDrawArea): void {
        let layerKeys = this._layerHandler.getDrawLayerKeys(this.hiddenLayer);

        layerKeys.forEach(key => {
            this.drawGeometry(ctx, drawArea, this.getDrawLayer(key).getDrawList());
        });
    }

    getDrawLayer(displayLayer: DisplayLayer): DrawLayer {
        return this._layerHandler.getDrawLayer(displayLayer);
    }

    protected getDefaultDrawLayer(): DrawLayer {
        return this._layerHandler.getDrawLayer(DisplayLayer.One);
    }
    
    protected invalidateDrawList(): boolean {
        throw new Error("Method not implemented.");
    }
    protected invalidateCheckObject(obj: IDrawableGeometry): boolean {
        throw new Error("Method not implemented.");
    }
}

export default LayerDrawableList;