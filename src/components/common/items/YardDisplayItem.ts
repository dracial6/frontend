import BaseTextStyleItem from "../../../drawing/items/BaseTextStyleItem";
import { Color } from "../../../drawing/structures";

class YardDisplayItem {
    blockNo?: BaseTextStyleItem;
    bayNo?: BaseTextStyleItem;
    rowNo?: BaseTextStyleItem;
    tier?: BaseTextStyleItem;
    ytPassingDirColor = Color.Transparent();
    rtPassingDirColor = Color.Transparent();
}

export default YardDisplayItem;