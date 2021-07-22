import IDrawableGeometry from "../elements/IDrawableGeometry";

class DrawDragEventArgs {
    mouseButton: number;
    item: any;
    geometryItems: IDrawableGeometry[];

    constructor(button: number, item: any, geomList: IDrawableGeometry[]) {
        this.mouseButton = button;
        this.item = item;
        this.geometryItems = geomList;
    }
}

export default DrawDragEventArgs;