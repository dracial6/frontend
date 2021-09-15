import TextBoxItem from "../../../drawing/items/TextBoxItem";

class ChassisGuideEventArgs {
    chassisGuide: TextBoxItem;
    mouseEvent: MouseEvent;
    
    constructor(mouseEvent: MouseEvent, chassisGuide: TextBoxItem) {
        this.chassisGuide = chassisGuide;
        this.mouseEvent = mouseEvent;
    }
}

export default ChassisGuideEventArgs;