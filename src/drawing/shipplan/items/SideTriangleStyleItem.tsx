import BaseTextItem from "../../items/BaseTextItem";
import { Color, DashStyles } from "../../structures";
import SymbolStyleItem from "./SymbolStyleItem";

class SideTriangleStyleItem extends SymbolStyleItem {
    dashStyle = DashStyles.Solid;
    sizeRate = 0.25;
    textItem = new BaseTextItem();

    constructor() {
        super();
        this.textItem.fontSize = 8;
    }
}

export default SideTriangleStyleItem;