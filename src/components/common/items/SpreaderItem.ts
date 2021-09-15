import { Color } from "../../../drawing/structures";
import BaseItem from "./BaseItem";
import YTLaneLocTypes from "../structures/YTLaneLocTypes";

class SpreaderItem extends BaseItem {
    name = "";
    visible = false;
    block = "";
    bayIndex = 0;
    rowIndex = 0;
    tierIndex = 0;
    backColor = Color.Transparent();
    size = 0;
    locked = false;
    lockBackColor = Color.Transparent();
    tooltipValue = "";
    lockedContainerNo = "";
    ytLaneLocTypes = YTLaneLocTypes.None;
}

export default SpreaderItem;