import BaseTextStyleItem from "../../../drawing/items/BaseTextStyleItem";
import { Color } from "../../../drawing/structures";
import EquipmentWheelType from "../structures/EquipmentWheelType";
import EquipmentBaseItem from "./EquipmentBaseItem";

class EquipmentSideItem extends EquipmentBaseItem {
    fromBay = 0;
    toBay = 0;
    fromRow = 0;
    toRow = 0;
    heightTier = 0;
    wheelType = EquipmentWheelType.Wheel;
    nameStyle = new BaseTextStyleItem(false, false, Color.Black());
    fontSize = 7;
    toolTipText = "";
    wheelBackColor = Color.Black();
}

export default EquipmentSideItem;