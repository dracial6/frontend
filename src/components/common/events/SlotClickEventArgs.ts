import MouseButtons from "../../../common/structures/MouseButtons";
import BoundaryItem from "../items/BoundaryItem";
import ViewDirection from "../structures/ViewDirection";
import YTLaneLocTypes from "../structures/YTLaneLocTypes";

class SlotClickEventArgs {
    button = MouseButtons.None;
    block = "";
    bay = 0;
    row = 0;
    tier = 0;
    ytLaneLocTypes = YTLaneLocTypes.None;
    x = 0;
    y = 0;
    moveX = 0;
    moveY = 0;
    blockViewDirection = ViewDirection.Front;
    mouseEvent = new MouseEvent("");
    elementName = "";
    text = "";
    boundaryList: BoundaryItem[] = [];
}

export default SlotClickEventArgs;