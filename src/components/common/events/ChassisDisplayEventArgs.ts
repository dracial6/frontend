import ChassisDisplayItem from "../items/ChassisDisplayItem";

class ChassisDisplayEventArgs {
    chassis: ChassisDisplayItem;
    mouseEvent: MouseEvent;
    
    constructor(mouseEvent: MouseEvent, chassisDisplayItem: ChassisDisplayItem) {
        this.chassis = chassisDisplayItem;
        this.mouseEvent = mouseEvent;
    }
}

export default ChassisDisplayEventArgs;