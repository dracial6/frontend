import EquipmentSideItem from "../items/EquipmentSideItem";
import EquipmentType from "../structures/EquipmentType";

class EquipmentEventArgs {
    equipmentName: string;
    equipmentType: EquipmentType;
    mouseEvent: MouseEvent;
    equipmentSideItem: EquipmentSideItem;
    
    constructor(mouseEvent: MouseEvent, equipmentSideItem: EquipmentSideItem) {
        this.mouseEvent = mouseEvent;
        this.equipmentName = equipmentSideItem.getName();
        this.equipmentType = equipmentSideItem.equipmentType;
        this.equipmentSideItem = equipmentSideItem;
    }
}

export default EquipmentEventArgs;