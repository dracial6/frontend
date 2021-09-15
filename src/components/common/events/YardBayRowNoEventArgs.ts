import MouseButtons from "../../../common/structures/MouseButtons";
import { DrawControlEventType } from "../../../drawing/structures";
import YardBayRowNoSelectItem from "../items/YardBayRowNoSelectItem";

class YardBayRowNoEventArgs {
    button = MouseButtons.None;
    mouseEvent: MouseEvent;
    eventType = DrawControlEventType.None;
    selectedItem? : YardBayRowNoSelectItem;
    selectedItems : YardBayRowNoSelectItem[] = [];
    
    constructor (mouseEvent: MouseEvent, eventType: DrawControlEventType, selectedItms: YardBayRowNoSelectItem[]) {
        this.button = mouseEvent.button;
        this.mouseEvent = mouseEvent;
        this.eventType = eventType;
        this.selectedItems = selectedItms;

        if (selectedItms.length > 0) {
            this.selectedItem = selectedItms[0];
        }
    }
}

export default YardBayRowNoEventArgs;