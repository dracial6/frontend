import MouseButtons from "../../../common/structures/MouseButtons";
import { DrawControlEventType } from "../../../drawing/structures";
import YardBayRowNoSelectItem from "../items/YardBayRowNoSelectItem";

class YardBayRowBarEventArgs {
    button: MouseButtons;
    mouseEvent: MouseEvent;
    eventType: DrawControlEventType;
    selectedItem: YardBayRowNoSelectItem;

    constructor(mouseEvent: MouseEvent, eventType: DrawControlEventType, selectedItem: YardBayRowNoSelectItem) {
        this.button = mouseEvent.button;
        this.mouseEvent = mouseEvent;
        this.eventType = eventType;
        this.selectedItem = selectedItem;
    }
}

export default YardBayRowBarEventArgs;