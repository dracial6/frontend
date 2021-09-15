import MouseButtons from "../../../common/structures/MouseButtons";
import { Point } from "../../../drawing/structures";
import SlotPositionItem from "../items/SlotPositionItem";

class SlotDragEventArgs {
    selectedList : SlotPositionItem[] = [];
    blockList : string[] = [];
    button = MouseButtons.None;
    mouseDragStartPoint = Point.empty();
    mouseDragEndPoint = Point.empty();
    startBlock = "";
    endBlock = "";
    mouseStartBlock = "";
    mouseEndBlock = "";
    startBay = 0;
    endBay = 0;
    mouseStartBay = 0;
    mouseEndBay = 0;
    startRow = 0;
    endRow = 0;
    mouseStartRow = 0;
    mouseEndRow = 0;
    mouseEvent?: MouseEvent;
    startTier = 0;
    endTier = 0;
    bayRowList : number[] = [];
}

export default SlotDragEventArgs;