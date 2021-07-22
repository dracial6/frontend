import { DashStyles } from "../../structures";
import SymbolStyleItem from "./SymbolStyleItem";

class SideRectangleStyleItem extends SymbolStyleItem {
    leftOverSize = 0;
    topOverSize = 0;
    rightOverSize = 0;
    dashStyle = DashStyles.Solid;
    sizeRate = 0.5;
}

export default SideRectangleStyleItem;