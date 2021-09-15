import BaseDrawableList from "./BaseDrawableList";
import BaseDrawArea from "./BaseDrawArea";
import DrawableList from "./DrawableList";

class DrawArea extends BaseDrawArea {
    private _graphicsList: DrawableList;

    constructor(props: any) {
        super(props);
        this._graphicsList = new DrawableList(this._autoSelectionToFront);
    }

    getAutoSelectionToFront(): boolean {
        return this._autoSelectionToFront;
    }

    setAutoSelectionToFront(value: boolean) {
        this._autoSelectionToFront = value;
        this.getDefaultDrawList().isBringToTop = value;
    }

    getDefaultDrawList(): BaseDrawableList {
        return this._graphicsList;
    }
}

export default DrawArea;