import BaseDrawableList from "./BaseDrawableList";
import BaseDrawArea from "./BaseDrawArea";
import BaseGeometry from "./elements/BaseGeometry";
import DrawLayer from "./elements/DrawLayer";
import IDrawableGeometry from "./elements/IDrawableGeometry";
import LayerDrawableList from "./LayerDrawableList";
import { DisplayLayer } from "./structures";

class LayerDrawArea extends BaseDrawArea {
    private _graphicsList: LayerDrawableList;
    
    constructor(props: any) {
        super(props);
        this._graphicsList = new LayerDrawableList(this._autoSelectionToFront);
    }

    addToLayer(obj: IDrawableGeometry, displayLayer: DisplayLayer): void {
        this.addToLayerBackground(obj, false, displayLayer);
    }
    
    addToLayerBackground(obj: IDrawableGeometry, isBackground: boolean, displayLayer: DisplayLayer): void {
        if (obj instanceof BaseGeometry) {
            (obj as BaseGeometry).layer = displayLayer;
        }

        obj.isBackground = isBackground;
        this._graphicsList.addToLayer(obj, displayLayer);
        super.getDrawArrangeHandler().reset();
    }

    updateToLayer(obj: IDrawableGeometry, displayLayer: DisplayLayer): void {
        this._graphicsList.updateToLayer(obj, displayLayer);
        super.getDrawArrangeHandler().reset();
    }

    removeInLayer(obj: IDrawableGeometry, displayLayer: DisplayLayer): void {
        this._graphicsList.removeKeyInLayer(obj.name, displayLayer);
        super.getDrawArrangeHandler().reset();
    }

    removeKeyInLayer(key: string, displayLayer: DisplayLayer): void {
        this._graphicsList.removeKeyInLayer(key, displayLayer);
        super.getDrawArrangeHandler().reset();
    }

    removeAtInLayer(index: number, displayLayer: DisplayLayer): void {
        this._graphicsList.removeAtInLayer(index, displayLayer);
        super.getDrawArrangeHandler().reset();
    }

    addLayer(layer: DrawLayer, displayLayer: DisplayLayer): void {
        this._graphicsList.addLayer(layer, displayLayer);
    }

    removeLayer(displayLayer: DisplayLayer): void {
        this._graphicsList.removeLayer(displayLayer);
    }

    getDrawListInLayer(layer: DisplayLayer): IDrawableGeometry[] {
        return this._graphicsList.getDrawListInLayer(layer);
    }

    getDrawListDetail(layer: DisplayLayer, memberName: string, visible: boolean, deepSearch: boolean): IDrawableGeometry[] {
        return this._graphicsList.getDrawListInLayerDetail(layer, memberName, visible, deepSearch);
    }

    getDefaultDrawList(): BaseDrawableList {
        return this._graphicsList;
    }

    arrangeDrawObject(enforceArrange: boolean): void {
        super.doArrangeDrawObject(this.getDrawListInLayer(DisplayLayer.One), enforceArrange);
    }
}

export default LayerDrawArea;