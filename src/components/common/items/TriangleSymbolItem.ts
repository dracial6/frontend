import { Color, TriangleDir } from "../../../drawing/structures";
import SymbolStyleItem from "./SymbolStyleItem";

class TriangleSymbolItem extends SymbolStyleItem {
    displayMode = TriangleDir.Up;

    constructor() {
        super(Color.Black(), Color.White(), 0.33);
    }
}

export default TriangleSymbolItem;