import BaseTextItem from "../../../drawing/items/BaseTextItem";
import { Color, ContentAlignment, DashStyles, DrawTextDirection } from "../../../drawing/structures";
import BoundaryMode from "../structures/BoundaryMode";
import ViewDirection from "../structures/ViewDirection";

class BoundaryItem {
    block = '';
    startBay = 0;
    startRow = 0;
    startTier = 0;
    endBay = 0;
    endRow = 0;
    endTier = 0;
    seq = 0;
    borderColor = Color.Black();
    backColor = Color.Gray();
    customBackColor?: Color;
    lineThick = 1;
    borderDashStyle = DashStyles.Solid;
    tooltipText = '';
    boundaryText = new BaseTextItem();
    leftMargin = 0;
    topMargin = 0;
    boundaryType = BoundaryMode.Plan;
    drawTextDirection = DrawTextDirection.Normal;
    wrappedText = false;
    textAlign = ContentAlignment.TopLeft;
    ixCD = '';
    serviceLane = '';
    vvd = '';
    groupingPattern = '';
    pods = '';
    remark = '';
    userDefineKey = '';
    viewDirection = ViewDirection.Front;
    visibleTracker = false;

    specificKey(): string {
        return this.ixCD + this.vvd + this.groupingPattern + this.pods + this.seq;
    }
}

export default BoundaryItem;