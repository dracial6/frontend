import SearchUtil from "../../../utils/SearchUtil";
import TBayRowGroup from "../../yard/bayview/TBayRowGroup";
import YBayView from "../../yard/bayview/YBayView";
import EquipmentSideItem from "../items/EquipmentSideItem";
import ViewDirection from "../structures/ViewDirection";
import BaseEquipmentHandler from "./BaseEquipmentHandler";

class EquipmentHandler extends BaseEquipmentHandler {
    private _yBayView: YBayView;
    
    constructor(yBayView: YBayView) {
        super();
        this._yBayView = yBayView;
    }

    addEquipment(viewDir: ViewDirection, equipmentItem: EquipmentSideItem) : void {
        if (equipmentItem === undefined) {
            return;
        }

        const key = super.getEquipmentKey(equipmentItem.getName(), equipmentItem.block
                , equipmentItem.fromBay, equipmentItem.fromRow, equipmentItem.toBay, equipmentItem.toRow);
        this.addEquipmentItem(key, equipmentItem);
        const tBay = this._yBayView.getTBayRowGroup(viewDir, equipmentItem.block, equipmentItem.fromBay, equipmentItem.fromRow);
        if (tBay) {
            tBay.addEquipment(equipmentItem);
        }
    }

    removeEquipmentByKey(name: string) : void {
        const list = this.getEquipmentInfoByName(name);
        if (list.length > 0) {            
            const gList = SearchUtil.getGeometryListByMember(this._yBayView.getDrawArea().getDefaultDrawList().getDrawList(), "TBayRowGroup");
            if (gList) {
                for (let item of gList) {
                    (item as TBayRowGroup).removeEquipmentByKey(name);
                }
            }

            this.removeEquipmentItemByKey(name);
        }
    }

    removeEquipmentDetail(viewDir: ViewDirection, name: string, blockName: string, fromBay: number, fromRow: number, toBay: number, toRow: number) : void {
        const tBay = this._yBayView.getTBayRowGroup(viewDir, blockName, fromBay, fromRow);
        if (tBay) {
            tBay.removeEquipmentDetail(name, blockName, fromBay, fromRow, toBay, toRow);
            super.removeEquipmentItemDetail(name, blockName, fromBay, fromRow, toBay, toRow);
        }
    }

    removeAllEquipment() : void {
        if (this.getEquipmentInfo().size === 0) return;
        try {
            const list = SearchUtil.getGeometryListByMember(this._yBayView.getDrawArea().getDefaultDrawList().getDrawList(), "TBayRowGroup");
            if (!list) return;
            for (let item of list) {
                (item as TBayRowGroup).removeAllEquipment();
            }

            this.getEquipmentInfo().clear();
        } catch (ex) {
            throw ex;
        }
    }

    setVisibleEquipment(visible: boolean) : void {
        const list = SearchUtil.getGeometryListByMember(this._yBayView.getDrawArea().getDefaultDrawList().getDrawList(), "TBayRowGroup");
        if (list.length === 0) return;
        for (let item of list) {
            (item as TBayRowGroup).setVisibleEquipment(visible);
        }
        this._yBayView.getDrawArea().refresh();
    }
}

export default EquipmentHandler;