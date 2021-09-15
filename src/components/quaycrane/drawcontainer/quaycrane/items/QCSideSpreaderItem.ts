import { Color } from "../../../../../drawing/structures";
import QCSideContainerItem from "./QCSideContainerItem";

class QCSideSpreaderItem {
    width = 0;
    height = 0;
    backColor = Color.Blue();
    borderColor = Color.Black();
    lockStatus = false;
    hoistPosition = 0;
    container = new QCSideContainerItem();
}

export default QCSideSpreaderItem;