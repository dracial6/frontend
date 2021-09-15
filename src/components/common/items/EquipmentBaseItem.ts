import { Color } from "../../../drawing/structures";
import BaseItem from "./BaseItem";
import EquipmentType from "../structures/EquipmentType";
import WorkPosition from "../structures/WorkPosition";

class EquipmentBaseItem extends BaseItem {
    private _name = "";
    
    backColor = Color.Transparent();
    borderColor = Color.Transparent();
    equipmentType = EquipmentType.QC;
    block = "";
    x = 0;
    y = 0;
    workPosition = WorkPosition.StartRow;

    getName(): string {
        return this._name;
    }

    setName(name: string): void {
        this._name = name;
        this.searchKey = name;
    }
}

export default EquipmentBaseItem;