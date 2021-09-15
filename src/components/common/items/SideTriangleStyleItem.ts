import BaseTextItem from "../../../drawing/items/BaseTextItem";
import { Color, DashStyles } from "../../../drawing/structures";
import SymbolStyleItem from "./SymbolStyleItem";

class SideTriangleStyleItem extends SymbolStyleItem {
    dashStyle = DashStyles.Solid;
    sizeRate = 0.25;
    textItem = new BaseTextItem();

    constructor() {
        super(Color.Black(), Color.Transparent(), 1);
        this.textItem.fontSize = 8;
    }
}

export default SideTriangleStyleItem;