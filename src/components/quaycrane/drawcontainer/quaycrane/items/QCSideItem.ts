import TextBoxItem from "../../../../../drawing/items/TextBoxItem";
import { Color, Point } from "../../../../../drawing/structures";
import QCSideMachineryHouseItem from "./QCSideMachineryHouseItem";
import QCSideTrolleyItem from "./QCSideTrolleyItem";

class QCSideItem {
    backColor = Color.LightGray();
    borderColor = Color.Black();
    name: string;
    nameStyle = new TextBoxItem();
    poleHeight = 0;
    outReach = 0;
    outReachMargin = 0;
    backReach = 0;
    backReachMargin = 0;
    craneHeight = 0;
    liftTopHeight = 0;
    liftBottomDepth = 0;
    railSpan = 0;
    clearanceHeight = 0;
    machineryHouse = new QCSideMachineryHouseItem();
    trolley: QCSideTrolleyItem[] = [];
    craneThick = 5;
    titlePos = Point.empty();

    constructor(name: string) {
        this.name = name;
    }
}

export default QCSideItem;